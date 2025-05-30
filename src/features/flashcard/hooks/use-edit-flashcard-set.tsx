import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { FlashcardSet } from '../types/flashcard-set';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';

const editFlashcardSet = async ({ setId, data }: { setId: string; data: Partial<FlashcardSet> }) => {
  const res = await axiosClient.put<FlashcardSet>(`/flashcards/${setId}`, data);
  return res.data;
};

export const useEditFlashcardSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editFlashcardSet,
    onMutate: async ({ setId, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite optimistic update)
      await queryClient.cancelQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      // Snapshot previous flashcard set
      const previousFlashcardSet = queryClient.getQueryData<FlashcardSet>([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      // Optimistically update the flashcard in the flashcard set
      if (previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, setId], {
          ...previousFlashcardSet,
          ...data,
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
