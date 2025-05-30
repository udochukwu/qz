import { useMutation, useQueryClient } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';

const restartFlashcardSet = async ({ setId }: { setId: string }) => {
  const res = await axiosClient.post(`/flashcards/${setId}/restart`, { setId });
  return res.data;
};

export const useRestartFlashcardSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restartFlashcardSet,
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
