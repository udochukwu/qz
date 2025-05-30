import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { AddChatToWorkspacePost, AddChatToWorkspaceResponse } from '../types/workspace-api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
const addChatToWorkspace = async (payload: AddChatToWorkspacePost): Promise<AddChatToWorkspaceResponse> => {
  const res = await axiosClient.post<AddChatToWorkspacePost, SuccessfulResponse<AddChatToWorkspaceResponse>>(
    '/chat/add-to-class',
    payload,
  );
  return res.data;
};

export const useAddChatToWorkspace = (onSuccess?: (payload: AddChatToWorkspaceResponse) => void) => {
  const queryClient = useQueryClient();

  return useMutation<AddChatToWorkspaceResponse, AxiosError, AddChatToWorkspacePost>(addChatToWorkspace, {
    onSuccess: (successResponse, payload) => {
      queryClient.invalidateQueries('side-bar');
      queryClient.invalidateQueries(['chatHistory', payload.chat_id]);
      const filesQueryKey = getFilesQueryKey({ chat_id: payload.chat_id });
      queryClient.invalidateQueries(filesQueryKey);
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
