import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { FileMediaRequest, FileMediaResponse } from '../../types/api-types';

const fetchVideoYoutube = async (request: FileMediaRequest): Promise<FileMediaResponse> => {
  const res = await axiosClient.get<FileMediaResponse>('/files/media', { params: request });
  return res?.data;
};

export const useFileMedia = (request: FileMediaRequest) => {
  return useQuery(['fileVideoYoutube', request], () => fetchVideoYoutube(request), {
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
