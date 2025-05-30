'use client';
import React, { useState } from 'react';
import { HStack } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Button } from '@/components/elements/button';
import EditableFlashcard from '@/features/flashcard/components/editable-flashcard';
import { useApproveFlashcardSet } from '@/features/flashcard/hooks/use-approve-flashcard-set';
import { SpinningIcon } from '@/components/spinning-icon';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { IconButton } from '@/components/elements/icon-button';
import { AddIcon } from './components/add-icon';
import { useAddMoreFlashcards } from './hooks/use-add-more-flashcards';
import { Tooltip } from '@/components/elements/tooltip';
import { FlashcardSet } from './types/flashcard-set';
import { styled } from 'styled-system/jsx';
import HomeFlashcardViewHeader from './components/home-flashcard-view-header';
import { extractFileName } from '../files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { Flashcard } from './types/flashcard';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { useRouter } from 'next/navigation';

interface ReviewFlashCardsProps {
  onApprovalSuccess: () => void;
  flashcardSet: FlashcardSet;
  onFlashcardSetDeleteClicked: () => void;
  onFlashcardDeleteClicked: (card: Flashcard) => void;
}

const ReviewFlashCards = ({
  onApprovalSuccess,
  flashcardSet,
  onFlashcardSetDeleteClicked,
  onFlashcardDeleteClicked,
}: ReviewFlashCardsProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: approveFlashcardSet, isLoading: isApproving } = useApproveFlashcardSet();
  const { mutate: addMoreFlashcards, isLoading: isAddingFlashCards } = useAddMoreFlashcards();

  const [filename, setFilename] = useState<string>(flashcardSet.file_names?.[0]!!);

  const handleAproval = () => {
    approveFlashcardSet(
      { setId: flashcardSet?.set_id },
      {
        onSuccess: () => {
          onApprovalSuccess();
        },
      },
    );
  };

  const handleAddMore = () => {
    addMoreFlashcards({ number_of_flashcards: 5, setId: flashcardSet?.set_id });
    mixpanel.track(EventName.FlashcardAddMoreClicked, {
      already_approved: false,
    });
  };
  const handleCancel = () => {
    //Go back to the previous screen
    router.push('/');
  };

  const renameChat = (new_file_name: string, onSuccess?: VoidFunction) => {
    //imlementation to come
  };

  return (
    <styled.div height={'100vh'} style={{ overflow: 'scroll', backgroundColor: '#f5f5f5' }}>
      <div className={css({ display: 'flex', justifyContent: 'center', paddingX: '4%' })}>
        <div
          className={css({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            maxWidth: '770px',
            marginX: 'auto',
          })}>
          <styled.p
            marginTop="38px"
            mb={3}
            fontSize="3xl"
            textAlign="left"
            fontWeight="semibold"
            color="black"
            margin="0"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth="80%">
            {t('flashcards.review.seeFlashcardsFrom', { flashCardSource: flashcardSet?.file_names?.[0] })}
          </styled.p>
          <HStack justifyContent="space-between" marginBottom="46px" gap={0}>
            <styled.p my={0} fontSize={'md'} fontWeight={'medium'}>
              {t('flashcards.review.flashcardsToReview', { count: flashcardSet.flashcards.length })}
            </styled.p>
            <IconButton
              background="rgba(109, 86, 250, 0.1)"
              h={'fit-content'}
              px={4}
              py={2}
              borderRadius="8px"
              color="rgba(109, 86, 250, 1)"
              disabled={isAddingFlashCards}
              _disabled={{ opacity: 0.5, cursor: 'wait' }}
              transition="opacity 0.2s ease-in-out"
              _hover={{ bgColor: '#6D56FA1F', borderColor: '#6D56FA29', color: '#6D56FA' }}
              onClick={() => handleAddMore()}>
              <>
                <AddIcon />
                {t('flashcards.review.addMore')}
              </>
            </IconButton>
          </HStack>
          <div className={css({ width: '100%' })}>
            <AnimatePresence>
              {flashcardSet.flashcards.map((card, cardIndex) => (
                <motion.div
                  key={card.flashcard_id}
                  layoutId={card.flashcard_id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.5 }}>
                  <EditableFlashcard
                    card={card}
                    onDeleteClicked={() => {
                      onFlashcardDeleteClicked(card);
                      mixpanel.track(EventName.FlashcardDeleted, { review_screen: true });
                    }}
                    cardIndex={cardIndex}
                    page="review"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            style={{
              position: 'sticky',
              bottom: '0',
              background: 'linear-gradient(180deg, rgba(248, 248, 249, 0) 0%, #F8F8F9 62.24%)',
              display: 'flex',
              justifyContent: 'center',
              height: '156px',
              width: '100%',
            }}>
            <HStack width="100%" justifyContent="flex-end" marginTop="70px" gap="12px">
              <Button
                className={css({
                  gap: '10px',
                  h: 'fit-content',
                  w: 'fit-content',
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 0, 0, 0.15)',
                  color: 'rgba(255, 0, 0, 1)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  lineHeight: '1.5rem',
                  transition: 'opacity 0.2s ease-in-out',
                  _hover: {
                    opacity: 0.8,
                  },
                })}
                onClick={() => onFlashcardSetDeleteClicked()}>
                {t('common.delete')}
              </Button>
              <Button
                disabled={isApproving}
                className={css({
                  gap: '10px',
                  height: 'fit-content',
                  py: 1.5,
                  shadow: 'sm',
                  width: 'fit-content',
                  borderRadius: '12px',
                  background: '#6D56FA',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  lineHeight: '1.5rem',
                  transition: 'opacity 0.2s ease-in-out',
                  _hover: {
                    opacity: 0.9,
                  },
                  _disabled: {
                    opacity: 0.5,
                    cursor: 'wait',
                  },
                })}
                onClick={() => handleAproval()}>
                {t('flashcards.review.approveAll')}
              </Button>
            </HStack>
          </div>
        </div>
      </div>
    </styled.div>
  );
};

export default ReviewFlashCards;
