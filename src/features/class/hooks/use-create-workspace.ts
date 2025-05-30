// src/hooks/use-workspace.tsx
import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';
import { CreateWorkspacePost, CreateWorkspaceResponse } from '../types/workspace-api-types';
import { SuccessfulResponse } from '@/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import { invalidateQuests } from '@/features/quest/utils/invalidate_quests';

const createWorkspace = async (createWorkspacePayload?: CreateWorkspacePost): Promise<CreateWorkspaceResponse> => {
  const res = await axiosClient.post<CreateWorkspacePost, SuccessfulResponse<CreateWorkspaceResponse>>(
    '/workspace/create',
    {
      class_name: createWorkspacePayload?.class_name,
    },
  );
  return res.data;
};

export const useCreateWorkspace = (onSuccess?: (payload: CreateWorkspaceResponse) => void) => {
  const queryClient = useQueryClient();

  return useMutation(createWorkspace, {
    onSuccess: async successResponse => {
      queryClient.invalidateQueries('side-bar');
      await queryClient.refetchQueries('list-classes');
      invalidateQuests('create_class');
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
