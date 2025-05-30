import { QuestionType, Quiz } from '../types/quiz';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useRouter } from 'next13-progressbar';
import { TIMER_KEY } from './use-quiz-timer';
export interface StartQuizRequest {
  shuffle_questions: boolean;
}

export interface StartQuizResponse {
  quiz_session_id: string;
  quiz_id: string;
  question_order: string[];
  progress: Array<{
    question_id: string;
    submitted_answer: string | null;
    is_correct: boolean | null;
  }>;
  started_at_utc: number;
}

interface StartQuizParams {
  query: StartQuizRequest;
  quiz_id: string;
}

const startQuizSession = async ({ query, quiz_id }: StartQuizParams): Promise<StartQuizResponse> => {
  const res = await axiosClient.post<StartQuizResponse>(`/quiz/${quiz_id}/start`, query);
  return res.data;
};

export const useStartQuizSession = () => {
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const router = useRouter();

  return useMutation(startQuizSession, {
    onSuccess: data => {
      localStorage.setItem(`${TIMER_KEY}${data.quiz_id}_${data.quiz_session_id}`, Date.now().toString());
      router.push(`/quiz/${data.quiz_id}/${data.quiz_session_id}/1`);
    },
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
