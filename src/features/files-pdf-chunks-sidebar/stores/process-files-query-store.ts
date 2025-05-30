import { queryClient } from '@/providers/Providers';
import { GetFilesResponse } from '../types/api-types';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../types/types';
import { DEFAULT_WORKSPACE_PROPERTIES } from '../consts/default-workspace-file';

export const useProcessFilesQueryStore = () => {
  const allFilesQueryKey = ['files'];

  const addInProgressFiles = (files: WorkspaceFile[]) => {
    const editProgress = (prev: GetFilesResponse | undefined) => {
      const prevFiles = prev?.files ? [...prev.files] : [];

      const filesUpdatedStatus = files.map(file => {
        const newFile: WorkspaceFile = {
          ...DEFAULT_WORKSPACE_PROPERTIES,
          ...file,
          status: WorkspaceFileUploadStatus.UPLOADING,
          completion_percentage: 0,
        };

        return newFile;
      });

      const inProgressedFiles: GetFilesResponse = {
        files: [...prevFiles, ...filesUpdatedStatus],
      };

      return inProgressedFiles;
    };

    queryClient.setQueryData<GetFilesResponse>(allFilesQueryKey, editProgress);
  };

  const removeInProgressFile = (fileId: string) => {
    const editProgress = (prev: GetFilesResponse | undefined) => {
      const prevFiles = prev?.files ? [...prev.files] : [];

      const removedFile = prevFiles.filter(file => file.workspace_file_id !== fileId);

      const inProgressedFiles: GetFilesResponse = {
        files: [...removedFile],
      };

      return inProgressedFiles;
    };

    queryClient.setQueryData<GetFilesResponse>(allFilesQueryKey, editProgress);
  };

  return { addInProgressFiles, removeInProgressFile };
};
