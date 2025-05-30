// src/hooks/use-share-workspace.tsx
import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { ShareChatPost, ShareChatResponse } from '../types';

const shareChat = async (shareChatPayload: ShareChatPost): Promise<ShareChatResponse> => {
  const res = await axiosClient.post<ShareChatPost, SuccessfulResponse<ShareChatResponse>>(
    '/chat/share',
    shareChatPayload,
  );
  return res.data;
};

export const useShareChat = (onSuccess?: (payload: ShareChatResponse) => void) => {
  return useMutation(shareChat, {
    onSuccess: successResponse => {
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
