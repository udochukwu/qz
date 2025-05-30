import React, { useEffect, useState } from 'react';
import { ChatHistory } from '../history-api-types';
import { Table } from '@/components/elements/table';
import { Flex, HStack, VStack } from 'styled-system/jsx';
import { styled } from 'styled-system/jsx';
import getMessageWithNoChunks from '@/features/chat/utils/get-message-with-no-chunks';
import { formatDistanceToNow } from 'date-fns';
import { Clock4Icon } from 'lucide-react';
import { NewChatIcon } from './new-chat-icon';
import { IconButton } from '@/components/elements/icon-button';
import { TrashIcon } from './trash-icon';
import { useSoftRouteToChat } from '@/features/chat/hooks/use-soft-route-to-chat';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { useDeleteChat } from '@/features/chat/hooks/use-delete-chat';
import { ClassesIconList } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/file-item/components/classes-icon-list';
import { useTranslation } from 'react-i18next';
interface Props {
  chatHistory: ChatHistory;
  idx: number;
}
export const HistoryRow = ({ chatHistory, idx }: Props) => {
  const { t } = useTranslation();

  const message = getMessageWithNoChunks(chatHistory.last_message);
  const [timeAgo, setTimeAgo] = useState('');
  const { routeToChat } = useSoftRouteToChat();
  const { mutate: deleteChatPost, isLoading } = useDeleteChat();
  const isDeleteModalOpen = useBoolean();
  const deleteChat = async () => {
    await deleteChatPost({ chat_id: chatHistory.chat_id });
    isDeleteModalOpen.setFalse();
  };
  const navigateToChat = () => {
    routeToChat(chatHistory.chat_id, 'conversations-history-page');
  };
  useEffect(() => {
    const updateTimeAgo = () => {
      const newTimeAgo = formatDistanceToNow(new Date(chatHistory.last_message_at * 1000), {
        addSuffix: true,
      });
      setTimeAgo(newTimeAgo);
    };
    updateTimeAgo();
    const intervalId = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(intervalId);
  }, [chatHistory.last_message_at]);

  return (
    <>
      <ConfirmDeleteModal
        name={chatHistory.description}
        entityType="chat"
        setIsOpen={isDeleteModalOpen.setValue}
        isOpen={isDeleteModalOpen.value}
        onConfirm={deleteChat}
      />
      <Table.Row key={idx} _hover={{ backgroundColor: 'white' }} borderBottom={0} w={'100%'} display={'flex'}>
        <Table.Cell py={3} pl={5} w={'70%'} h={'-webkit-fit-content'}>
          <VStack alignItems="flex-start" gap={2} width="100%">
            <styled.span fontWeight={500} textStyle="md" my={0} color="#111111">
              {chatHistory.description == '' ? t('common.untitledChat') : chatHistory.description}
            </styled.span>
            <styled.span
              fontWeight={500}
              textStyle="sm"
              color={'rgba(17, 17, 17, 0.7)'}
              my={0}
              display={'-webkit-box'}
              WebkitLineClamp={3}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              wordBreak={'break-word'}
              style={{
                WebkitBoxOrient: 'vertical',
              }}>
              {message}
            </styled.span>
            <HStack color={'rgba(17, 17, 17, 0.7)'} gap={1}>
              <Clock4Icon size="18" />
              {timeAgo}
            </HStack>
          </VStack>
        </Table.Cell>
        <Table.Cell py={3} w={'35%'}>
          <Flex width={'100%'} justifyContent={'space-between'} height={'100%'}>
            <ClassesIconList classNames={chatHistory.class_name ? [chatHistory.class_name] : []} />
            <HStack marginLeft={'auto'}>
              <IconButton variant={'outline'} borderColor={'#E7E8EA'} onClick={navigateToChat}>
                <NewChatIcon />
              </IconButton>
              <IconButton variant={'outline'} borderColor={'#E7E8EA'} onClick={isDeleteModalOpen.setTrue}>
                <TrashIcon />
              </IconButton>
            </HStack>
          </Flex>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
