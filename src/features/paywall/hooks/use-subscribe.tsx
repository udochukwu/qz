import axiosClient from '@/lib/axios';
import { useMutation } from 'react-query';
import {
  SubscriptionSubscribeRequest,
  SubscriptionSubscribeResponse,
  SubscriptionSubscribeRequestWithDiscount,
} from '../types';

const fetchSubscribe = async (
  payload: SubscriptionSubscribeRequest | SubscriptionSubscribeRequestWithDiscount,
): Promise<SubscriptionSubscribeResponse> => {
  const isDiscountRequest = 'discount_id' in payload;
  const url = isDiscountRequest ? '/subscription/subscribe-with-discount' : '/subscription/subscribe';

  const config = isDiscountRequest ? { headers: { 'x-secret': 'uNBOB2qv0G' } } : undefined;
  const res = await axiosClient.post(url, payload, config);
  return res?.data;
};

export const useSubscribe = () => {
  const { mutateAsync } = useMutation(fetchSubscribe);

  return mutateAsync;
};
