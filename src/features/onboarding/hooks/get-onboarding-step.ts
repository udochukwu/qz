import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { OnboardingStep } from '../types/onboarding-types';

// Define the order of steps
const stepOrder = ['student_type', 'major', 'school', 'lms_linking_step_completed'];

const fetchCurrentStep = async (): Promise<OnboardingStep> => {
  const res = await axiosClient.get<OnboardingStep>('/user/onboarding');
  if (res.data && res.data?.steps) {
    return res.data;
  }
  throw new Error('Failed to fetch current onboarding step');
};

export const useGetOnboardingSteps = () => {
  const { data, isError, isLoading, refetch } = useQuery<OnboardingStep, Error>(
    'currentOnboardingStep',
    fetchCurrentStep,
    {
      refetchOnWindowFocus: false,
    },
  );

  const steps = data?.steps;
  const is_onboarded = data?.is_onboarded;

  const getCurrentStep = (): string | null => {
    if (steps) {
      const currentStepKeys = Object.keys(steps) as Array<keyof typeof steps>;
      const currentStep = currentStepKeys.find(step => steps[step] === null || steps[step] === false);
      return currentStep || null;
    }
    return null;
  };

  const currentStep = getCurrentStep();

  // Method to get the previous step
  const getPreviousStep = (): string | null => {
    if (currentStep) {
      const currentIndex = stepOrder.indexOf(currentStep);
      const previousIndex = currentIndex - 1;
      if (previousIndex >= 0) {
        return stepOrder[previousIndex];
      }
    }
    return null;
  };

  const previousStep = getPreviousStep();

  return {
    currentStep,
    previousStep,
    steps,
    is_onboarded,
    isError,
    isLoading,
    refetch,
  };
};
