'use client';
import React, { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import ChatMessage from './components/message/chat-message';
import { ChatInput } from './components/input/chat-input';
import { useSendNewMessage } from './hooks/use-send-new-message';
import useChatStore from './stores/chat-store';
import { useChatHistory } from './hooks/use-chat-history';
import useKeepScrollPosition from './hooks/use-keep-scroll-position';
import CourseTitle from './components/chat-title';
import { ChatResponseRegenerate } from './components/chat-response-regenerate';
import { AuthorTypes, ChatMessageProps, MessageStatus } from '@/types';
import { getChatHistoryMessages } from './utils/chat-history-helper';
import { v4 as uuidv4 } from 'uuid';
import { ErrorRetry } from '../user-feedback/error-retry';
import ChatHeader from './components/chat-header';
import useSideBarStore from './stores/side-bar-store';
import { FeedbackCard } from './components/feedback-card';
import { useDeleteChat } from '@/features/chat/hooks/use-delete-chat';
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { Box, Flex, styled, VStack } from 'styled-system/jsx';
import { useRouter } from 'next13-progressbar';
import useNewMessageStore from './stores/new-message-stroe';
import { useFiles } from '../files-pdf-chunks-sidebar/hooks/files/use-files';
import { WorkspaceFileUploadStatus } from '../files-pdf-chunks-sidebar/types/types';
import useGetChatId from './hooks/use-chatId';
import { ShareChatModal } from './components/share-chat-modal';
import { Skeleton } from '@/components/elements/skeleton';
import MessagesUpgradeBox from '@/features/paywall/components/gatekeeping/messages-upgrade-box';
import { useRenameChat } from './hooks/use-rename-chat';
import { class_title_params, CompactFileSuggestion, CompactSuggestion } from './types';
import { useSubscriptionStatus } from '../paywall/hooks/use-subscription-status';
import { MessageSuggestionList } from './components/input/message-suggestion';
import { useChatSuggestion } from './hooks/use-chat-suggestion';
import FeedbackView from './components/feedback/feedback-view';
import { getClientCookie } from '@/utils/cookies';
import { FEEDBACK_SUBMITTED } from './consts/feedback';
// import useFeedbackStore from './stores/use-feedback-store';

const SUGGESTION_MESSAGES = ['Summarize this', 'Create a study note'];

export function ChatView() {
  const { regenerateQuestion, onMessageSend } = useSendNewMessage();
  const isMessageStreaming = useNewMessageStore(state => state.isNewMessageLoading);
  const feedbackData = useNewMessageStore(state => state.feedbackData);
  const { data: chatHistory, isError, refetch, isLoading: isChatHistoryLoading } = useChatHistory();
  const { selectedNodes } = useChatStore();
  const chatId = useGetChatId();
  const router = useRouter();
  const { isSideBarOpen, setSideBarOpen } = useSideBarStore();
  let allMessages = getChatHistoryMessages(chatHistory?.messages ?? [], selectedNodes);
  const { containerRef } = useKeepScrollPosition(allMessages);
  const isStreamingErrored = allMessages[allMessages.length - 1]?.status === 'error';
  const parent_message_id = allMessages.length > 0 ? allMessages[allMessages.length - 1].message_id : null;
  const { data: fileList, isFetched: filesFetched } = useFiles({ crudPayload: { chat_id: chatId } });
  const { data: proData, isLoading: proStatusLoading } = useSubscriptionStatus();
  const {
    data: suggestedMessages,
    isLoading: isSuggestionLoading,
    refetch: refetchSuggestedMessages,
  } = useChatSuggestion();
  const is_free_user = !proStatusLoading && !proData?.is_pro;
  const [handleSend, setHandleSend] = useState<
    ((message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => Promise<void>) | null
  >(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  // const { showFeedbackForm, setShowFeedbackForm } = useFeedbackStore();

  const handleSendSuggestion = async (message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => {
    const isMessageInSuggestions = SUGGESTION_MESSAGES.includes(message);

    if (handleSend) {
      await handleSend(message, suggestion);

      if (isMessageInSuggestions) {
        const interval = setInterval(() => {
          if (!isMessageStreaming) {
            clearInterval(interval);
            // const feedbackCookie = getClientCookie(FEEDBACK_SUBMITTED);
            // if (feedbackCookie && feedbackCookie === 'true') {
            //   setShowFeedbackForm(false);
            // } else {
            //   setShowFeedbackForm(true);
            // }
          }
        }, 200);
      }
    }
  };

  useEffect(() => {
    if (!suggestedMessages || suggestedMessages.length === 0) {
      refetchSuggestedMessages();
    }
  }, [filesFetched, refetchSuggestedMessages, suggestedMessages]);

  const fileListData = fileList?.files ?? [];
  const successFilesCurrentWorkspace = fileListData.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED);
  const onRegenerateErroredResponse = (isHistoryErroredWithNoAIMessage = false) => {
    const erroredMsgIndex: number = allMessages.length - 1;
    const failedMsgID: string = allMessages[erroredMsgIndex].message_id;
    if (isHistoryErroredWithNoAIMessage) {
      regenerateQuestion(
        allMessages[erroredMsgIndex].message,
        chatId!,
        allMessages.length > 2 ? allMessages[erroredMsgIndex - 1].message_id : null,
        allMessages[erroredMsgIndex].message_id,
        failedMsgID,
      );
    } else {
      const erroredMsgQuestion: ChatMessageProps = allMessages[erroredMsgIndex - 1];
      const erroredMsgUserID: string = erroredMsgQuestion.message_id;
      const errorMsgParentId = allMessages.length > 2 ? allMessages[erroredMsgIndex - 2].message_id : null;
      regenerateQuestion(erroredMsgQuestion.message, chatId!, errorMsgParentId, erroredMsgUserID, failedMsgID);
    }
  };
  const { mutate: deleteChatPost, isLoading: isDeleting } = useDeleteChat();
  const { mutate: renameChatPost, isLoading: isRenaming } = useRenameChat();
  const isDeleteModalOpen = useBoolean();
  const isShareModalOpen = useBoolean();

  const deleteChat = async () => {
    await deleteChatPost(
      { chat_id: chatId! },
      {
        onSuccess: () => {
          isDeleteModalOpen.setFalse();
          router.push('/');
        },
      },
    );
  };

  const renameChat = async (new_chat_name: string, onSuccess?: VoidFunction) => {
    await renameChatPost({ chat_id: chatId, new_chat_name });
    onSuccess?.();
  };

  // Check for message query parameter
  useEffect(() => {
    const checkForMessageParam = async () => {
      if (chatId && !isChatHistoryLoading && handleSend) {
        // Get the message from the URL query parameter
        const url = new URL(window.location.href);
        const message = url.searchParams.get('message');

        if (message) {
          // Remove the message parameter from the URL
          url.searchParams.delete('message');
          window.history.replaceState({}, '', url.toString());

          // Send the message
          await handleSend(decodeURIComponent(message));
        }
      }
    };

    checkForMessageParam();
  }, [chatId, isChatHistoryLoading, handleSend]);

  const isHistoryErroredWithNoAIMessage =
    allMessages.length > 0 &&
    allMessages[allMessages.length - 1].author.type === AuthorTypes.USER &&
    !isChatHistoryLoading;

  const [classTitleParams, setClassTitleParams] = useState<class_title_params>({
    chat_name: chatHistory?.chat_title ?? '',
    is_class_chat: chatHistory?.is_class_chat ?? false,
    number_of_files: chatHistory?.number_of_files ?? 0,
    chat_desc: chatHistory?.chat_desc ?? '',
    workspace_id: chatHistory?.workspace_id ?? '',
  });

  useEffect(() => {
    if (!isChatHistoryLoading) {
      setClassTitleParams({
        chat_name: chatHistory?.chat_title ?? '',
        is_class_chat: chatHistory?.is_class_chat ?? false,
        number_of_files: chatHistory?.number_of_files ?? 0,
        chat_desc: chatHistory?.chat_desc ?? '',
        workspace_id: chatHistory?.workspace_id ?? '',
      });
    }
  }, [isChatHistoryLoading, chatHistory?.chat_desc, chatHistory?.chat_title]);

  const lastMessageErrored =
    allMessages.length > 0 && allMessages[allMessages.length - 1].status === MessageStatus.ERROR;
  const show_upgrade = chatHistory?.pro_required && is_free_user;
  if (lastMessageErrored && show_upgrade) {
    //change the last message status to be NEEDS_PRO
    allMessages[allMessages.length - 1].status = MessageStatus.NEEDS_PRO;
  }
  const onHandleSendReady = (
    fn: (message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => Promise<void>,
  ) => {
    setHandleSend(() => fn);
  };
  const handleMessageLoadingChange = (isLoading: boolean) => {
    setIsMessageLoading(isLoading);
  };
  if (isError) {
    return <ErrorRetry error="Chat could not load" retry={refetch} />;
  }

  return (
    <>
      <ShareChatModal chat_id={chatId!} setIsOpen={isShareModalOpen.setValue} isOpen={isShareModalOpen.value} />
      <ConfirmDeleteModal
        isLoading={isDeleting}
        name={classTitleParams.chat_desc}
        entityType="chat"
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteChat}
      />
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
        })}>
        {isChatHistoryLoading ? (
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="5%" py="4" w={'100%'}>
            <Skeleton w={'30%'} h={'32px'} />
          </Flex>
        ) : (
          <ChatHeader
            classTitleParams={classTitleParams}
            setClassTitleParams={setClassTitleParams}
            showFilesSideBar={isSideBarOpen}
            setSideBarOpen={setSideBarOpen}
            onDeleteClick={isDeleteModalOpen.setTrue}
            onShareClick={isShareModalOpen.setTrue}
            onRename={renameChat}
            isRenaming={isRenaming}
          />
        )}

        {allMessages.length === 0 && classTitleParams.chat_name !== '' ? (
          <>
            <CourseTitle {...classTitleParams} fileList={fileList} />
            <div
              ref={containerRef}
              className={css({
                overflowY: 'auto',
                display: 'flex',
                flex: 1,
                padding: '4',
                px: '5%',
                scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
                paddingBottom: '20px',
                alignItems: 'flex-end',
              })}>
              <MessageSuggestionList
                sendFromGeneratedSuggestion={handleSendSuggestion!}
                suggestedMessages={suggestedMessages ?? []}
              />
            </div>
          </>
        ) : (
          <div
            ref={containerRef}
            className={css({
              overflowY: 'auto',
              flex: 1,
              pt: '4',
              pl: '5%',
              pr: '3.8%',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
              paddingBottom: '20px',
            })}>
            <>
              {isChatHistoryLoading ? (
                <VStack gap={6}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <styled.div w="100%" key={idx}>
                      <Skeleton h={'200px'} w="100%" />
                    </styled.div>
                  ))}
                </VStack>
              ) : (
                allMessages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    {...message}
                    isChatLoading={isMessageStreaming}
                    isPro={!is_free_user}
                    onSendEditedMessage={(editedMessage: string, parent_message_id: string | null) => {
                      // Send the edited message to BE
                      const message_id = uuidv4();
                      onMessageSend(editedMessage, chatId!, parent_message_id, message_id);
                    }}
                  />
                ))
              )}
              {show_upgrade && <MessagesUpgradeBox />}
              {!isMessageLoading && (
                <styled.div mt={3}>
                  <MessageSuggestionList
                    sendFromGeneratedSuggestion={handleSend!}
                    suggestedMessages={suggestedMessages ?? []}
                  />
                </styled.div>
              )}
              {/* {showFeedbackForm && (
                <styled.div mt={7}>
                  <FeedbackView close={() => setShowFeedbackForm(false)} />
                </styled.div>
              )} */}
            </>
          </div>
        )}

        {feedbackData && Object.keys(feedbackData).length > 0 && <FeedbackCard feedbackData={feedbackData} />}
        {isStreamingErrored || lastMessageErrored || isHistoryErroredWithNoAIMessage ? (
          <ChatResponseRegenerate regenerate={() => onRegenerateErroredResponse(isHistoryErroredWithNoAIMessage)} />
        ) : (
          !isChatHistoryLoading && (
            <Box width="100%" px="5%">
              <ChatInput
                chatId={chatId}
                parent_message_id={parent_message_id}
                onHandleSendReady={onHandleSendReady}
                onMessageLoadingChange={handleMessageLoadingChange}
                iconStyle={{ height: '24px', width: '24px' }}
              />
            </Box>
          )
        )}
      </div>
    </>
  );
}
