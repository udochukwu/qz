import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';

const fetchMajors = async (): Promise<string[]> => {
  const response = await axiosClient.get<{ majors: string[] }>('/user/onboarding/majors');
  if (response.data && response.data.majors) {
    return response.data.majors;
  }
  throw new Error('Failed to fetch majors');
};

export const useGetMajorList = () => {
  return useQuery<string[], Error>('majorsList', fetchMajors);
};
