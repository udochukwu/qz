import { create } from 'zustand';
import { FilesChunksTabsEnum, SideBarRoutes } from '../types/types';

interface SideBarRouterState {
  currentRoute: SideBarRoutes;
  prevRoute: SideBarRoutes;
  currentTab: FilesChunksTabsEnum;
  setCurrentRoute: (page: SideBarRoutes) => void;
  setCurrentTab: (tab: FilesChunksTabsEnum) => void;
}

export const useSideBarRouteStore = create<SideBarRouterState>()(set => ({
  currentRoute: SideBarRoutes.FILE_CHUNKS_ROUTE,
  prevRoute: SideBarRoutes.FILE_CHUNKS_ROUTE,
  currentTab: FilesChunksTabsEnum.FILES,
  setCurrentRoute: by => set(() => ({ currentRoute: by })),
  setCurrentTab: by => set(() => ({ currentTab: by })),
}));
