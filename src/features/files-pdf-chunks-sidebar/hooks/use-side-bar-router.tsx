import useSideBarStore from '@/features/chat/stores/side-bar-store';
import { useSideBarRouteStore } from '../stores/side-bar-router';
import { FilesChunksTabsEnum, SideBarRoutes } from '../types/types';

export const useSideBarRouter = () => {
  //A Route is a page in the sidebar
  //A Tab can be under a route; in our case we have 2 routes: file-view and file-chunks-route and file-chunks-route has 2 tabs: files and chunks
  const { currentRoute, setCurrentRoute, setCurrentTab } = useSideBarRouteStore();
  const setSideBarOpen = useSideBarStore(state => state.setSideBarOpen);
  const changeRoute = <T extends SideBarRoutes>(route: T) => {
    setSideBarOpen(true);
    // if current route is not the same as the new route, set the current route as the previous route
    setCurrentRoute(route);
  };

  const changeTab = (tab: FilesChunksTabsEnum) => {
    setCurrentTab(tab);
  };

  // Only goes back 1 route, multiple back button is not supported yet
  const backRoute = () => {
    setCurrentRoute(SideBarRoutes.FILE_CHUNKS_ROUTE);
  };

  return { backRoute, changeRoute, currentRoute, changeTab };
};
