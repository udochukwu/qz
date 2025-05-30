import axiosClient from '@/lib/axios';
import { StopStreamResponse, StopStreamingPost } from '../types';
import { SuccessfulResponse } from '@/types/api-types';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';

const fetchStopStream = async (payload: StopStreamingPost) => {
  const res = await axiosClient.post<StopStreamingPost, SuccessfulResponse<StopStreamResponse>>('/chat/stop', payload);
  return res.data;
};

export const useStopStream = () => {
  const { mutateAsync } = useMutation(fetchStopStream, {
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });

  return mutateAsync;
};
