import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { GetUnsavedRecordingsResponse } from '../../types/api-types';

const fetchUnsavedRecordings = async (): Promise<GetUnsavedRecordingsResponse> => {
  const { data } = await axiosClient.get('/files/audio/unsaved');
  // convert datetime string to epoch
  return { files: data.files.map((file: any) => ({ ...file, created_at: new Date(file.created_at).getTime() })) };
};

export const useUnsavedRecordings = () => {
  return useQuery('unsavedRecordings', fetchUnsavedRecordings, {
    refetchOnWindowFocus: false,
  });
};
