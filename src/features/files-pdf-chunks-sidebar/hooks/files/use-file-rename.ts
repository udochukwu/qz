import { useMutation, useQueryClient } from 'react-query';
import { CRUDFilesPost, GetFilesResponse, RenameFilePost, RenameFileResponse } from '../../types/api-types';
import { getCRUDFilesID } from '../../utils/get-crud-files-id';
import { SuccessfulResponse } from '@/types/api-types';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import { getFilesQueryKey } from '../../utils/get-files-query-key';
import { sendErrorMessage } from '@/utils/send-error-message';

const renameFilePost = async (payload: RenameFilePost) => {
  return axiosClient.post<RenameFilePost, SuccessfulResponse<RenameFileResponse>>(
    `/files/${payload.workspace_file_id}/rename`,
    payload,
    { params: payload },
  );
};

interface Props {
  crudPayload?: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
  onSuccess?: VoidFunction;
}

export const useFileRename = ({ crudPayload, excludeFiles, onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const { mutateAsync } = useMutation(renameFilePost, {
    onMutate: async renameFilePayload => {
      await queryClient.cancelQueries({
        queryKey: filesQueryKey,
      });

      const previousGetFileSnapshot: GetFilesResponse | undefined = queryClient.getQueryData(filesQueryKey);

      queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        const editedFile = prevFiles.find(file => file.workspace_file_id === renameFilePayload.workspace_file_id);
        if (editedFile) {
          editedFile.filename = renameFilePayload.new_filename;
        }
        return { files: prevFiles };
      });

      return previousGetFileSnapshot;
    },
    onSuccess,
    onSettled: () => {
      queryClient.invalidateQueries(filesQueryKey);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });

  return mutateAsync;
};
