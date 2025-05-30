import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, MessageCircleMoreIcon } from 'lucide-react';
import { HStack, VStack, Divider, Box } from 'styled-system/jsx';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { Button } from '@/components/elements/button';
import { SpinningIcon } from '@/components/spinning-icon';
import { IconButton } from '@/components/elements/icon-button';
import { getPageName } from '@/utils/page-name-utils';
import { ResourceChunk, isSubtitleChunk } from '@/types';
import { token } from 'styled-system/tokens';
import { WorkspaceFile } from '../../types/types';
import { VideoPlayer } from './video/video-player';
import AudioPlayer from './audio/audio-player';
import AudioPlayerSafari from './audio/audio-player-safari';
import TranscriptDisplay from './transcripts-display';
import { useFileMedia } from '../../hooks/files/use-file-video-youtube';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose?: VoidFunction;
  file: WorkspaceFile;
  chunk?: ResourceChunk;
}

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const PreviewEntireMedia = ({ onClose, file, chunk }: Props) => {
  const { t } = useTranslation();

  const { mutate: createChat, isLoading } = useCreateChat();
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);

  useEffect(() => {
    setIsSafariBrowser(isSafari());
  }, []);

  const workspace_file_id = file.workspace_file_id ?? chunk?.ws_file_id;
  const onCreateChat = () => {
    createChat({ workspace_file_ids: [workspace_file_id] });
  };

  const { data, isLoading: isFileMediaLoading } = useFileMedia({
    workspace_file_id: workspace_file_id,
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    mixpanel.track(EventName.FileUnexpanded, {
      page: getPageName(window.location.pathname),
      fileId: workspace_file_id,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  };

  const getStartTime = () => {
    if (chunk && isSubtitleChunk(chunk, chunk.metadata)) {
      return chunk.metadata.start_time;
    }
    return undefined;
  };

  const [currentTime, setCurrentTime] = useState<number>(getStartTime() || 0);
  const [playingTime, setPlayingTime] = useState<number>(currentTime);

  const isVideo = data?.type === 'video';

  const AudioPlayerComponent = isSafariBrowser ? AudioPlayerSafari : AudioPlayer;

  return (
    <VStack p={4} overflowY="clip" h="100vh" gap={4}>
      <HStack w="100%" justify="space-between">
        <Box flexDirection="row" flex={1} display={'flex'} alignItems={'center'}>
          <IconButton variant="ghost" onClick={handleClose}>
            <ChevronLeftIcon size={20} color="#292829" />
          </IconButton>
          <Box fontSize={14} fontWeight="semibold">
            {file.filename}
          </Box>
        </Box>
        <Button
          variant="ghost"
          color={'quizard.black'}
          bg={'rgba(21, 17, 43, 0.05)'}
          onClick={onCreateChat}
          textStyle="sm"
          disabled={isLoading}>
          {isLoading ? <SpinningIcon /> : <MessageCircleMoreIcon size={12} color={token('colors.quizard.black')} />}
          <span>{t('common.startChat')}</span>
        </Button>
      </HStack>
      <Divider />
      {isFileMediaLoading || !data ? (
        <HStack>
          <SpinningIcon />
        </HStack>
      ) : (
        <Box justifyContent="center" w="100%" flex={1} position="relative" paddingTop={isVideo ? '56.25%' : '0'}>
          {isVideo ? (
            <VideoPlayer
              url={data.external_media_metadata.url}
              startTime={getStartTime()}
              newTime={currentTime}
              onProgress={playedSeconds => {
                setPlayingTime(playedSeconds);
              }}
            />
          ) : (
            <AudioPlayerComponent
              url={data.external_media_metadata.url}
              startTime={getStartTime()}
              newTime={currentTime}
              onProgress={playedSeconds => {
                setPlayingTime(playedSeconds);
              }}
            />
          )}
        </Box>
      )}
      {!isFileMediaLoading && data && (
        <TranscriptDisplay
          subtitles={data.subtitles}
          playingTime={playingTime}
          setCurrentTime={setCurrentTime}
          totalDuration={data.external_media_metadata.duration}
        />
      )}
    </VStack>
  );
};
