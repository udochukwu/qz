import { useMutation } from 'react-query';
import axiosClient from '@/lib/axios';
import { useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next13-progressbar';
import { OnboardingStep, StepPost } from '../types/onboarding-types';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

export const useSubmitOnboardingStep = () => {
  const { update } = useSession();
  const router = useRouter();

  const submitOnboardingStep = async (stepData: StepPost) => {
    const res = await axiosClient.post<OnboardingStep, AxiosResponse, StepPost>('/user/onboarding/submit', stepData);
    if ('lms_linking_step_completed' in stepData) {
      await update({ is_onboarded: true });
      router.push(stepData.route ?? '/');
    }
    return res.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError } = useMutation(submitOnboardingStep, {
    onMutate(stepPost: StepPost) {
      const prevOnboardingStep = queryClient.getQueriesData('currentOnboardingStep');
      queryClient.setQueryData<OnboardingStep | undefined>(
        'currentOnboardingStep',
        (prev: OnboardingStep | undefined) => {
          if (prev && 'lms_linking_step_completed' in stepPost) {
            return { ...prev, is_onboarded: true, steps: { ...prev.steps, lms_linking_step_completed: true } };
          }
          if (prev && 'school' in stepPost) {
            return {
              ...prev,
              steps: {
                ...prev.steps,
                school: { id: '', lms: '', lms_url: '', integration_id: '', name: stepPost.school, isLoading: true },
                majors: stepPost.majors,
              },
            };
          }
          if (prev && 'student_type' in stepPost) {
            return { ...prev, steps: { ...prev.steps, student_type: stepPost.student_type } };
          }
          return prev;
        },
      );

      return prevOnboardingStep;
    },
    onSettled: () => {
      queryClient.invalidateQueries('currentOnboardingStep');
    },
  });

  return {
    submitStep: async (step: StepPost) => {
      mutateAsync(step);
    },
    isLoading,
    isError,
  };
};
