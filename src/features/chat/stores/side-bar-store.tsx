import { create } from 'zustand';

interface sideBarStore {
  isSideBarOpen: boolean;
  setSideBarOpen: (isOpen: boolean) => void;
}
const useSideBarStore = create<sideBarStore>(set => ({
  isSideBarOpen: true,
  setSideBarOpen: (isOpen: boolean) => set(() => ({ isSideBarOpen: isOpen })),
}));

export default useSideBarStore;
