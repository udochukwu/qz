import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button';
import { useCreateYoutubeModalStore } from '../stores/upload-youtube-modal-store';
import { useIngestVideo } from '../hooks/use-ingest-video';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { IngestVideoResponse } from '../types/api-types';
import { HStack, Stack, styled } from 'styled-system/jsx';
import { Select } from '@/components/elements/select';
import { AxiosError } from 'axios';
import { Modal } from '@/components/modal/modal';
import { Dialog } from '@/components/elements/dialog';
import { UploadYoutube } from '@/components/upload-youtube';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { PlaylistModal } from '@/features/chat/components/playlist-modal';
import { getYouTubeUrl } from '@/features/chat/utils/get-youtube-url';

interface Props {
  variant?: 'primary' | 'outline' | 'sidebar';
  crudPayload?: CRUDFilesPost;
  onSuccess?: (data: IngestVideoResponse) => void;
  disabled?: boolean;
  isOpenOverride?: boolean;
  onOpenChangeOverride?: (isOpen: boolean) => void;
  modalZIndex?: number;
}

export default function UploadYoutubeButton({
  variant = 'primary',
  crudPayload,
  onSuccess,
  disabled,
  isOpenOverride,
  onOpenChangeOverride,
  modalZIndex,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const [url, setUrl] = useState('');
  const searchParams = useSearchParams();

  // Use either the overridden state or the internal state
  const internalState = useCreateYoutubeModalStore();
  const isOpen = isOpenOverride !== undefined ? isOpenOverride : internalState.isOpen;
  const setIsOpen = onOpenChangeOverride || internalState.setIsOpen;

  const { mutateAsync: uploadVideo, isLoading } = useIngestVideo(crudPayload);

  const YoutubeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.0403 1.77498C11.9883 1.57168 11.8888 1.38365 11.7498 1.22639C11.6109 1.06914 11.4366 0.947179 11.2412 0.870567C9.35075 0.140418 6.34192 0.147036 6.17648 0.147036C6.01104 0.147036 3.00221 0.140418 1.11177 0.870567C0.916415 0.947179 0.742079 1.06914 0.603142 1.22639C0.464204 1.38365 0.364647 1.57168 0.312684 1.77498C0.169853 2.32535 0 3.33123 0 4.99999C0 6.66874 0.169853 7.67462 0.312684 8.22499C0.364569 8.4284 0.464091 8.61654 0.603033 8.77389C0.741975 8.93125 0.916352 9.05329 1.11177 9.12996C2.9228 9.82867 5.75736 9.85294 6.14009 9.85294H6.21288C6.5956 9.85294 9.43182 9.82867 11.2412 9.12996C11.4366 9.05329 11.611 8.93125 11.7499 8.77389C11.8889 8.61654 11.9884 8.4284 12.0403 8.22499C12.1831 7.67352 12.353 6.66874 12.353 4.99999C12.353 3.33123 12.1831 2.32535 12.0403 1.77498ZM7.97373 5.35955L5.76784 6.90367C5.70186 6.94989 5.62447 6.97717 5.54408 6.98253C5.4637 6.9879 5.38337 6.97114 5.31183 6.93409C5.24029 6.89704 5.18026 6.84111 5.13825 6.77236C5.09624 6.70361 5.07386 6.62467 5.07354 6.54411V3.45587C5.07356 3.37516 5.09572 3.29601 5.13761 3.22702C5.1795 3.15803 5.2395 3.10186 5.3111 3.06461C5.3827 3.02736 5.46314 3.01047 5.54367 3.01576C5.62421 3.02106 5.70174 3.04835 5.76784 3.09465L7.97373 4.63877C8.03176 4.67946 8.07912 4.73354 8.11183 4.79641C8.14453 4.85929 8.1616 4.92912 8.1616 4.99999C8.1616 5.07086 8.14453 5.14069 8.11183 5.20356C8.07912 5.26644 8.03176 5.32051 7.97373 5.3612V5.35955Z"
        fill="#15112B"
        fillOpacity="0.9"
      />
    </svg>
  );

  const { mutateAsync: createChat, isLoading: isCreatingChat } = useCreateChat(
    async () => {},
    () => {
      setIsOpen(false);
      sendErrorMessage("Couldn't chat with Video. Please try again.");
    },
  );

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const handleVideoUpload = async (videoUrl: string, chatId?: string) => {
    if (!videoUrl) return;

    const { videoId, playlistId } = getYouTubeUrl(videoUrl);

    if (playlistId) {
      setShowPlaylistModal(true);
      setIsOpen(false);
      return;
    }

    let finalUrl = videoUrl;
    if (videoId) {
      finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    let finalChatId = chatId || crudPayload?.chat_id;
    if (!finalChatId) {
      // Create a chat if not present
      const chat = await createChat({});
      finalChatId = chat.chat_id;
    }

    try {
      await uploadVideo(
        {
          video_url: finalUrl,
          chat_id: finalChatId,
          ...crudPayload,
        },
        {
          onSuccess({ data }) {
            if (onSuccess) {
              onSuccess(data);
            }
            if (variant === 'primary' && !chatId) {
              createChat({});
            } else {
              setUrl('');
              setIsOpen(false);
            }
          },
          onError: (e: AxiosError) => {
            if (e?.response?.status !== 426) {
              sendErrorMessage("Couldn't upload Youtube video");
            }
          },
        },
      );
    } catch (e) {}
  };

  // Handle playlist modal confirm
  const handlePlaylistModalConfirm = async (selectedVideos: any[]) => {
    setShowPlaylistModal(false);
    if (!selectedVideos.length) return;
    for (const video of selectedVideos) {
      await handleVideoUpload(video.url);
    }
    setUrl('');
    setIsOpen(false);
  };

  // Hook for creating a chat specifically for the video upload
  const { mutateAsync: createChatForVideo, isLoading: isCreateChatLoading } = useCreateChat(
    async (data: { chat_id: string }) => {
      await handleVideoUpload(url, data.chat_id);
    },
  );

  const onUpload = async () => {
    if (!url) return;
    await handleVideoUpload(url);
  };

  return (
    <>
      {variant !== 'sidebar' ? (
        <Button
          onClick={e => {
            e.stopPropagation(); // Prevents the click from openning upload file
            setIsOpen(true);
          }}
          size="sm"
          colorPalette={variant === 'primary' ? 'red' : 'black'}
          bgColor={variant === 'primary' ? 'red' : '#15112b'}
          variant={'solid'}
          disabled={disabled}>
          <styled.span mr={1}>{'▶ '}</styled.span>
          <span>
            {variant === 'primary' ? t('chat.fileUpload.youtube.uploadFrom') : t('chat.fileUpload.youtube.from')}
          </span>
        </Button>
      ) : (
        <Select.Item key={'From Youtube'} item={'item3'} w={'100%'} onClick={() => setIsOpen(true)}>
          <HStack gap={2}>
            <YoutubeIcon />
            <Select.ItemText textStyle={isOpenOverride ? 'xs' : searchParams.get('tab') === 'Flashcards' ? 'xs' : 'sm'}>
              {' '}
              {t('chat.fileUpload.youtube.from')}
            </Select.ItemText>
          </HStack>
        </Select.Item>
      )}

      {isMounted && (
        <>
          {showPlaylistModal ? (
            <PlaylistModal
              isOpen={showPlaylistModal}
              onClose={() => setShowPlaylistModal(false)}
              onConfirm={handlePlaylistModalConfirm}
              message={url}
              chatId={crudPayload?.chat_id || null}
            />
          ) : (
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} zIndex={modalZIndex}>
              <div>
                <Dialog.Title pt={'24px'} px={11} fontSize={'22px'}>
                  {t('chat.fileUpload.youtube.uploadFrom')}
                </Dialog.Title>
                <styled.hr marginBottom={'20px'} />
                <Stack pb={'35px'} px={6}>
                  <Dialog.Description fontSize={'lg'} display={'inline-flex'} px={'20px'} pb={'20px'} color={'#868492'}>
                    {t('chat.fileUpload.youtube.description')}
                  </Dialog.Description>
                  <UploadYoutube
                    input={url}
                    isLoading={isLoading || isCreatingChat || isCreateChatLoading}
                    onChange={e => setUrl(e)}
                    onUpload={onUpload}
                  />
                </Stack>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
}
