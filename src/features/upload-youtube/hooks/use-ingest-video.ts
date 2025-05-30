import { useMutation, useQueryClient } from 'react-query';
import { IngestVideoPost, IngestVideoResponse } from '../types/api-types';
import axiosClient from '@/lib/axios';
import { SuccessfulResponse } from '@/types/api-types';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { DEFAULT_WORKSPACE_PROPERTIES } from '@/features/files-pdf-chunks-sidebar/consts/default-workspace-file';
import { useProcessFilesQueryStore } from '@/features/files-pdf-chunks-sidebar/stores/process-files-query-store';
import { useSettledFilesStore } from '@/features/files-pdf-chunks-sidebar/stores/settled-files-store';
import { AxiosError } from 'axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
const ingestVideoPost = async (payload: IngestVideoPost) => {
  return axiosClient.post<IngestVideoPost, SuccessfulResponse<IngestVideoResponse>>('/files/ingest/video', payload);
};

export const useIngestVideo = (crudPayload?: CRUDFilesPost) => {
  const queryClient = useQueryClient();
  const { addSettledFiles } = useSettledFilesStore();
  const { addInProgressFiles } = useProcessFilesQueryStore();
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  return useMutation(ingestVideoPost, {
    onSuccess: successPayload => {
      const settledFile: WorkspaceFile = {
        ...DEFAULT_WORKSPACE_PROPERTIES,
        workspace_file_id: successPayload.data.workspace_file_id,
        filename: `${successPayload.data.external_media_name}.youtube`,
        status: WorkspaceFileUploadStatus.PENDING,
      };
      addSettledFiles([settledFile]);

      queryClient.invalidateQueries('subscriptionStatus');
    },
    onError: (e: AxiosError, postPayload) => {
      if (e.response?.status === 426) {
        setReferrer('youtube-limit');
        setIsOpen(true);
      } else {
        const settledFile: WorkspaceFile = {
          ...DEFAULT_WORKSPACE_PROPERTIES,
          completion_percentage: 100,
          filename: `${postPayload.video_url}.youtube`,
          status: WorkspaceFileUploadStatus.FAILED,
        };
        addSettledFiles([settledFile]);
      }
    },
    onMutate: async filePost => {
      await queryClient.cancelQueries({ queryKey: ['files'] });
      const optimisticFile: WorkspaceFile = {
        ...DEFAULT_WORKSPACE_PROPERTIES,
        ...new File([new Blob()], `${filePost.video_url}.youtube`),
        status: WorkspaceFileUploadStatus.UPLOADING,
        filename: `${filePost.video_url}.youtube`,
        completion_percentage: 0,
      };

      addInProgressFiles([optimisticFile]);

      return { optimisticFile };
    },
    onSettled: () => {
      if (crudPayload?.chat_id || crudPayload?.workspace_id) {
        queryClient.refetchQueries(getFilesQueryKey(crudPayload));
      }
      queryClient.invalidateQueries('chatHistory');
      queryClient.invalidateQueries(['files']);
    },
  });
};
