import { DownloadFile, ResourceChunk } from '@/types';
import { create } from 'zustand';

//The File used by the PDF Viewer in the siderbar

interface fileStore {
  fileData: DownloadFile;
  chunks: ResourceChunk | null;
  refreshTrigger: number;
  setFileData: (data: DownloadFile) => void;
  setChunks: (data: ResourceChunk | null) => void;
  triggerRefresh: () => void;
}

const useFileStore = create<fileStore>(set => ({
  fileData: {
    filename: '',
    url: '',
    workspace_file_id: '',
  },
  chunks: null,
  refreshTrigger: 0,
  setFileData: data => set({ fileData: data }),
  setChunks: data => set({ chunks: data }),
  triggerRefresh: () => set(state => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export default useFileStore;
