import { QuestionType, Quiz } from '../types/quiz';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useRouter } from 'next13-progressbar';
import * as Sentry from '@sentry/nextjs';

export interface GenerateQuizQuery {
  workspace_file_ids: string[];
  topics?: string[];
  question_types?: QuestionType[];
  is_unlimited?: boolean;
}

export interface GenerateQuizResponse {
  quiz: Quiz;
}

const generateQuiz = async (query: GenerateQuizQuery): Promise<GenerateQuizResponse> => {
  const res = await axiosClient.post<GenerateQuizResponse>(`/quiz/generate`, query);
  return res.data;
};

export const useGenerateQuiz = () => {
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const router = useRouter();

  return useMutation(generateQuiz, {
    retry: (failureCount, error: AxiosError) => {
      if (error.response?.status === 426) return false;
      return failureCount < 3;
    },
    retryDelay: 1000,
    onError: (e: AxiosError) => {
      if (e.response?.status === 426) {
        setReferrer('quiz-limit');
        setIsOpen(true);
      } else {
        sendErrorMessage(e);
        Sentry.captureException('Error generating quiz', {
          extra: {
            error: e,
          },
        });
      }
    },
  });
};
