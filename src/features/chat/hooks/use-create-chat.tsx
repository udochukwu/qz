import axiosClient from '@/lib/axios';
import { useMutation } from 'react-query';
import { useRouter } from 'next13-progressbar';
import { AxiosError } from 'axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { useResetChatData } from '@/hooks/use-reset-chat-data';
import { useSearchParams } from 'next/navigation';
// Adjusted to accept an object that may contain different properties
const fetchCreateChat = async (params: {
  workspace_id?: string;
  workspace_file_ids?: string[];
}): Promise<{ chat_id: string }> => {
  const body = params;
  const { data } = await axiosClient.post<{ chat_id: string }>('/chat/create', body);
  return data;
};

export const useCreateChat = (
  onSuccessAdditional?: (data: { chat_id: string }) => Promise<void>,
  onError?: (error: any) => void,
  redirectToChat: boolean = true,
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetChatData = useResetChatData();

  const onSuccessDefault = async (data: { chat_id: string }) => {
    resetChatData();
    if (onSuccessAdditional) {
      await onSuccessAdditional(data);
    }
    if (redirectToChat && searchParams.get('tab') !== 'Flashcards' && searchParams.get('tab') !== 'Quiz') {
      router.push(`/c/${data.chat_id}`);
    }
  };

  // useMutation now expects an object that may contain different properties
  return useMutation(fetchCreateChat, {
    onSuccess: onSuccessDefault,
    onError: (e: AxiosError) => {
      if (e?.response?.status !== 426) {
        sendErrorMessage(e);
      }
      onError?.(e);
    },
  });
};
