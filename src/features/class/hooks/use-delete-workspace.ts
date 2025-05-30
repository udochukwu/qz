// src/hooks/use-workspace.tsx
import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { useRouter } from 'next13-progressbar';

import toast from 'react-hot-toast';

const deleteWorkspace = async (params: { workspace_id: string }) => {
  const { data } = await axiosClient.delete(`/workspace/${params.workspace_id}`);
  return data;
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(deleteWorkspace, {
    onSuccess: () => {
      toast.success('Class deleted successfully');
      queryClient.invalidateQueries('side-bar');
      queryClient.invalidateQueries('list-classes');
      router.push('/classes');
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
