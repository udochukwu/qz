import { styled } from 'styled-system/jsx';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { ArrowUpRight } from 'lucide-react';
import { ResourceChunk } from '@/types';
import { useHandleChunkClick } from '@/hooks/use-handle-chunk-click';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import useChunksStore from '@/features/chat/stores/chunks-strore';
import { LinkIcon } from 'lucide-react';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';

const ArrowUpRightAnimated = motion(ArrowUpRight);
const LinkIconAnimated = motion(LinkIcon);
const FileItemExtensionAnimated = motion(FileItemExtension);
const StyledMotionP = motion(styled.p);

interface SourceButtonProps {
  chunkId: string;
}

function formatChunkMetadata(chunk: any): string {
  if (!chunk || !chunk.metadata) return '';

  // For subtitle chunks (video/audio)
  if (chunk.chunk_type === 'subtitle' && chunk.metadata.start_time !== undefined) {
    const startTime = formatTime(chunk.metadata.start_time);
    const endTime = formatTime(chunk.metadata.end_time);
    return `${startTime} - ${endTime}`;
  }

  // For document chunks (PDF)
  if (chunk.chunk_type === 'text' && chunk.metadata.page_number !== undefined) {
    return `Page ${chunk.metadata.page_number + 1}`;
  }

  return '';
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function SourceButton({ chunkId }: SourceButtonProps) {
  const pathname = usePathname();
  const chunk = useChunksStore(state => state.getChunk(chunkId))[0];
  const [isHovered, setIsHovered] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    //if path name is /quiz we send event to mixpanel
    var location = 'source_button_clicked';
    handleChunkClick(location);
  };

  const handleChunkClick = useHandleChunkClick(chunk?.chunk_id);

  if (!chunk) return null;

  return (
    <styled.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      rounded="lg"
      onClick={onClick}
      backgroundColor="#E5E7EB60"
      border="1px solid #E5E7EB50"
      color="#4B5563"
      cursor="pointer"
      p={2}
      display="flex"
      alignItems="start"
      gap={2}
      key={chunkId}
      transition="all 0.1s ease-in-out"
      _active={{
        scale: 0.99,
      }}
      _hover={{
        backgroundColor: '#E5E7EB40',
        border: '1px solid #E5E7EB20',
      }}>
      <styled.div
        display={'flex'}
        flexDirection={'column'}
        textAlign={'left'}
        position={'relative'}
        overflow={'hidden'}>
        <styled.p
          fontSize="xs"
          display={'inline-flex'}
          alignItems={'center'}
          gap={1}
          opacity={1}
          fontWeight={'medium'}
          p={0}
          m={0}>
          {chunk.ws_file_name.split('.')[0].length > 20
            ? `${chunk.ws_file_name.split('.')[0].slice(0, 20)}...`
            : chunk.ws_file_name.split('.')[0]}
        </styled.p>
        <styled.p
          fontSize="xs"
          display={'flex'}
          alignItems={'center'}
          gap={1}
          fontWeight={'medium'}
          p={0}
          m={0}
          opacity={0.8}>
          <FileItemExtension
            iconSize={12}
            fontSize={'0.4rem'}
            height={'1rem'}
            width={'1rem'}
            extension={chunk.ws_file_name.split('.').pop() || ''}
          />
          {formatChunkMetadata(chunk)}
        </styled.p>
      </styled.div>

      <styled.div position={'relative'} w={'16px'} h={'17px'} overflow={'hidden'}>
        {/* <motion.div
          style={{
            position: 'absolute',
          }}
          animate={{
            marginLeft: isHovered ? '14px' : '0px',
            marginTop: isHovered ? '-14px' : '0px',
            opacity: isHovered ? 0 : 1,
          }}>
          
        </motion.div> */}
        <ArrowUpRightAnimated
          style={{
            position: 'absolute',
          }}
          size={16}
          animate={{
            marginLeft: isHovered ? '14px' : '0px',
            marginTop: isHovered ? '-14px' : '0px',
            opacity: isHovered ? 0 : 1,
          }}
        />
        <ArrowUpRightAnimated
          style={{
            position: 'absolute',
          }}
          size={16}
          animate={{
            marginTop: isHovered ? '0px' : '16px',
            marginLeft: isHovered ? '0px' : '-16px',
            opacity: isHovered ? 1 : 0,
          }}
        />
      </styled.div>
    </styled.button>
  );
}
