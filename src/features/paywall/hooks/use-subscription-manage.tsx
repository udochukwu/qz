import axiosClient from '@/lib/axios';
import { useMutation, UseMutationResult } from 'react-query';
import { SubscriptionManageResponse } from '../types';

const fetchManageSubscription = async (): Promise<SubscriptionManageResponse> => {
  const res = await axiosClient.post('/subscription/manage');
  return res?.data;
};

export const useManageSubscription = () => {
  return useMutation('manageSubscription', fetchManageSubscription);
};
