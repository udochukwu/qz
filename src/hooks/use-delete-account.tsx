import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { useRouter } from 'next13-progressbar';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
const deleteAccount = async () => {
  const { data } = await axiosClient.delete(`user/delete`);
  return data;
};
export const useDeleteAccount = () => {
  const router = useRouter();
  return useMutation(deleteAccount, {
    onSuccess: () => {
      router.push('/auth/logout');
      toast.success('Account deleted successfully');
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
