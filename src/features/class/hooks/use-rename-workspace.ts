import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { RenameWorkspacePost, RenameWorkspaceResponse } from '../types/workspace-api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

const renameWorkspace = async (renameWorkspacePayload: RenameWorkspacePost): Promise<RenameWorkspaceResponse> => {
  const res = await axiosClient.post<RenameWorkspacePost, SuccessfulResponse<RenameWorkspaceResponse>>(
    `/workspace/${renameWorkspacePayload.workspace_id}/rename`,
    renameWorkspacePayload,
    { params: renameWorkspacePayload },
  );
  return res.data;
};

export const useRenameWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(renameWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries('side-bar');
      queryClient.invalidateQueries('list-classes');
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
