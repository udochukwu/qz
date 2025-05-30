import axiosClient from '@/lib/axios';
import { UseQueryResult, useQuery, useMutation } from 'react-query';
import { queryClient } from '@/providers/Providers';
import { useUserStore } from '@/stores/user-store';
const fetchProductTourStatus = async (): Promise<{ product_tour_completed: boolean }> => {
  const res = await axiosClient.get<{ product_tour_completed: boolean }>('/user/product_tour');
  return res?.data;
};

export const useProductTourStatus = (): UseQueryResult<{ product_tour_completed: boolean }> => {
  return useQuery('product-tour', fetchProductTourStatus, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

const postCompleteProductTour = async (): Promise<void> => {
  await axiosClient.post('/user/product_tour');
};

const setProductTourStatus = (product_tour_completed: boolean): void => {
  queryClient.setQueryData<{ product_tour_completed: boolean }>('product-tour-status', oldData => {
    if (!oldData) {
      throw new Error('Product tour status not found');
    }
    return {
      product_tour_completed,
    };
  });
};

export const useCompleteProductTour = () => {
  return useMutation(postCompleteProductTour, {
    onSuccess: () => {
      setProductTourStatus(true);
    },
  });
};
