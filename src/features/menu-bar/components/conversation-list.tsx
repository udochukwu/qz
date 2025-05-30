import { RecentChatHistoryProps } from '@/types';
import { Flex, styled, VStack } from 'styled-system/jsx';
import { ConversationItem } from './conversation-item';
import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Skeleton } from '@/components/elements/skeleton';
import { useTranslation } from 'react-i18next';

interface ConversationListProps {
  conversations: RecentChatHistoryProps[];
  currentChat: string | null;
  isLoading: boolean;
  currentWorkspace: string | null;
  OnAddChatToWorkspace?: (chatId: string) => void; //if this exists <=> conversations are unassigned chats
}
export default function ConversationList({
  conversations,
  OnAddChatToWorkspace,
  currentChat,
  isLoading,
  currentWorkspace,
}: ConversationListProps) {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(true);
  useEffect(() => {
    setIsExpanded(true);
  }, [conversations]);
  if (isLoading)
    return (
      <>
        <Flex mt={4} mb={2} justifyContent={'space-between'}>
          <Skeleton w={'50%'} h={'25px'} />
          <Skeleton w={'10%'} h={'25px'} />
        </Flex>
        <VStack gap={2} mt={4}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} w={'100%'} h={'40px'} />
          ))}
        </VStack>
      </>
    );
  return (
    <>
      <Flex
        alignItems={'center'}
        mt={4}
        mb={2}
        _hover={{ cursor: 'pointer' }}
        justifyContent={'space-between'}
        onClick={() => setIsExpanded(!isExpanded)}>
        <styled.span fontWeight={'medium'} color={'#3E3C46'}>
          {t('class.menu.conversationList.recent')}
        </styled.span>
        {isExpanded ? <ChevronDownIcon size={20} color="#3E3C46" /> : <ChevronUpIcon size={20} color="#3E3C46" />}
      </Flex>
      {isExpanded && (
        <VStack gap={2} mt={4}>
          {conversations.map(chat => (
            <ConversationItem
              key={chat.chat_id}
              chat_id={chat.chat_id}
              description={chat.description}
              OnAddChatToWorkspace={chat.workspace_id == null ? OnAddChatToWorkspace : undefined}
              active={chat.chat_id === currentChat}
              workspace_id={chat.workspace_id ?? currentWorkspace}
            />
          ))}
        </VStack>
      )}
    </>
  );
}
