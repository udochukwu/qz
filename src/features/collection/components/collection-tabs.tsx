import { HStack, styled } from 'styled-system/jsx';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FlashcardIcon } from '../../menu-bar/components/flashcard-icon';
import { MessageCircleMore, BookOpenCheck } from 'lucide-react';

export enum COLLECTION_TAB {
  CHATS = 'chats',
  FLASHCARDS = 'flashcards',
  QUIZZES = 'quizzes',
}

const tabs: { label: string; icon: (color: string) => ReactElement; key: COLLECTION_TAB }[] = [
  {
    label: 'common.chats',
    icon: (color: string) => <MessageCircleMore size={16} color={color} />,
    key: COLLECTION_TAB.CHATS,
  },
  {
    label: 'common.flashcards',
    icon: (color: string) => <FlashcardIcon color={color} />,
    key: COLLECTION_TAB.FLASHCARDS,
  },
  {
    label: 'common.quizzes',
    icon: (color: string) => <BookOpenCheck size={16} color={color} />,
    key: COLLECTION_TAB.QUIZZES,
  },
];

interface CollectionTabsProps {
  setCurrentView: (view: COLLECTION_TAB) => void;
  currentView: COLLECTION_TAB;
}

export function CollectionTabs({ setCurrentView, currentView }: CollectionTabsProps) {
  const { t } = useTranslation();

  return (
    <HStack
      borderRadius="8px"
      p="4px"
      alignItems="center"
      bg="#F8F8F9"
      borderWidth={1}
      borderColor="#5F5F5F0F"
      height="40px">
      {tabs.map(({ label, icon, key }) => {
        const isSelected = currentView === key;
        return (
          <HStack
            key={key}
            onClick={() => {
              setCurrentView(key);
            }}
            cursor="pointer"
            justifyContent="center"
            alignItems="center"
            flex={1}
            p="6px"
            height="32px"
            bg={isSelected ? 'white' : 'unset'}
            gap="6px"
            borderRadius="6px"
            borderColor="#E2E2E280"
            borderWidth={isSelected ? 1 : 0}>
            {icon(isSelected ? '#3E3C46' : '#868492')}
            <styled.p
              fontWeight="500"
              fontSize="0.875rem"
              lineHeight="1.125rem"
              m="0"
              color={isSelected ? '#3E3C46' : '#868492'}>
              {t(label)}
            </styled.p>
          </HStack>
        );
      })}
    </HStack>
  );
}
