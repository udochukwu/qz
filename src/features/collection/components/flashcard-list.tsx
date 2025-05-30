import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';
import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { FlashcardGridSection } from './flashcard-grid-section';
import { css } from 'styled-system/css';
import { useGetRecentFlashcardSets } from '@/features/flashcard/hooks/use-get-recent-flashcard-sets';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { LoadingSkeleton } from './loading-skeleton';
import { EmptyFlashcards } from './empty-flashcards';
import { groupByDateDescending } from '../utils/flashcard-utils';

export const FlashcardList = () => {
  const { t } = useTranslation();
  const { data, isLoading: isFlashcardHistoryLoading, isError, refetch } = useGetRecentFlashcardSets();

  const renderFlashcardSections = (sets: Record<string, FlashcardSets[]>) => {
    return Object.entries(sets).map(([group, items], index) => (
      <div
        className={css({
          marginTop: index !== 0 ? '56px' : '0px',
        })}
        key={group}>
        <FlashcardGridSection key={group} title={group} sets={items} />
      </div>
    ));
  };

  if (isError) {
    return <ErrorRetry error={t('collection.flashcards.list.error')} retry={refetch} />;
  }

  const flashcardSets = data?.flashcard_sets;
  const groupedSets = groupByDateDescending(flashcardSets, t);

  const noFlashCards = !flashcardSets || flashcardSets.length === 0;

  if (isFlashcardHistoryLoading) {
    return <LoadingSkeleton />;
  }

  if (noFlashCards) {
    return <EmptyFlashcards />;
  }

  return (
    <styled.div
      css={{
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        paddingBottom: '36px',
      }}>
      <styled.div
        css={{
          height: '100%',
          overflowY: 'auto',
          paddingRight: '16px',
        }}>
        {renderFlashcardSections(groupedSets)}
      </styled.div>
    </styled.div>
  );
};
