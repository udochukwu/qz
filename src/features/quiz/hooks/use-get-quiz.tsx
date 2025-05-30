import { Quiz } from '../types/quiz';
import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import useChunksStore from '@/features/chat/stores/chunks-strore';
export const GET_QUIZ_QUERY_KEY = 'getQuiz';
const getQuiz = async (quizId: string, sessionId?: string): Promise<Quiz | null> => {
  const endpoint = sessionId ? `/quiz/${quizId}${sessionId ? `?session_id=${sessionId}` : ''}` : `/quiz/${quizId}`;
  const res = await axiosClient.get<Quiz>(endpoint);
  return res?.data;
};

export const useGetQuiz = (quizId: string, sessionId?: string) => {
  const appendChunks = useChunksStore(state => state.appendChunks);
  return useQuery<Quiz | null>([GET_QUIZ_QUERY_KEY, quizId, sessionId], () => getQuiz(quizId, sessionId), {
    onSuccess: (data: Quiz | null) => {
      if (data) {
        appendChunks(data.quiz_id, data.resource_chunks);
      }
    },
  });
};
