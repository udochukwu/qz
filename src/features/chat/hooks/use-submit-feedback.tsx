import axiosClient from '@/lib/axios';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { SubmitFeedbackParams } from '../types';

const submitFeedback = async (params: SubmitFeedbackParams): Promise<void> => {
  await axiosClient.post('/feedback/submit', params);
};

export const useSubmitFeedback = (onSuccessAdditional?: () => void, onError?: (error: any) => void) => {
  return useMutation(submitFeedback, {
    onSuccess: () => {
      if (onSuccessAdditional) {
        onSuccessAdditional();
      }
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
      if (onError) {
        onError(e);
      }
    },
  });
};
