import { useMutation } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

export type ShareFlashcardResponse = {
  message: string;
  share_id: string;
};

const shareFlashcard = async ({ flashcard_set_id }: { flashcard_set_id: string }): Promise<ShareFlashcardResponse> => {
  const res = await axiosClient.post<ShareFlashcardResponse>('/flashcards/share', { flashcard_set_id });
  return res.data;
};

export const useShareFlashcard = () => {
  return useMutation(shareFlashcard, {
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
