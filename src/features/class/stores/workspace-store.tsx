import { create } from 'zustand';

interface WorkspaceStore {
  workspaceId: string | null;
  setWorkspaceId: (id: string) => void;
}

const useWorkspaceStore = create<WorkspaceStore>(set => ({
  workspaceId: null,
  setWorkspaceId: (id: string) => set(() => ({ workspaceId: id })),
}));

export default useWorkspaceStore;
