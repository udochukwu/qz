import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import useFileStore from '../../stores/file-store';
import { useSideBarRouter } from '../../hooks/use-side-bar-router';
import { useShallow } from 'zustand/react/shallow';
import { getPageName, getChatIdFromPath } from '@/utils/page-name-utils';
import { WorkspaceFile } from '../../types/types';
import { PreviewEntireMedia } from './preview-entire-media';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

export function DisplayMedia() {
  const { backRoute } = useSideBarRouter();
  const chunks = useFileStore(useShallow(state => state.chunks));
  const fileData = useFileStore(state => state.fileData);

  const handleBackRoute = () => {
    backRoute();

    if (chunks && fileData) {
      mixpanel.track(EventName.ChunkUnexpanded, {
        fileId: fileData.workspace_file_id,
        page: getPageName(window.location.pathname),
        path: window.location.pathname,
        chunk_id: chunks.chunk_id,
        file_name: fileData.filename,
        url: fileData.url,
        chat_id: getChatIdFromPath(window.location.pathname),
        chunk_text: chunks.chunk,
      });
    }
  };

  return <PreviewEntireMedia file={fileData as WorkspaceFile} chunk={chunks ?? undefined} onClose={handleBackRoute} />;
}
