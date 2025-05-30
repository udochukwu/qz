import { FlashcardSet } from '../types/flashcard-set';
import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import useChunksStore from '@/features/chat/stores/chunks-strore';
export const GET_FLASHCARD_SET_QUERY_KEY = 'getFlashcardSet';
const getFlashcardSet = async (setId: string): Promise<FlashcardSet> => {
  const res = await axiosClient.get<FlashcardSet>(`/flashcards/sets/${setId}`);
  return res?.data;
};

export const useGetFlashcardSet = (setId: string) => {
  const appendChunks = useChunksStore(state => state.appendChunks);
  return useQuery<FlashcardSet | null>([GET_FLASHCARD_SET_QUERY_KEY, setId], () => getFlashcardSet(setId), {
    onSuccess: (data: FlashcardSet | null) => {
      if (data) {
        appendChunks(data.set_id, data.resource_chunks || []);
      }
    },
  });
};
