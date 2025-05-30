import { GenerateFlashcardQuery, GenerateFlashcardResponse } from '../types/flashcard-api-types';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';

const generateFlashcard = async (query: GenerateFlashcardQuery): Promise<GenerateFlashcardResponse> => {
  const res = await axiosClient.post<GenerateFlashcardResponse>(`/flashcards/sets/generate`, query);
  return res.data;
};

export const useGenerateFlashcard = () => {
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();

  return useMutation(generateFlashcard, {
    onError: (e: AxiosError) => {
      if (e.response?.status === 426) {
        setReferrer('flashcard-limit');
        setIsOpen(true);
      } else {
        sendErrorMessage(e);
      }
    },
  });
};
