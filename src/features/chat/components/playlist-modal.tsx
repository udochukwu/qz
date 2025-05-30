import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/modal/modal';
import { Button } from '@/components/elements/button';
import { styled, VStack, HStack, Box } from 'styled-system/jsx';
import { X, AppWindow, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useIngestVideo } from '@/features/upload-youtube/hooks/use-ingest-video';
import { getYouTubeUrl } from '../utils/get-youtube-url';
import { usePlaylistFetch } from '../hooks/use-playlist-fetch';
import { PlaylistFullLoader } from './playlist-full-loader';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

interface PlaylistVideo {
  video_id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  playlist_title?: string;
}

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedVideos: PlaylistVideo[]) => void;
  message: string;
  chatId: string | null;
}

export function PlaylistModal({ isOpen, onClose, onConfirm, message, chatId }: PlaylistModalProps) {
  const { t } = useTranslation();
  const parseUrl = getYouTubeUrl;
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const { mutateAsync: uploadVideo, isLoading: isUploading } = useIngestVideo({ chat_id: chatId });
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const { videos, isLoading: isFetching } = usePlaylistFetch({
    playlistId,
    onError: error => {
      toast.error(t('playlist.error.fetch'));
    },
  });
  const { mutateAsync: createChat } = useCreateChat();

  useEffect(() => {
    if (isOpen && message) {
      const { playlistId: id, videoId } = parseUrl(message);
      if (!id) {
        toast.error(t('playlist.error.invalid_url'));
        return;
      }
      setPlaylistId(id);
      if (videoId) {
        setSelectedVideos([videoId]);
      } else {
        setSelectedVideos([]);
      }

      // Track when playlist modal is opened
      mixpanel.track(EventName.PlaylistImported, {
        playlist_id: id,
        video_id: videoId || null,
        action: 'modal_opened',
        total_videos: videos.length,
      });
    }
  }, [isOpen, message]);

  useEffect(() => {
    if (isOpen && videos.length > 0 && selectedVideos.length === 0) {
      setSelectedVideos(videos.map(video => video.video_id));
    }
  }, [isOpen, videos]);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideos(prev => (prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]));
  };

  const handleSelectAll = () => {
    setSelectedVideos(prev => (prev.length === videos.length ? [] : videos.map(video => video.video_id)));
  };

  const formatDuration = (duration: string) => {
    const seconds = parseInt(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    let finalChatId = chatId;
    if (!finalChatId) {
      const chat = await createChat({});
      finalChatId = chat.chat_id;
    }
    const selected = videos.filter(video => selectedVideos.includes(video.video_id));
    for (const video of selected) {
      await uploadVideo(
        { video_url: video.url.trim(), chat_id: finalChatId },
        {
          onSuccess: () => {},
        },
      );
    }

    // Track selected videos import
    mixpanel.track(EventName.PlaylistImported, {
      playlist_id: playlistId,
      action: 'selected_import',
      selected_videos_count: selected.length,
      total_videos: videos.length,
    });

    onConfirm(selected);
    onClose();
  };

  const handleImportFullPlaylist = async () => {
    setSelectedVideos(videos.map(video => video.video_id));
    await new Promise(resolve => setTimeout(resolve, 300));
    const { playlistId } = parseUrl(message);
    if (!playlistId) return;
    const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    let finalChatId = chatId;
    if (!finalChatId) {
      const chat = await createChat({});
      finalChatId = chat.chat_id;
    }
    await uploadVideo(
      { video_url: playlistUrl, chat_id: finalChatId },
      {
        onSuccess: () => {},
      },
    );

    // Track full playlist import
    mixpanel.track(EventName.PlaylistImported, {
      playlist_id: playlistId,
      action: 'full_import',
      total_videos: videos.length,
    });

    onConfirm([]);
    onClose();
  };

  return (
    <>
      {isFetching ? (
        <Modal
          isOpen={isOpen}
          onOpenChange={open => !open && onClose()}
          width="400px"
          backgroundColor="rgba(255,255,255,0.95)">
          <PlaylistFullLoader />
        </Modal>
      ) : (
        <Modal isOpen={isOpen} onOpenChange={open => !open && onClose()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}>
            <Box
              padding="8"
              position="relative"
              maxWidth="800px"
              maxHeight="90vh"
              margin="0 auto"
              borderRadius="16px"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              backgroundColor="rgba(255, 255, 255, 0.9)"
              backdropFilter="blur(8px)"
              display="flex"
              flexDirection="column">
              <HStack alignItems="center" justifyContent="space-between" width="100%">
                <styled.h2 fontSize="30px" fontWeight="semibold" margin="0" padding="0">
                  {t('playlist.modal.title')}
                </styled.h2>
                <Button
                  fontSize="24px"
                  variant="ghost"
                  onClick={onClose}
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    marginLeft: 8,
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  aria-label="Close">
                  <X size={14} />
                </Button>
              </HStack>
              <styled.p fontSize="14px" color="#15112B80" marginBottom="16px">
                {t('playlist.modal.description')}
              </styled.p>
              <Box width="100%" height="1px" backgroundColor="#15112B0D" marginBottom="24px" />

              <VStack
                gap="2"
                width="100%"
                flex="1"
                overflowY="auto"
                paddingRight="2"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 0, 0, 0.2)',
                  },
                }}>
                <AnimatePresence>
                  {videos.map(video => (
                    <motion.div
                      key={video.video_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%' }}>
                      <HStack
                        alignItems="center"
                        gap="2"
                        padding="2"
                        paddingLeft="24px"
                        borderRadius="8px"
                        cursor="pointer"
                        onClick={() => handleVideoSelect(video.video_id)}
                        _hover={{ backgroundColor: 'rgba(109, 86, 250, 0.05)' }}
                        transition="all 0.2s"
                        position="relative"
                        overflow="hidden"
                        width="100%"
                        justifyContent="flex-start">
                        <styled.input
                          type="checkbox"
                          checked={selectedVideos.includes(video.video_id)}
                          onChange={() => handleVideoSelect(video.video_id)}
                          style={{
                            accentColor: '#6D56FA',
                            width: 20,
                            height: 20,
                            marginRight: 12,
                            cursor: 'pointer',
                          }}
                          onClick={e => e.stopPropagation()}
                          aria-label="Select video"
                        />
                        <Box position="relative">
                          <styled.img
                            src={video.thumbnail}
                            alt={video.title}
                            width="120px"
                            height="68px"
                            objectFit="cover"
                            borderRadius="4px"
                            transition="all 0.2s"
                            _hover={{ transform: 'scale(1.02)' }}
                          />
                        </Box>
                        <Box
                          flex="1"
                          textAlign="left"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-start">
                          <styled.h3 fontSize="md" fontWeight="medium" marginBottom="1" textAlign="left">
                            {video.title}
                          </styled.h3>
                          <styled.p fontSize="sm" color="gray.600" textAlign="left">
                            {formatDuration(video.duration)}
                          </styled.p>
                        </Box>
                      </HStack>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </VStack>

              <HStack gap="4" width="100%" justifyContent="center" marginTop="6">
                <Box width="50%" borderRadius="8px">
                  <Button
                    variant="outline"
                    onClick={handleImportFullPlaylist}
                    width="100%"
                    height="56px"
                    fontSize="14px">
                    <AppWindow size={14} style={{ marginRight: 8 }} />
                    {t('playlist.modal.fullPlaylist')}
                  </Button>
                </Box>
                <Box width="50%" borderRadius="8px">
                  <Button
                    onClick={handleConfirm}
                    width="100%"
                    backgroundColor={selectedVideos.length === 0 ? 'rgba(109, 86, 250, 0.1)' : '#6D56FA'}
                    color={selectedVideos.length === 0 ? '#6D56FA' : 'white'}
                    disabled={selectedVideos.length === 0 || isUploading}
                    height="56px"
                    fontSize="14px">
                    <Play size={14} style={{ marginRight: 8 }} />
                    <span>
                      {selectedVideos.length === 1 ? t('playlist.modal.singleVideo') : t('playlist.modal.singleVideos')}
                    </span>
                    <span
                      style={{
                        background: 'white',
                        color: '#6D56FA',
                        borderRadius: '6px',
                        padding: '2px 10px',
                        marginLeft: 15,
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'inline-block',
                        minWidth: '24px',
                        textAlign: 'center',
                        border: '1.5px solid #6D56FA',
                      }}>
                      {selectedVideos.length}
                    </span>
                  </Button>
                </Box>
              </HStack>
            </Box>
          </motion.div>
        </Modal>
      )}
    </>
  );
}
