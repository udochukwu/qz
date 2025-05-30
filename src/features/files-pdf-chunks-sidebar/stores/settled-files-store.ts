import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../types/types';
import { uuid4 } from '@sentry/utils';

interface Store {
  settledFiles: WorkspaceFile[];
  clearSettledFiles: () => void;
  addSettledFiles: (files: WorkspaceFile[]) => void;
  setSettledFileStatus: (workspaceFileId: string, status: WorkspaceFileUploadStatus, user_shown_error?: string) => void;
  removeSettledFiles: (id: string) => void;
}

export const useSettledFilesStore = create<Store>()(
  persist(
    set => ({
      settledFiles: [],
      clearSettledFiles: () =>
        set(() => {
          return { settledFiles: [] };
        }),
      setSettledFileStatus: (fileId, status, user_shown_error) =>
        set(prev => {
          const newFiles = prev.settledFiles.map(file => {
            if (file.workspace_file_id === fileId) {
              return { ...file, status, user_shown_error };
            }
            return file;
          });
          return { settledFiles: newFiles };
        }),
      addSettledFiles: files =>
        set(prev => {
          const newFiles = files.map(file => ({ ...file, inprogressId: uuid4() }));
          return { settledFiles: [...newFiles, ...prev.settledFiles] };
        }),
      removeSettledFiles: id =>
        set(prev => {
          return { settledFiles: prev.settledFiles.filter(file => file.inprogressId !== id) };
        }),
    }),
    {
      name: 'settled-files-storage',
    },
  ),
);
