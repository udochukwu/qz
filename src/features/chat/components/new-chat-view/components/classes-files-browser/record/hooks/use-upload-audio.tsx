import { SuccessfulResponse } from '@/types/api-types';
import { AudioFileResponse, AudioFilePayload } from '../types';
import axiosClient from '@/lib/axios';
import { useMutation } from 'react-query';

const uploadAudio = async (AudioFilePayload: AudioFilePayload): Promise<AudioFileResponse> => {
  const res = await axiosClient.post<AudioFilePayload, SuccessfulResponse<AudioFileResponse>>(
    '/files/audio/upload',
    AudioFilePayload,
  );

  return res.data;
};

export const useUploadAudio = () => {
  return useMutation<AudioFileResponse, Error, AudioFilePayload>(async payload => {
    try {
      const response = await uploadAudio(payload);

      return response;
    } catch (error: any) {
      // Re-throw the error to be handled by the component
      if (error.response && error.response.status === 426) {
        throw new Error('Upgrade required');
      }
      throw error;
    }
  });
};
