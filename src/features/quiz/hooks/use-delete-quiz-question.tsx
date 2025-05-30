import { Quiz } from '../types/quiz';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useRouter } from 'next13-progressbar';

const deleteQuizQuestion = async (query: { quiz_id: string; question_id: string }): Promise<Quiz> => {
  const res = await axiosClient.delete<Quiz>(`/quiz/${query.quiz_id}/${query.question_id}`);
  return res.data;
};

export const useDeleteQuizQuestion = () => {
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const router = useRouter();

  return useMutation(deleteQuizQuestion, {
    onSuccess: data => {},
    onError: (e: AxiosError) => {
      if (e.response?.status === 426) {
        setReferrer('quiz-limit');
        setIsOpen(true);
      } else {
        sendErrorMessage(e);
      }
    },
  });
};
