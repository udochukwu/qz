import axiosClient from '@/lib/axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SubscriptionStatusResponse } from '../types';

const fetchSubscriptionStatus = async (): Promise<SubscriptionStatusResponse> => {
  const res = await axiosClient.get('/subscription/status');
  return res?.data;
};

export const useSubscriptionStatus = (): UseQueryResult<SubscriptionStatusResponse> => {
  return useQuery('subscriptionStatus', fetchSubscriptionStatus);
};
