// src/hooks/use-share-workspace.tsx
import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { ShareWorkspacePost, ShareWorkspaceResponse } from '../types/workspace-api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

const shareWorkspace = async (shareWorkspacePayload: ShareWorkspacePost): Promise<ShareWorkspaceResponse> => {
  const res = await axiosClient.post<ShareWorkspacePost, SuccessfulResponse<ShareWorkspaceResponse>>(
    '/workspace/share',
    shareWorkspacePayload,
  );
  return res.data;
};

export const useShareWorkspace = (onSuccess?: (payload: ShareWorkspaceResponse) => void) => {
  return useMutation(shareWorkspace, {
    onSuccess: successResponse => {
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
