'use client';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { PageRenderer } from './page-renderer';
import useFileStore from '../../stores/file-store';
import { useSideBarRouter } from '../../hooks/use-side-bar-router';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { useEffect } from 'react';
import { DocumentChunkProps } from '@/types';
import { useShallow } from 'zustand/react/shallow';
import { PreviewEntireFile } from '../../preview-entire-file';
import { WorkspaceFile } from '../../types/types';
import { getPageName, getChatIdFromPath } from '@/utils/page-name-utils';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

export function DisplayPDF() {
  const pageNavigationPluginInstance = pageNavigationPlugin({ enableShortcuts: true });
  const { backRoute } = useSideBarRouter();
  const chunks = useFileStore(useShallow(state => state.chunks));
  const refreshTrigger = useFileStore(state => state.refreshTrigger);
  const fileData = useFileStore(state => state.fileData);
  if (!fileData.workspace_file_id && chunks?.ws_file_id) {
    fileData.workspace_file_id = chunks?.ws_file_id;
  }

  useEffect(() => {
    const metadata = chunks?.metadata as DocumentChunkProps;

    if (chunks) {
      pageNavigationPluginInstance.jumpToPage(metadata.page_number);
    }
  }, [chunks, refreshTrigger, pageNavigationPluginInstance]);

  const handleBackRoute = () => {
    backRoute();
    if (chunks && fileData) {
      mixpanel.track(EventName.ChunkUnexpanded, {
        page: getPageName(window.location.pathname),
        fileId: fileData.workspace_file_id,
        path: window.location.pathname,
        chunk_id: chunks.chunk_id,
        file_name: fileData.filename,
        chunk_text: chunks.chunk,
      });
    }
  };
  const metadata = chunks?.metadata as DocumentChunkProps | null;
  const CustomRenderPage = PageRenderer([metadata || []] as DocumentChunkProps[]);
  return (
    <PreviewEntireFile
      file={fileData as WorkspaceFile}
      renderPage={CustomRenderPage}
      initialPage={metadata?.page_number}
      onClose={handleBackRoute}
      pageNavigationPluginInstance={pageNavigationPluginInstance}
    />
  );
}
