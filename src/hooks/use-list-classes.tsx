import axiosClient from '@/lib/axios';
import { ClassesListProps } from '@/types';
import { UseQueryResult, useQuery } from 'react-query';

const fetClasses = async (): Promise<ClassesListProps> => {
  const res = await axiosClient.get('/workspace/list');
  return res?.data;
};
export const useListClasses = (): UseQueryResult<ClassesListProps> => {
  return useQuery('list-classes', fetClasses, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
