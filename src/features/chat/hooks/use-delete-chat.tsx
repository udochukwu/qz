import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { useRouter } from 'next13-progressbar';

const deleteChat = async (params: { chat_id: string }) => {
  const { data } = await axiosClient.delete(`/chat/${params.chat_id}`);
  return data;
};

export const useDeleteChat = (onSuccess?: VoidFunction) => {
  const queryClient = useQueryClient();
  return useMutation(deleteChat, {
    onSuccess: () => {
      queryClient.invalidateQueries('chat-history');
      queryClient.invalidateQueries('side-bar');
      onSuccess && onSuccess();
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
