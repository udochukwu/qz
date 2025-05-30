import { useQuery, useMutation, UseMutationResult } from 'react-query';
import axiosClient from '@/lib/axios';
import { SharePreviewPost, GetSharePreviewResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { AxiosError } from 'axios';
import { sendErrorMessage } from '@/utils/send-error-message';

const fetchSharePreview = async (shareId: string): Promise<GetSharePreviewResponse> => {
  const { data } = await axiosClient.get<GetSharePreviewResponse>('/share/preview', { params: { share_id: shareId } });
  return data;
};

export const useGetSharePreview = (onSuccess?: (payload: GetSharePreviewResponse) => void) => {
  return useMutation(fetchSharePreview, {
    onSuccess: (successResponse: GetSharePreviewResponse) => {
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
