import { useQuery, UseQueryResult } from 'react-query';
import axiosClient from '@/lib/axios';
import { Quest } from '../types/quest-types';

const fetchQuests = async (): Promise<Quest> => {
  const response = await axiosClient.get<Quest>('/user/quests');
  if (response.data && typeof response.data.quest_completed === 'boolean' && response.data.quest_data) {
    return response.data;
  } else {
    throw new Error('Failed to fetch quests');
  }
};

export const useGetQuest = (): UseQueryResult<Quest, Error> => {
  const result = useQuery<Quest, Error>('quests', fetchQuests, {
    refetchOnWindowFocus: false,
  });

  return result;
};
