import { RecentChatHistoryProps } from '@/types';
import { Flex, styled, VStack } from 'styled-system/jsx';
import { ConversationItem } from './conversation-item';
import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Skeleton } from '@/components/elements/skeleton';
import { useTranslation } from 'react-i18next';
import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { FlashcardItem } from './flashcard-item';
import { QuizPreview } from '@/features/quiz/types/quiz';
import { QuizItem } from './quiz-item';
// Combined type for both chats and flashcards
interface UnifiedItem {
  type: 'chat' | 'flashcard' | 'quiz';
  id: string;
  description: string;
  timestamp: string; // ISO date string for display
  timestampMs: number; // Milliseconds timestamp for sorting
  data: RecentChatHistoryProps | FlashcardSets | QuizPreview;
}

interface UnifiedItemListProps {
  conversations: RecentChatHistoryProps[];
  flashcardSets: FlashcardSets[];
  quizes: QuizPreview[];
  currentChat: string | null;
  currentFlashcardId: string | null;
  currentQuiz: string | null;
  isLoading: boolean;
  currentWorkspace: string | null;
  OnAddChatToWorkspace?: (chatId: string) => void;
}

export default function UnifiedItemList({
  conversations,
  flashcardSets,
  quizes,
  currentChat,
  currentFlashcardId,
  currentQuiz,
  isLoading,
  currentWorkspace,
  OnAddChatToWorkspace,
}: UnifiedItemListProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  // Combine and sort chats and flashcards by recency
  const unifiedItems: UnifiedItem[] = [
    ...conversations.map(chat => {
      // Handle both string and number formats for last_message_at
      let timestampMs: number;

      if (typeof chat.last_message_at === 'number') {
        // If it's already a number (Unix timestamp in seconds), convert to milliseconds
        timestampMs = chat.last_message_at * 1000;
      } else {
        // If it's a string (ISO date or Unix timestamp as string), try to parse it
        const maybeNumber = Number(chat.last_message_at);
        if (!isNaN(maybeNumber)) {
          // If it's a valid number (Unix timestamp as string), convert to milliseconds
          timestampMs = maybeNumber * 1000;
        } else {
          // If it's an ISO date string, parse it
          timestampMs = new Date(chat.last_message_at).getTime();
        }
      }

      return {
        type: 'chat' as const,
        id: chat.chat_id,
        description: chat.description,
        timestamp: chat.last_message_at,
        timestampMs,
        data: chat,
      };
    }),
    ...flashcardSets.map(flashcard => {
      // Convert ISO 8601 date string to milliseconds if available, otherwise use a very old date
      // to ensure flashcards without timestamps appear at the bottom
      const timestampMs = flashcard.created_at_utc
        ? new Date(flashcard.created_at_utc).getTime()
        : new Date(0).getTime();

      return {
        type: 'flashcard' as const,
        id: flashcard.set_id,
        description: flashcard.name || flashcard.file_names?.[0],
        // Use ISO 8601 date string if available, otherwise use a very old date
        timestamp: flashcard.created_at_utc
          ? new Date(flashcard.created_at_utc).toISOString()
          : new Date(0).toISOString(),
        timestampMs,
        data: flashcard,
      };
    }),
    ...quizes.map(quiz => {
      return {
        type: 'quiz' as const,
        id: quiz.quiz_id,
        description: quiz.title,
        timestamp: quiz.created_at_utc ? new Date(quiz.created_at_utc).toISOString() : new Date(0).toISOString(),
        timestampMs: quiz.created_at_utc ? new Date(quiz.created_at_utc).getTime() : new Date(0).getTime(),
        data: quiz,
      };
    }),
  ].sort((a, b) => b.timestampMs - a.timestampMs);

  useEffect(() => {
    setIsExpanded(true);
  }, [conversations, flashcardSets]);

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
      <Flex alignItems={'center'} mt={4} mb={2} _hover={{ cursor: 'default' }} justifyContent={'space-between'}>
        <styled.span fontWeight={'medium'} color={'#3E3C46'}>
          {t('class.menu.conversationList.recent')}
        </styled.span>
        {/* {isExpanded ? <ChevronDownIcon size={20} color="#3E3C46" /> : <ChevronUpIcon size={20} color="#3E3C46" />} */}
      </Flex>
      {isExpanded && (
        <VStack gap={2} mt={4}>
          {unifiedItems.map(item => {
            if (item.type === 'chat') {
              const chat = item.data as RecentChatHistoryProps;
              return (
                <ConversationItem
                  key={chat.chat_id}
                  chat_id={chat.chat_id}
                  description={chat.description}
                  OnAddChatToWorkspace={chat.workspace_id == null ? OnAddChatToWorkspace : undefined}
                  active={chat.chat_id === currentChat}
                  workspace_id={chat.workspace_id ?? currentWorkspace}
                />
              );
            }
            if (item.type === 'flashcard') {
              const flashcard = item.data as FlashcardSets;
              return (
                <FlashcardItem
                  key={flashcard.set_id}
                  flashcard={flashcard}
                  active={flashcard.set_id === currentFlashcardId}
                />
              );
            }
            if (item.type === 'quiz') {
              const quiz = item.data as QuizPreview;
              return <QuizItem active={quiz.quiz_id === currentQuiz} key={quiz.quiz_id} quiz={quiz} />;
            }
          })}
        </VStack>
      )}
    </>
  );
}
