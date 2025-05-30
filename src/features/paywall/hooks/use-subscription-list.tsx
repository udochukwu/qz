import axiosClient from '@/lib/axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SubscriptionListResponse } from '../types';

const fetchSubscriptionList = async (): Promise<SubscriptionListResponse> => {
  const res = await axiosClient.get('/subscription/list');
  return res?.data;
};

export const useSubscriptionList = (): UseQueryResult<SubscriptionListResponse> => {
  return useQuery('subscriptionList', fetchSubscriptionList);
};
