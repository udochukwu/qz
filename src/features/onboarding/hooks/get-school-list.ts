import { useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { SchoolOption } from '../types/onboarding-types';

const fetchSchools = async (): Promise<SchoolOption[]> => {
  const response = await axiosClient.get<{ schools: SchoolOption[] }>('/user/onboarding/schools');
  if (response.data && response.data.schools) {
    return response.data.schools;
  }
  throw new Error('Failed to fetch schools');
};

export const useGetSchoolList = () => {
  return useQuery<SchoolOption[], Error>('schoolsList', fetchSchools);
};
