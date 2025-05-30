'use client';

import { HistoryList } from '@/features/collection/components/history-list';
import { HStack, styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { CollectionTabs, COLLECTION_TAB } from '@/features/collection/components/collection-tabs';
import { CollectionIcon } from '@/features/menu-bar/components/menu-icons';
import { FlashcardList } from '@/features/collection/components/flashcard-list';
import { QuizList } from '@/features/collection/components/quiz-list';
import { useRouter, useSearchParams } from 'next/navigation';

const Collection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeTab = searchParams.get('tab');

  let currentTab;
  if (routeTab?.toLowerCase() === COLLECTION_TAB.FLASHCARDS.toString()) {
    currentTab = COLLECTION_TAB.FLASHCARDS;
  } else if (routeTab?.toLowerCase() === COLLECTION_TAB.QUIZZES.toString()) {
    currentTab = COLLECTION_TAB.QUIZZES;
  } else {
    currentTab = COLLECTION_TAB.CHATS;
  }
  const handleTabChange = (value: COLLECTION_TAB) => {
    router.push(`?tab=${value.toString()}`);
  };

  return (
    <styled.section w="100%" h="100vh" overflow="hidden" display="flex" flexDirection="column" px="7%">
      <styled.div marginTop="64px" marginBottom="32px">
        <HStack gap="10px" marginBottom="32px">
          <CollectionIcon />
          <styled.p fontWeight={500} fontSize="1.5rem" lineHeight="1.8125rem" color="#3E3646" margin={0}>
            {t('common.collection')}
          </styled.p>
        </HStack>
        <styled.div width="306px">
          <CollectionTabs
            setCurrentView={tab => {
              handleTabChange(tab);
            }}
            currentView={currentTab}
          />
        </styled.div>
      </styled.div>
      <styled.section flex={1} pb={5} pt={1} overflow="hidden" position="relative">

        {currentTab === COLLECTION_TAB.CHATS ? (
          <HistoryList />
        ) : currentTab === COLLECTION_TAB.FLASHCARDS ? (
          <FlashcardList />
        ) : (
          <QuizList />
        )}
      </styled.section>
    </styled.section>
  );
};

export default Collection;
