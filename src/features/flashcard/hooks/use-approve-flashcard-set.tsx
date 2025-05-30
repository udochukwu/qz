import { useMutation, useQueryClient } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';
import { GET_RECENT_FLASHCARDS_QUERY_KEY } from './use-get-recent-flashcard-sets';

const approveFlashcardSet = async ({ setId }: { setId: string }) => {
  const res = await axiosClient.post(`/flashcards/sets/${setId}/approve`, { setId });
  return res.data;
};

export const useApproveFlashcardSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveFlashcardSet,
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);
      queryClient.invalidateQueries([GET_RECENT_FLASHCARDS_QUERY_KEY]);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
