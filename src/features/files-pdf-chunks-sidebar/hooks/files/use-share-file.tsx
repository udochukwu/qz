// src/hooks/use-share-workspace.tsx
import { useMutation } from 'react-query';
import axiosClient from '@/lib/axios';
import { ShareFilePost, ShareFileResponse } from '../../types/api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

const shareFile = async (shareFilePayload: ShareFilePost): Promise<ShareFileResponse> => {
  const res = await axiosClient.post<ShareFilePost, SuccessfulResponse<ShareFileResponse>>(
    '/files/share',
    shareFilePayload,
  );
  return res.data;
};

export const useShareFile = (onSuccess?: (payload: ShareFileResponse) => void) => {
  return useMutation(shareFile, {
    onSuccess: (successResponse: ShareFileResponse) => {
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
