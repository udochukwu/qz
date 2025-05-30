import { DEFAULT_CHAT_VIEW_SIZE, useSplitterStore } from '@/stores/splitter-api-store';
import { FilesChunksTabsEnum, SideBarRoutes } from './types/types';
import { ReactNode, useEffect } from 'react';
import { LoadingScreen } from '../user-feedback/loading-screen';
import { DisplayPDF } from './pdf-viewer';
import { DisplayMedia } from './audio-video-viewer';
import { useSideBarRouteStore } from './stores/side-bar-router';
import { FilesChunksTabs } from './files-chunks-tabs';
import { FileChangeDetails } from './hooks/files/use-file-upload';
import useGetChatId from '../chat/hooks/use-chatId';

interface FilesSideBarProps {
  uploadingController?: {
    uploadFiles: (files: FileChangeDetails) => void;
  };
}

export function FilesSideBar({ uploadingController }: FilesSideBarProps) {
  const { currentRoute, currentTab } = useSideBarRouteStore();
  const activeTab = currentTab ?? FilesChunksTabsEnum.FILES;

  const sideBarItems: {
    [key in SideBarRoutes]: ReactNode;
  } = {
    [SideBarRoutes.FILE_CHUNKS_ROUTE]: (
      <FilesChunksTabs activeTab={activeTab} uploadingController={uploadingController} />
    ),
    [SideBarRoutes.FILE_VIEW]: <DisplayPDF />,
    [SideBarRoutes.VIDEO_VIEW]: <DisplayMedia />,
  };

  //USE useRouterStore to manage the state of the sidebar and routes
  //TODO: use useRouterStore to go from "my-files" to "my-pdf" and vice versa

  const chatId = useGetChatId();
  const setChatSize = useSplitterStore(state => state.setChatSize);

  function getCurrentComponent() {
    const component = sideBarItems[currentRoute];
    if (component) {
      return component;
    }
    throw new Error(`Component not found given sidebar route ${currentRoute}`);
  }

  const currentComponent = getCurrentComponent();

  useEffect(() => {
    switch (currentRoute) {
      case SideBarRoutes.FILE_CHUNKS_ROUTE:
        setChatSize(DEFAULT_CHAT_VIEW_SIZE);
        break;
      case SideBarRoutes.FILE_VIEW:
        setChatSize(40);
        break;
      case SideBarRoutes.VIDEO_VIEW:
        setChatSize(DEFAULT_CHAT_VIEW_SIZE);
        break;
      // Include other cases as necessary
    }
  }, [currentRoute, setChatSize]);

  if (!chatId) {
    return <LoadingScreen />;
  }

  return <>{currentComponent}</>;
}
