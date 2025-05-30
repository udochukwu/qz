import { QuizSession } from '../types/quiz';
import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
export const GET_QUIZ_SESSION_QUERY_KEY = 'getQuizSession';

const getQuizSession = async (quizId: string, quizSessionId: string): Promise<QuizSession> => {
  const res = await axiosClient.get<QuizSession>(`/quiz/${quizSessionId}/questions`);
  return res?.data;
};

export const useGetQuizSession = (quizId: string, quizSessionId: string) => {
  return useQuery<QuizSession | null>([GET_QUIZ_SESSION_QUERY_KEY, quizId, quizSessionId], () =>
    getQuizSession(quizId, quizSessionId),
  );
};
