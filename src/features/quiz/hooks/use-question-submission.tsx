import { QuestionType, Quiz, QuizSession } from '../types/quiz';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useRouter } from 'next13-progressbar';

export interface QuestionSubmissionRequest {
  submitted_answer: string;
  quiz_session_id: string;
  question_index: number;
  skip_question?: boolean;
}

export interface QuestionSubmissionResponse {
  question_index: number;
  is_correct: boolean;
  explanation: string;
  correct_answer?: string;
  custom_ai_explanation?: string;
}

const submitQuizQuestion = async (query: QuestionSubmissionRequest): Promise<QuestionSubmissionResponse> => {
  const res = await axiosClient.post<QuestionSubmissionResponse>(`/quiz/question-submission`, query);
  return res.data;
};

export const useQuestionSubmission = () => {
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();

  return useMutation<QuestionSubmissionResponse, AxiosError, QuestionSubmissionRequest>(submitQuizQuestion, {
    onError: error => {
      if (error.response?.status === 426) {
        setReferrer('quiz-unlimited-questions-reached');
        setIsOpen(true);
      } else {
        sendErrorMessage(error);
      }
    },
  });
};
