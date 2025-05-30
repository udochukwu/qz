import axiosClient from '@/lib/axios';
import { useMutation, useQueryClient } from 'react-query';
import { CRUDFilesPost, DeleteFilePost, DeleteFileResponse, GetFilesResponse } from '../../types/api-types';
import { SuccessfulResponse } from '@/types/api-types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { WorkspaceFile } from '../../types/types';
import { getFilesQueryKey } from '../../utils/get-files-query-key';
import { sendErrorMessage } from '@/utils/send-error-message';

const deleteFilePost = async (payload: DeleteFilePost) => {
  if (payload.myfiles) {
    return axiosClient.delete<DeleteFilePost, SuccessfulResponse<DeleteFileResponse>>(
      `/files/v1/${payload.workspace_file_id}`,
      { params: { force: payload.force } },
    );
  } else {
    return axiosClient.delete<DeleteFilePost, SuccessfulResponse<DeleteFileResponse>>(
      `/files/${payload.workspace_file_id}`,
      { params: { force: payload.force } },
    );
  }
};

interface Props {
  crudPayload?: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
}

export const useFileDelete = ({ crudPayload, excludeFiles }: Props) => {
  const queryClient = useQueryClient();

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const deleteFileMutation = useMutation(deleteFilePost, {
    onMutate: async postDeleteFilePayload => {
      await queryClient.cancelQueries({
        queryKey: filesQueryKey,
      });
      const previousGetFileSnapshot: GetFilesResponse | undefined = queryClient.getQueryData(filesQueryKey);

      queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        return { files: prevFiles.filter(file => file.workspace_file_id !== postDeleteFilePayload.workspace_file_id) };
      });

      return previousGetFileSnapshot;
    },
    onSettled: () => {
      queryClient.invalidateQueries(filesQueryKey);
      queryClient.invalidateQueries('chatHistory');
      queryClient.invalidateQueries('unsavedRecordings');
    },
    onSuccess: (_, postDeleteFilePayload) => {
      toast.success('File deleted successfully');
      queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        return {
          files: prevFiles
            .filter(file => file.workspace_file_id !== postDeleteFilePayload.workspace_file_id)
            .map(file => ({ ...file, isSelected: false })),
        };
      });
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });

  async function deleteAllFilesPost(files: WorkspaceFile[]) {
    const deleteAllFilesPosts: DeleteFilePost[] = files.map(file => {
      return { workspace_file_id: file.workspace_file_id };
    });
    const deleteFilePromises = deleteAllFilesPosts.map(postPayload => {
      return deleteFilePost(postPayload);
    });
    return await Promise.all(deleteFilePromises);
  }

  const deleteAllFilesMutation = useMutation(deleteAllFilesPost, {
    onMutate: async postDeleteFilePayload => {
      await queryClient.cancelQueries({
        queryKey: filesQueryKey,
      });
      const previousGetFileSnapshot: GetFilesResponse | undefined = queryClient.getQueryData(filesQueryKey);

      queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        const fileIds = postDeleteFilePayload.map(file => file.workspace_file_id);
        return {
          files: prevFiles
            .filter(file => !fileIds.includes(file.workspace_file_id))
            .map(file => ({ ...file, isSelected: false })),
        };
      });

      return previousGetFileSnapshot;
    },
    onSettled: () => {
      queryClient.invalidateQueries(filesQueryKey);
      queryClient.invalidateQueries('chatHistory');
    },
    onSuccess: () => {
      toast.success('File deleted successfully');
    },
  });

  return { deleteFileMutation, deleteAllFilesMutation };
};
