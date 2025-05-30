import React from 'react';
import { useSettledFilesStore } from '../stores/settled-files-store';
import axiosClient from '@/lib/axios';
import { useProcessFilesQueryStore } from '../stores/process-files-query-store';
import { WorkspaceFileUploadStatus } from '../types/types';
import { queryClient } from '@/providers/Providers';
import { GetFilesResponse } from '../types/api-types';
import { useMutation } from 'react-query';
import { invalidateQuests } from '@/features/quest/utils/invalidate_quests';

export const useUploadStatus = () => {
  const { setSettledFileStatus } = useSettledFilesStore();

  const { removeInProgressFile } = useProcessFilesQueryStore();

  const updateFileStatus = async (workspace_file_id: string): Promise<string> => {
    try {
      const response = await axiosClient.get(`/files/${workspace_file_id}/status`);

      const { completion_percentage, status, user_shown_error } = response.data;

      if (status === 'finished') {
        removeInProgressFile(workspace_file_id);
        setSettledFileStatus(workspace_file_id, WorkspaceFileUploadStatus.FINISHED);

        await queryClient.invalidateQueries(['files']);
        await queryClient.invalidateQueries(['files', workspace_file_id]);
        await queryClient.invalidateQueries('chatSuggestion');
        invalidateQuests('upload_file');
        return Promise.resolve(WorkspaceFileUploadStatus.FINISHED);
      } else if (status === 'error') {
        removeInProgressFile(workspace_file_id);
        setSettledFileStatus(workspace_file_id, WorkspaceFileUploadStatus.FAILED, user_shown_error);
        await queryClient.invalidateQueries(['files']);
        await queryClient.invalidateQueries(['files', workspace_file_id]);
        return Promise.reject(WorkspaceFileUploadStatus.FAILED);
      }

      queryClient.setQueryData<GetFilesResponse>(['files'], (prevFiles: GetFilesResponse | undefined) => {
        if (!prevFiles) {
          return { files: [] };
        }

        const updatedFiles = prevFiles.files.map(file => {
          if (file.workspace_file_id === workspace_file_id) {
            return {
              ...file,
              completion_percentage: completion_percentage,
              status: status,
              user_shown_error: user_shown_error
            };
          }
          return { ...file };
        });

        return { ...prevFiles, files: updatedFiles };
      });

      return Promise.resolve(WorkspaceFileUploadStatus.UPLOADING);
    } catch (error) {
      setSettledFileStatus(workspace_file_id, WorkspaceFileUploadStatus.FAILED);
      return Promise.reject(WorkspaceFileUploadStatus.FAILED);
    }
  };

  return useMutation(updateFileStatus);
};
