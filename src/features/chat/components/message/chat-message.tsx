import { Avatar } from '@/components/elements/avatar';
import { AuthorTypes, ChatMessageProps, MessageStatus } from '@/types';
import { HStack, styled, VStack } from 'styled-system/jsx';
import { useUserStore } from '@/stores/user-store';
import MessageRendererV2 from '../message-rendererengine';
import useChatStore from '../../stores/chat-store';
import { useEffect, useState } from 'react';
import AIMessageFooter from './ai-message-footer';
import getMessageWithNoChunks from '../../utils/get-message-with-no-chunks';
import CopilotView from '../copilot/CopilotView';
import { Skeleton } from '@/components/elements/skeleton';
import { getChatIdFromPath } from '@/utils/page-name-utils';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import Markdown from 'react-markdown';
import { PDF_API } from '@/lib/API';
import { IconButton } from '@/components/elements/icon-button';
import UserMessage from './user-message';
import { processLatexContent } from '../../utils/latex-processor';

interface ExtendedChatMessageProps extends ChatMessageProps {
  onSendEditedMessage?: (message: string, parent_message_id: string | null) => void;
  isChatLoading: boolean;
  isPro: boolean;
}

export default function ChatMessage({
  message,
  author,
  isPro,
  isStreaming = false,
  resource_chunks,
  message_id,
  status,
  siblings_node_ids,
  parent_message_id,
  onSendEditedMessage,
  isChatLoading,
  copilot,
}: ExtendedChatMessageProps) {
  const { user_image } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const addToSelectedNodes = useChatStore(state => state.addToSelectedNodes);
  const [currentMessageId, setCurrentMessageId] = useState(message_id);
  const current_message_index = siblings_node_ids?.indexOf(currentMessageId) || 0;
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const isErrored = status === MessageStatus.ERROR;
  useEffect(() => {
    // This effect updates the edited message when the current message ID changes
    setEditedMessage(message);
    setCurrentMessageId(message_id);
    // Reset the editing state in case we were editing a different message
    setIsEditing(false);
  }, [message_id, message]);

  const handleSelectNode = (direction: 'next' | 'prev') => {
    const totalNodes = siblings_node_ids?.length || 0;
    if (!totalNodes) return;
    let newIndex = direction === 'next' ? current_message_index + 1 : current_message_index - 1;
    // Loop around if navigating beyond the first or last item
    if (newIndex >= totalNodes) newIndex = 0;
    if (newIndex < 0) newIndex = totalNodes - 1;

    const newSelectedMessageId = siblings_node_ids![newIndex];
    setCurrentMessageId(newSelectedMessageId);
    addToSelectedNodes({ message_id: parent_message_id, selected_child: newSelectedMessageId });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveChanges = () => {
    setIsEditing(false);
    onSendEditedMessage?.(editedMessage, parent_message_id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMessageWithNoChunks(message));
    mixpanel.track(EventName.MessageCopied, {
      chat_id: getChatIdFromPath(window.location.pathname),
      message_id: message_id,
      message: message,
    });
  };

  async function handleDownload() {
    const rehypePlugins = [rehypeRaw, rehypeKatex];
    const remarkPlugins = [remarkMath];
    const htmlData = processLatexContent(getMessageWithNoChunks(message));
    const renderedHTML = ReactDOMServer.renderToString(
      <Markdown rehypePlugins={rehypePlugins} remarkPlugins={remarkPlugins}>
        {htmlData}
      </Markdown>,
    );

    const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    </head>
    <body>
      ${renderedHTML}
    </body>
    </html>`;

    try {
      const response = await axios.post(
        PDF_API,
        { content: content },
        { headers: { 'Content-Type': 'application/json' }, responseType: 'json' },
      );

      const base64PDF = response.data;
      const binaryData = atob(base64PDF);
      const byteArray = new Uint8Array(Array.from(binaryData).map(char => char.charCodeAt(0)));

      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'unstuck-chat.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
    } finally {
    }

    mixpanel.track(EventName.MessageDownloaded, {
      chat_id: getChatIdFromPath(window.location.pathname),
      message_id: message_id,
      message: message,
    });
  }

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message); // Reset edited message to original
  };
  return (
    <VStack
      width="100%"
      gap={0}
      id={`chat-message`}
      display={status === MessageStatus.NEEDS_PRO ? 'none' : 'flex'}
      border={author.type === AuthorTypes.USER || isStreaming ? 'none' : '1px solid #5F5F5F0F'}
      borderRadius={'18px'}>
      {/* If the message isStreaming and no copilotData  Add loading text*/}
      {!copilot && isStreaming && (
        <HStack alignItems="center" width="100%" p={4} rounded="md">
          {/* <Lottie
            animationData={require('@assets/lottie/dotsloading.json')}
            loop
            autoplay
            style={{ width: 50, height: 50, marginRight: 10 }}
          /> */}
          <Skeleton width="100%" height="70px" />
        </HStack>
      )}
      {copilot && copilot.steps.length > 0 && <CopilotView data={copilot} />}

      {((copilot && copilot.state === 'completed') || author.type === AuthorTypes.USER) && (
        <HStack
          alignItems={author.type === AuthorTypes.USER ? 'flex-right' : 'flex-start'}
          overflowX="hidden"
          width="100%"
          pl={4}
          py={4}
          flexDirection={author.type === AuthorTypes.USER ? 'row-reverse' : 'row'}
          bg={author.type === AuthorTypes.USER ? 'transparent' : 'white'}
          borderRadius={'18px'}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
          {author.type === AuthorTypes.USER ? (
            <UserMessage
              isEditing={isEditing}
              handleEdit={handleEdit}
              isHovering={isHovering}
              message_id={message_id}
              message={message}
              resource_chunks={resource_chunks}
              isStreaming={isStreaming}
              isErrored={isErrored}
              editedMessage={editedMessage}
              onEditMessageChange={e => setEditedMessage(e.target.value)}
              authorName={author.name}
              userImage={user_image}
              current_message_index={current_message_index}
              siblings_node_ids={siblings_node_ids}
              handleSelectNode={handleSelectNode}
              isChatLoading={isChatLoading}
              onSave={saveChanges}
              onCancel={cancelEdit}
            />
          ) : (
            <styled.div overflowX="hidden" width="100%">
              <styled.div display={'flex'} flexDir={'row'} pr="26px" pl="10px">
                <Avatar name={author.name} size="xs" src={'/images/unstucklogo.svg'} mr="25px" />
                <styled.div width="100%" overflowX="auto">
                  <MessageRendererV2
                    className="message-renderer"
                    message_id={message_id}
                    message={message}
                    isStreaming={isStreaming}
                    isErrored={isErrored}
                  />
                </styled.div>
              </styled.div>
              <styled.div maxWidth="100%" minWidth="0" flexGrow={1} pt={1}>
                <AIMessageFooter
                  showCopy={!isStreaming && !isErrored}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  isPro={isPro}
                />
              </styled.div>
            </styled.div>
          )}
        </HStack>
      )}
    </VStack>
  );
}
