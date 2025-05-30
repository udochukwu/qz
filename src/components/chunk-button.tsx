import useChunksStore from '@/features/chat/stores/chunks-strore';
import { useHandleChunkClick } from '@/hooks/use-handle-chunk-click';
import { usePathname } from 'next/navigation';
import { memo, useCallback } from 'react';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

interface ChunkButtonProps {
  chunk_id: string;
}

const ChunkButton = memo<ChunkButtonProps>(({ chunk_id }) => {
  const chunk_name = useChunksStore(state => state.getChunkName(chunk_id));
  const handleChunkClicked = useHandleChunkClick(chunk_id);
  const pathname = usePathname();
  const onClick = () => {
    //if path name is /quiz we send event to mixpanel
    var location = pathname.startsWith('/quiz') ? 'quiz_citation' : 'in_text_citation';
    handleChunkClicked(location);
  };

  // Don't render if no chunk name
  if (chunk_name === 0) return null;

  return (
    <styled.button
      fontSize="sm"
      fontWeight="normal"
      backgroundColor="#6D56FA1A"
      color="#6D56FA"
      width="26px"
      minWidth="26px"
      minHeight="26px"
      height="26px"
      borderRadius="50%"
      cursor="pointer"
      transition="all 0.1s ease-in-out"
      _active={{
        scale: 0.95,
      }}
      _hover={{
        backgroundColor: '#6D56FA20',
      }}
      onClick={onClick}>
      {chunk_name}
    </styled.button>
  );
});

ChunkButton.displayName = 'ChunkButton';

export default ChunkButton;
