import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { GET_RECENT_FLASHCARDS_QUERY_KEY } from './use-get-recent-flashcard-sets';

const deleteFlashcardSet = async ({ setId }: { setId: string }) => {
  await axiosClient.delete(`/flashcards/sets/${setId}`);
};

export const useDeleteFlashcardSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlashcardSet,
    onSuccess() {
      queryClient.invalidateQueries([GET_RECENT_FLASHCARDS_QUERY_KEY]);
    },
  });
};
