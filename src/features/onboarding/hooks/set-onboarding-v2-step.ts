import { useMutation } from 'react-query';
import axiosClient from '@/lib/axios';
import { useQueryClient } from 'react-query';
import { OnboardingV2, StepPostV2 } from '../types/onboarding-types';
import { AxiosResponse } from 'axios';

export const useSubmitOnboardingStep = () => {
  const submitOnboardingStep = async (stepData: StepPostV2) => {
    const res = await axiosClient.post<OnboardingV2, AxiosResponse, StepPostV2>('/user/v2/onboarding/submit', stepData);
    return res.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError } = useMutation(submitOnboardingStep, {
    onSettled: () => {
      queryClient.invalidateQueries('onboarding-v2');
    },
  });

  return {
    submitStep: async (step: StepPostV2) => {
      mutateAsync(step);
    },
    isLoading,
    isError,
  };
};
