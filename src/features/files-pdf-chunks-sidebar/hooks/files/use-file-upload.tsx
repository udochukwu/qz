import axiosClient from '@/lib/axios';
import { useMutation, useQueryClient } from 'react-query';
import { CRUDFilesPost, UploadFilePost, UploadFilesResponse } from '../../types/api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { AxiosError } from 'axios';
import { getFilesQueryKey } from '../../utils/get-files-query-key';
import { calculateSHA256 } from '../../utils/get-file-sha';
import { BlockBlobClient } from '@azure/storage-blob';
import * as pdfjs from 'pdfjs-dist';
import toast from 'react-hot-toast';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../../types/types';
import { DEFAULT_WORKSPACE_PROPERTIES } from '../../consts/default-workspace-file';
import { useProcessFilesQueryStore } from '../../stores/process-files-query-store';
import { useSettledFilesStore } from '../../stores/settled-files-store';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useUserStore } from '@/stores/user-store';
import useUploadProgressStore from '@/hooks/use-upload-progress';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js';

export interface FileChangeDetails {
  acceptedFiles: File[];
}

const maxFreeFileSize = 60 * 1024 * 1024;
const maxFreeFilePages = 100;
const minFileUploadSize = (1024 * 1024) / 2;

const useFileUpload = ({ excludeFiles }: { excludeFiles?: CRUDFilesPost }) => {
  const { addSettledFiles } = useSettledFilesStore();
  const { setIsOpen } = useUpgradePlanModalStore();
  const { experiments } = useUserStore();
  const { setProgress } = useUploadProgressStore();

  const fetchUploadFileURL = async ({ isPro, file, payload, langcode }: UploadFilePost) => {
    const monthly_limit_user = experiments && experiments['monthly-limit-paywall'] && !isPro;

    const bytes_size = file.size;
    const file_sha256 = await calculateSHA256(file);
    const filename = file.name;
    const file_type = file.type;
    const body = {
      ...payload,
      bytes_size,
      file_sha256,
      filename,
      file_type,
      langcode,
    };

    if (monthly_limit_user && bytes_size > maxFreeFileSize) {
      setIsOpen(true);
      throw new Error('File is bigger than 60 MB. Please upgrade your plan to upload larger files.');
    }

    try {
      const bytes = await file.arrayBuffer();
      const doc = await pdfjs.getDocument(bytes).promise;

      if (monthly_limit_user && doc.numPages > maxFreeFilePages) {
        setIsOpen(true);
        toast.error('File is too large. Please upgrade your plan to upload larger files.');
        throw new Error('File is too large. Please upgrade your plan to upload larger files.');
      }

      if (doc.numPages > 4000) {
        toast.error('File is too large. Please upload a file with less than 4000 pages.');
        throw new Error('File is too large. Please upload a file with less than 4000 pages.');
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axiosClient.post<{}, SuccessfulResponse<UploadFilesResponse>>('/files/v1/upload', body);
      const { upload_url, already_registered, file_id, workspace_file_id, blob_already_uploaded } = response.data;

      if (already_registered) {
        return { file, workspace_file_id, file_id, isRegistered: true };
      }

      if (!blob_already_uploaded) {
        const blockBlobClient = new BlockBlobClient(upload_url);
        const uploadResponse = await blockBlobClient.uploadData(file, {
          maxSingleShotSize: minFileUploadSize,
          blockSize: minFileUploadSize,
          onProgress: progress => {
            const percentComplete = Math.round((progress.loadedBytes / file.size) * 100);
            setProgress(file_sha256, percentComplete);
          },
        });
        if (uploadResponse._response.status != 201) {
          throw new Error('Failed to upload file');
        }

        const ingestionTriggerResponse = await axiosClient.post('/files/v1/upload/done', { file_id });

        if (ingestionTriggerResponse.status != 200) {
          throw new Error('Failed to trigger ingestion');
        }
      }

      return { file, workspace_file_id, file_id, isRegistered: false };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('AxiosError:', error.response?.data);
        if (error.response?.status === 409 && error.response?.data?.detail.includes('with the same')) {
          return { status: 'file_exists', file };
        }
        if (error.response?.status === 426) {
          throw new Error('Upgrade required');
        }
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Failed to upload file');
    }
  };

  const queryClient = useQueryClient();

  const { addInProgressFiles } = useProcessFilesQueryStore();

  const { mutateAsync: onFileUpload, ...rest } = useMutation(fetchUploadFileURL, {
    onMutate: async filePost => {
      const sha256 = await calculateSHA256(filePost.file);
      await queryClient.cancelQueries({ queryKey: ['files'] });
      const optimisticFile: WorkspaceFile = {
        ...DEFAULT_WORKSPACE_PROPERTIES,
        ...filePost.file,
        sha256,
        status: WorkspaceFileUploadStatus.PENDING,
        filename: filePost.file?.name,
        completion_percentage: 0,
      };

      addInProgressFiles([optimisticFile]);

      return { optimisticFile };
    },
    onSuccess: async successPayload => {
      if (successPayload.status === 'file_exists') {
        toast('File already uploaded', {
          icon: '👋',
        });
        return;
      } else if (successPayload.isRegistered) {
        const settledFile: WorkspaceFile = {
          ...DEFAULT_WORKSPACE_PROPERTIES,
          ...successPayload.file,
          completion_percentage: 100,
          workspace_file_id: '',
          filename: successPayload.file?.name,
          status: WorkspaceFileUploadStatus.FINISHED,
        };

        addSettledFiles([settledFile]);
      } else {
        const sha256 = await calculateSHA256(successPayload.file);
        const settledFile: WorkspaceFile = {
          ...DEFAULT_WORKSPACE_PROPERTIES,
          ...successPayload.file,
          workspace_file_id: successPayload.workspace_file_id ?? '',
          sha256,
          filename: successPayload.file?.name,
          status: WorkspaceFileUploadStatus.PENDING,
        };

        addSettledFiles([settledFile]);
      }
      queryClient.invalidateQueries('subscriptionStatus');
      return successPayload;
    },
    onError: (e: AxiosError<{ detail: string; status: number }>, postPayload) => {
      const settledFile: WorkspaceFile = {
        ...DEFAULT_WORKSPACE_PROPERTIES,
        ...postPayload.file,
        completion_percentage: 100,
        filename: postPayload.file?.name,
        status: WorkspaceFileUploadStatus.FAILED,
      };
      if (e.message !== 'Upgrade required') {
        toast.error(e.message);
        addSettledFiles([settledFile]);
      }
    },
    onSettled: (successPayload, errorPayload, postPayload) => {
      const queryKey = getFilesQueryKey(
        { workspace_id: postPayload.payload?.workspace_id, chat_id: postPayload.payload?.chat_id },
        excludeFiles,
      );

      queryClient.invalidateQueries(['files']);
      queryClient.refetchQueries(queryKey);
      queryClient.invalidateQueries('chatHistory');
      queryClient.invalidateQueries('chatSuggestion');
    },
  });

  return { onFileUpload, ...rest };
};

export default useFileUpload;
