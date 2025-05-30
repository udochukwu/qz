import axiosClient from '@/lib/axios';
import { QuizPreview } from '../types/quiz';
import { useMutation, useQueryClient } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { GET_RECENT_QUIZES_QUERY_KEY } from './use-get-recent-quizes';

const deleteQuiz = async (quizId: string): Promise<void> => {
  const res = await axiosClient.delete<{ quizzes: QuizPreview[] }>(`/quiz/${quizId}`);
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([GET_RECENT_QUIZES_QUERY_KEY]);
    },
  });
};
