import { useMutation, useQueryClient } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';
import { FlashcardSet } from '../types/flashcard-set';
import { Flashcard } from '../types/flashcard';

const replaceFlashcards = async ({
  setId,
  flashcard_id,
  cardIndex,
}: {
  flashcard_id: string;
  setId: string;
  cardIndex: number;
}) => {
  const res = await axiosClient.post<{ flashcards: Flashcard[] }>(`/flashcards/set/${setId}/replace`, {
    flashcard_ids: [flashcard_id],
  });
  return res.data;
};

export const useReplaceFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replaceFlashcards,
    onSuccess: (data, { setId, flashcard_id, cardIndex }) => {
      // Snapshot previous flashcard set
      const previousFlashcardSet = queryClient.getQueryData<FlashcardSet>([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      if (previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, setId], {
          ...previousFlashcardSet,
          flashcards: previousFlashcardSet.flashcards.map((flashcard, index) =>
            cardIndex === index ? { ...flashcard, ...data?.flashcards?.[0] } : flashcard,
          ),
        });
      }
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
