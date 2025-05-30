import { UseMutationResult, useMutation } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import useGetChatId from '@/features/chat/hooks/use-chatId';

const fetchFileChatToggle = async (fileId: string, chatID: string, enabled: boolean): Promise<any> => {
  const { data } = await axiosClient.post(`/chat/file/status`, {
    workspace_file_id: fileId,
    chat_id: chatID,
    enabled,
  });

  return data;
};

export const useFileChatToggle = () => {
  const chatID = useGetChatId();
  const { mutate, data, error, status }: UseMutationResult<any, unknown, { fileId: string; enabled: boolean }> =
    useMutation(({ fileId, enabled }) => fetchFileChatToggle(fileId, chatID!, enabled), {
      onError: (e: AxiosError) => {
        sendErrorMessage(e);
      },
    });
  return { mutate, data, error, status };
};
