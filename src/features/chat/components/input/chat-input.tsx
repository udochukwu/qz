import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/elements/button';
import { css } from 'styled-system/css';
import { ArrowRight, StopCircle } from 'lucide-react';
import useNewMessageStore from '../../stores/new-message-stroe';
import { useUserStore } from '@/stores/user-store';
import { useSendNewMessage } from '../../hooks/use-send-new-message';
import { useCreateChat } from '../../hooks/use-create-chat';
import { useSideBarRouter } from '@/features/files-pdf-chunks-sidebar/hooks/use-side-bar-router';
import { FilesChunksTabsEnum, WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { v4 as uuidv4 } from 'uuid';
import { TextArea } from '@/components/elements/text-area';
import { useStopStream } from '../../hooks/use-stop-stream';
import { VStack, styled } from 'styled-system/jsx';
import { useIngestVideo } from '@/features/upload-youtube/hooks/use-ingest-video';
import toast from 'react-hot-toast';
import { CompactFileSuggestion, CompactSuggestion } from '../../types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { PlaylistModal } from '../playlist-modal';
import { PlaylistVideo } from '../../types';
import { getYouTubeUrl } from '../../utils/get-youtube-url';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useQuizViewStore } from '@/features/quiz/stores/quiz-view-store';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';

interface ChatInputProps {
  chatId: string | null;
  parent_message_id?: string | null;
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  onHandleSendReady?: (
    fn: (message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => Promise<void>,
  ) => void;
  onMessageLoadingChange?: (isLoading: boolean) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export function ChatInput({
  chatId,
  parent_message_id = null,
  style,
  iconStyle,
  onHandleSendReady,
  onMessageLoadingChange,
  placeholder,
  inputRef,
}: ChatInputProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const { messageFromRedirect, setMessageFromRedirect, isNewMessageLoading } = useNewMessageStore();
  const { impersonated } = useUserStore();
  const { onMessageSend } = useSendNewMessage();
  const pathname = usePathname();
  const { data: fileList, isFetched: filesFetched } = useFiles({ crudPayload: { chat_id: chatId } });
  const { mutateAsync: createChat } = useCreateChat();
  const sentMessageRef = useRef('');
  const { changeTab } = useSideBarRouter();
  const [messageID, setMessageID] = useState<string>(uuidv4());
  const stopStreaming = useStopStream();
  const { mutateAsync: uploadVideo, isLoading: isCreateChatWithVideoLoading } = useIngestVideo({ chat_id: chatId });
  const defaultInputRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = inputRef || defaultInputRef;
  const { open } = useQuizViewStore();
  // State for playlist modal visibility
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const parseUrl = getYouTubeUrl;

  // Focus textarea when placeholder changes
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [placeholder]);

  const handleVideoUpload = async (videoUrl: string, chatId: string) => {
    await uploadVideo(
      { video_url: videoUrl.trim(), chat_id: chatId },
      {
        onSuccess: () => {
          // Track direct video import
          const { videoId } = parseUrl(videoUrl);
          mixpanel.track(EventName.VideoImported, {
            video_id: videoId,
            chat_id: chatId,
            is_new_chat: !chatId,
          });
        },
      },
    );
  };

  const { mutateAsync: createChatForVideo, isLoading: isCreateChatLoading } = useCreateChat(
    async (data: { chat_id: string }) => {
      await handleVideoUpload(message, data.chat_id);
    },
  );

  const disableInput = isCreateChatLoading || isCreateChatWithVideoLoading;
  const isLoading = isNewMessageLoading || disableInput;
  useEffect(() => {
    onMessageLoadingChange?.(isLoading);
  }, [isLoading]);

  const onStopStream = async () => {
    if (!parent_message_id) return;
    await stopStreaming({ message_id: parent_message_id });
  };

  useEffect(() => {
    // Check if there's a message to send and it's not the same as the last sent message

    if (messageFromRedirect && messageFromRedirect !== sentMessageRef.current && chatId) {
      const sendMessageFromRedirect = async () => {
        try {
          await onMessageSend(messageFromRedirect, chatId, null, messageID);
        } finally {
        }
      };
      sendMessageFromRedirect();
      sentMessageRef.current = messageFromRedirect; // Update ref with the last sent message
      setMessageFromRedirect(null);
    }
  }, [messageFromRedirect, onMessageSend, setMessageFromRedirect, chatId]);

  const handlePlaylistModalConfirm = async (selectedVideos: PlaylistVideo[]) => {
    setShowPlaylistModal(false);
    if (!selectedVideos.length) return;

    changeTab(FilesChunksTabsEnum.FILES);

    for (const video of selectedVideos) {
      await handleVideoUpload(video.url, chatId!);
    }
  };

  const handleSend = async (
    messageToSend: string = message,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => {
    const fileListWithMaxFiles = pathname.includes('c') ? (fileList?.files.slice(0, 8) as WorkspaceFile[]) : [];
    if (messageToSend.toLowerCase().includes(t('common.flashcardLower'))) {
      open('flashcards', fileListWithMaxFiles);
      mixpanel.track(EventName.FlashcardStarted, { source: 'typing_flashcard' });
      setMessage('');
      return;
    } else if (messageToSend.toLowerCase().includes(t('common.quizLower'))) {
      open('quiz', fileListWithMaxFiles);
      mixpanel.track(EventName.QuizModalOpened, { source: 'typing_quiz' });
      setMessage('');
      return;
    }

    if (messageToSend?.trim()) {
      const { videoId, playlistId, isYouTubeUrl } = parseUrl(messageToSend);

      try {
        if (chatId) {
          if (isYouTubeUrl) {
            if (playlistId) {
              setShowPlaylistModal(true);
              return;
            }
            setMessage('');
            changeTab(FilesChunksTabsEnum.FILES);
            await handleVideoUpload(messageToSend, chatId);
          } else {
            setMessage('');
            changeTab(FilesChunksTabsEnum.CHUNKS);
            const message_id = uuidv4();
            setMessageID(message_id);
            await onMessageSend(messageToSend, chatId, parent_message_id, message_id, suggestion);
          }
        } else {
          if (isYouTubeUrl) {
            if (playlistId) {
              setShowPlaylistModal(true);
              return;
            }
            setMessage('');
            await createChatForVideo({});
          } else {
            setMessage('');
            toast.success(t('chat.input.success'));
            await handleSendFromNewChat(messageToSend);
          }
        }
      } catch (error: any) {
        setMessage(messageToSend);
        if (error.response?.status !== 426) {
          toast.error(t('chat.input.error'));
        }
      }
    }
  };

  const handleSendFromNewChat = async (message: string) => {
    // Check if there are any selected files or class in the parent component
    const parentElement = document.querySelector('.classes-files-browser');
    let createChatParams = {};

    if (parentElement) {
      // Get the selected class or files from data attributes
      const selectedClassId = parentElement.getAttribute('data-selected-class-id');
      const selectedFileIds = parentElement.getAttribute('data-selected-file-ids');

      if (selectedClassId) {
        createChatParams = { workspace_id: selectedClassId };
      } else if (selectedFileIds) {
        createChatParams = { workspace_file_ids: selectedFileIds.split(',') };
      }
    }

    return createChat(createChatParams, {
      onSuccess: data => {
        // Add the message as a query parameter when redirecting
        router.push(`/c/${data.chat_id}?message=${encodeURIComponent(message)}`);
      },
    });
  };

  const handleButtonClick = () => {
    if (isLoading) {
      onStopStream();
    } else {
      handleSend();
    }
  };

  useEffect(() => {
    onHandleSendReady?.(handleSend);
  }, [parent_message_id]);

  const disabled = !message.trim() && !isLoading;
  return (
    <VStack alignItems="flex-start" gap={0}>
      <div
        className={css({
          display: impersonated ? 'none' : 'flex',
          gap: '2',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pr: '2',
          pl: '5',
          pt: '2',
          pb: '2',
          bgColor: 'white',
          rounded: '12px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#DCDCDC8F',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '5',
          marginTop: '2',
          maxHeight: '400px',
        })}
        style={{ ...style }}>
        <styled.div minHeight="36px" maxHeight="300px" overflowY="auto" w="100%" display="flex" alignItems="center">
          <TextArea
            id="messageTextArea"
            style={{
              width: '100%',
              marginTop: '0',
            }}
            isDisabled={disableInput}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={placeholder || t('chat.input.placeholder')}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholderColor="#3E3C46"
            ref={textAreaRef}
          />
        </styled.div>
        <Button
          onClick={handleButtonClick}
          className={css({
            cursor: 'pointer',
            '&:hover': !disabled
              ? {
                  backgroundColor: '#ffffff',
                  color: '#6D56FA',
                  boxShadow: '0px 9px 12px #A8A8A81F',
                }
              : {},
          })}
          color="#ffffff"
          size="sm"
          borderRadius="6px"
          px={2}
          disabled={disabled}>
          {isLoading ? <StopCircle size={28} /> : <ArrowRight style={{ ...(iconStyle || { scale: 1.5 }) }} />}
        </Button>
      </div>
      {showPlaylistModal && (
        <PlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          onConfirm={handlePlaylistModalConfirm}
          message={message}
          chatId={chatId}
        />
      )}
    </VStack>
  );
}
