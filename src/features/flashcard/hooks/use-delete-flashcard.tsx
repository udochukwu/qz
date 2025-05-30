import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { FlashcardSet } from '../types/flashcard-set';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';

const deleteFlashcard = async ({ setId, flashcardId }: { setId: string; flashcardId: string }) => {
  await axiosClient.delete(`/flashcards/${setId}/${flashcardId}`);
};

export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlashcard,
    onMutate: async ({ setId, flashcardId }) => {
      await queryClient.cancelQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      const previousFlashcardSet = queryClient.getQueryData<FlashcardSet>([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      if (previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, setId], {
          ...previousFlashcardSet,
          flashcards: previousFlashcardSet.flashcards.filter(flashcard => flashcard.flashcard_id !== flashcardId),
        });
      }

      return { previousFlashcardSet };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, _variables.setId], context.previousFlashcardSet);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries([GET_FLASHCARD_SET_QUERY_KEY, variables.setId]);
    },
  });
};
