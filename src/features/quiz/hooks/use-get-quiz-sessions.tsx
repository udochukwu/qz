import { QuizSession } from '../types/quiz';
import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
export const GET_QUIZ_SESSIONS_QUERY_KEY = 'getQuizSessions';

const getQuizSessions = async (quizId: string): Promise<QuizSession[]> => {
  const res = await axiosClient.get<QuizSession[]>(`/quiz/${quizId}/sessions`);
  return res?.data;
};

export const useGetQuizSessions = (quizId: string) => {
  return useQuery<QuizSession[] | null>([GET_QUIZ_SESSIONS_QUERY_KEY, quizId], () =>
    getQuizSessions(quizId),
  );
};
