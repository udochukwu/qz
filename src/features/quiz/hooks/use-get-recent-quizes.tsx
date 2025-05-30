import axiosClient from '@/lib/axios';
import { QuizPreview } from '../types/quiz';
import { useQuery } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

export const GET_RECENT_QUIZES_QUERY_KEY = 'recent-quizes';

const getRecentQuizes = async (): Promise<QuizPreview[]> => {
  const res = await axiosClient.get<{ quizzes: QuizPreview[] }>('/quiz/recents');
  return res.data.quizzes;
};

export const useGetRecentQuizes = () => {
  return useQuery({
    queryFn: getRecentQuizes,
    queryKey: [GET_RECENT_QUIZES_QUERY_KEY],
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
