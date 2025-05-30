import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

interface RenameChatParams {
  chat_id: string;
  new_chat_name: string;
}

const renameChatPost = async ({ chat_id, new_chat_name }: RenameChatParams) => {
  const { data } = await axiosClient.post(`/chat/${chat_id}/rename`, { new_chat_name }, { params: { new_chat_name } });
  return data;
};

export const useRenameChat = (onSuccess?: VoidFunction) => {
  const queryClient = useQueryClient();

  return useMutation(renameChatPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('side-bar');
      onSuccess && onSuccess();
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
