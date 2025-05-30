import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { OnboardingV2 } from '../types/onboarding-types';
import { queryClient } from '@/providers/Providers';
import { invalidateQuests } from '@/features/quest/utils/invalidate_quests';

const fetchOnboardingV2 = async (): Promise<OnboardingV2> => {
  const res = await axiosClient.get<OnboardingV2>('/user/v2/onboarding');
  if (res.data && res.data?.steps) {
    return res.data;
  }
  throw new Error('Failed to fetch current onboarding step');
};

export const useGetOnboardingSteps = () => {
  const { data, isError, isLoading, refetch } = useQuery<OnboardingV2, Error>('onboarding-v2', fetchOnboardingV2, {
    onSuccess: () => {
      invalidateQuests('finish_on_boarding');
    },
    refetchOnWindowFocus: false,
  });

  return {
    questions: data?.steps?.questions,
    study_level_step: data?.steps?.study_level_step,
    is_onboarded: !!data?.is_onboarded,
    isError,
    isLoading,
    refetch,
  };
};
