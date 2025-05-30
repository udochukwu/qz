import { useMutation, useQueryClient } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { Flashcard } from '../types/flashcard';
import { GET_FLASHCARD_SET_QUERY_KEY } from './use-get-flashcard-set';
import { FlashcardSet } from '../types/flashcard-set';

const addMoreFlashcards = async ({
  setId,
  number_of_flashcards,
}: {
  number_of_flashcards: number;
  setId: string;
}): Promise<{ flashcards: Flashcard[] }> => {
  const res = await axiosClient.post<{ flashcards: Flashcard[] }>(`/flashcards/set/${setId}/addmore`, {
    number_of_flashcards,
  });
  return res.data;
};

export const useAddMoreFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMoreFlashcards,
    onSuccess: (data, { setId }) => {
      const previousFlashcardSet = queryClient.getQueryData<FlashcardSet>([GET_FLASHCARD_SET_QUERY_KEY, setId]);

      if (previousFlashcardSet) {
        queryClient.setQueryData([GET_FLASHCARD_SET_QUERY_KEY, setId], {
          ...previousFlashcardSet,
          flashcards: [...data?.flashcards, ...previousFlashcardSet?.flashcards],
        });
      } else {
        queryClient.invalidateQueries([GET_FLASHCARD_SET_QUERY_KEY, setId]);
      }
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
