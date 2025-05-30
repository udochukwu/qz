import axiosClient from '@/lib/axios';
import { FlashcardSetResponse } from '../types/flashcard-api-types';
import { useQuery } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

export const GET_RECENT_FLASHCARDS_QUERY_KEY = 'recent-flashcard-set';

const getRecentFlashcardSets = async (): Promise<FlashcardSetResponse> => {
  const res = await axiosClient.get<FlashcardSetResponse>('flashcards/sets/recents');
  return res.data;
};

export const useGetRecentFlashcardSets = () => {
  return useQuery({
    queryFn: getRecentFlashcardSets,
    queryKey: [GET_RECENT_FLASHCARDS_QUERY_KEY],
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
