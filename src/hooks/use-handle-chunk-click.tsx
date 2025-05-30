import useFileStore from '@/features/files-pdf-chunks-sidebar/stores/file-store';
import { SideBarRoutes } from '@/features/files-pdf-chunks-sidebar/types/types';
import useChunksStore from '@/features/chat/stores/chunks-strore';
import { useSideBarRouter } from '@/features/files-pdf-chunks-sidebar/hooks/use-side-bar-router';
import { getChatIdFromPath } from '@/utils/page-name-utils';
import { isDocumentChunk, isSubtitleChunk } from '@/types';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useCallback } from 'react';

export function useHandleChunkClick(chunk_id: string) {
  const setFileData = useFileStore(state => state.setFileData);
  const setChunks = useFileStore(state => state.setChunks);
  const triggerRefresh = useFileStore(state => state.triggerRefresh);
  const { changeRoute } = useSideBarRouter();

  // Create specific selectors for this chunk_id
  const chunkName = useChunksStore(useCallback(state => state.getChunkName(chunk_id), [chunk_id]));

  // Find the chunk in all messages
  const resourceChunk = useChunksStore(
    useCallback(
      state => {
        for (const messageChunks of Object.values(state.all_resource_chunks)) {
          const chunk = messageChunks.find(c => c.chunk_id === chunk_id);
          if (chunk) return chunk;
        }
        return undefined;
      },
      [chunk_id],
    ),
  );

  const handleChunkClicked = useCallback(
    async (chunk_click_attribution: string) => {
      if (chunkName === 0 || !resourceChunk) {
        throw new Error('Chunk not found with id: ' + chunk_id);
      }

      const file_data = {
        filename: resourceChunk.ws_file_name,
        url: resourceChunk.file_url,
        workspace_file_id: resourceChunk.workspace_file_id,
      };

      mixpanel.track(EventName.ChunkClicked, {
        chunk_id: resourceChunk.chunk_id,
        file_name: file_data.filename,
        url: file_data.url,
        chat_id: getChatIdFromPath(window.location.pathname),
        chunk_text: resourceChunk.chunk,
        chunk_index: chunkName.toString(),
        time_clicked: new Date().toISOString(),
        location: chunk_click_attribution,
      });

      setChunks(resourceChunk);
      setFileData(file_data);
      triggerRefresh();

      if (isDocumentChunk(resourceChunk, resourceChunk.metadata)) {
        changeRoute(SideBarRoutes.FILE_VIEW);
      } else if (isSubtitleChunk(resourceChunk, resourceChunk.metadata)) {
        changeRoute(SideBarRoutes.VIDEO_VIEW);
      }
    },
    [resourceChunk, chunkName, chunk_id, setChunks, setFileData, triggerRefresh, changeRoute],
  );

  return handleChunkClicked;
}
