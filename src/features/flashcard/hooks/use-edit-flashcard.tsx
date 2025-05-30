import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { Flashcard } from '../types/flashcard';
import { FlashcardSet } from '../types/flashcard-set';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';

const editFlashcard = async ({
  setId,
  flashcardId,
  data,
}: {
  setId: string;
  flashcardId: string;
  data: Partial<Flashcard>;
}) => {
  const res = await axiosClient.put<Flashcard>(`/flashcards/${setId}/${flashcardId}`, data);
  return res.data;
};

export const useEditFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editFlashcard,
    onMutate: async ({ setId, flashcardId, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite optimistic update)
      await queryClient.cancelQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      // Snapshot previous flashcard set
      const previousFlashcardSet = queryClient.getQueryData<FlashcardSet>([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      // Optimistically update the flashcard in the flashcard set
      if (previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, setId], {
          ...previousFlashcardSet,
          flashcards: previousFlashcardSet.flashcards.map(flashcard =>
            flashcard.flashcard_id === flashcardId ? { ...flashcard, ...data } : flashcard,
          ),
        });
      }

      return { previousFlashcardSet }; // Return previous state in case of rollback
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous flashcards if error occurs
      if (context?.previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, _variables.setId], context.previousFlashcardSet);
      }
    },
  });
};
