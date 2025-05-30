import useChunksStore from '@/features/chat/stores/chunks-strore';
import { useSideBarRouter } from '@/features/files-pdf-chunks-sidebar/hooks/use-side-bar-router';
import { FilesChunksTabsEnum, SideBarRoutes } from '@/features/files-pdf-chunks-sidebar/types/types';

export function useResetChatData() {
  const resetChunksStore = useChunksStore(state => state.resetChunksStore);
  const { changeRoute, changeTab } = useSideBarRouter();

  return () => {
    resetChunksStore();
    changeTab(FilesChunksTabsEnum.FILES);
    changeRoute(SideBarRoutes.FILE_CHUNKS_ROUTE);
  };
}
