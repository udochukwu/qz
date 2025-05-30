import { useQuery, UseQueryResult } from 'react-query';
import axiosClient from '@/lib/axios';
import { ErrorResponse, SideBarProps } from '@/types';

const fetchSideBarData = async (): Promise<SideBarProps> => {
  const res = await axiosClient.get('/chat/list');
  return res?.data;
};

export const useSideBarData = (): UseQueryResult<SideBarProps, ErrorResponse> => {
  return useQuery(['side-bar'], fetchSideBarData, {
    refetchOnWindowFocus: false,
  });
};
