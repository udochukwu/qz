/* eslint-disable @sayari/no-unwrapped-jsx-text */
import { css } from 'styled-system/css';
import { Center, HStack, styled } from 'styled-system/jsx';
import { HintIcon } from './hint-icon';
import { Button } from '@/components/elements/button';
import { EditIcon } from './edit-icon';
import { FavouriteIcon } from './favourite-icon';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '../../flashcard/types/flashcard';
import { AnimatePresence, motion } from 'framer-motion';
import ContentRenderer from './content-renderer-engine';
import { useEditFlashcard } from '../hooks/use-edit-flashcard';
import { useState, useEffect } from 'react';
import SourceButton from '@/features/quiz/components/SourceButton';

interface FlashcardCardProps {
  flashcard: Flashcard | undefined;
  onEdit: (card: Flashcard | undefined) => void;
  setIsFlipped: () => void;
  isFlipped: boolean;
  studyStatus?: React.ReactNode;
  memorized?: boolean;
  showHint: boolean;
  onHintClick: (e: React.MouseEvent) => void;
}

export const FlashcardCard = ({
  flashcard,
  onEdit,
  setIsFlipped,
  isFlipped,
  studyStatus,
  memorized,
  showHint,
  onHintClick,
}: FlashcardCardProps) => {
  const { t } = useTranslation();
  const { mutate } = useEditFlashcard();
  const [prevFlashcardId, setPrevFlashcardId] = useState<string | undefined>(flashcard?.flashcard_id);

  // Track when the flashcard changes to reset animation state
  useEffect(() => {
    if (flashcard?.flashcard_id !== prevFlashcardId) {
      setPrevFlashcardId(flashcard?.flashcard_id);
    }
  }, [flashcard?.flashcard_id, prevFlashcardId]);

  const toggleFavourite = async () => {
    flashcard &&
      (await mutate({
        setId: flashcard?.set_id,
        flashcardId: flashcard?.flashcard_id,
        data: { is_favorite: !flashcard?.is_favorite },
      }));
  };

  const handleCardClick = () => {
    setIsFlipped();
  };

  // Common styles for both card sides
  const cardSideStyles = css({
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    background: '#FFFFFF',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
  });

  // Common styles for content
  const contentStyles = css({
    textAlign: 'center',
    fontSize: '2.0625rem',
    lineHeight: '2.5rem',
    fontWeight: '500',
    color: '#3E3C46',
    padding: '0 20px',
  });

  // Common button row with edit and favorite buttons
  const ActionButtons = ({ marginTop = '22px' }: { marginTop?: string }) => (
    <HStack width="100%" justifyContent={isFlipped ? 'flex-end' : 'space-between'} marginTop={marginTop}>
      {!isFlipped && (
        <>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 14px',
              borderRadius: '11px',
              marginStart: '36px',
              backgroundColor: showHint ? '#F8F8F9' : 'transparent',
              border: '1px solid',
              borderColor: showHint ? '#15112B20' : 'transparent',
              userSelect: 'none',
              cursor: 'pointer',
              color: '#15112B80',
              _hover: {
                color: 'rgba(0,0,0,0.8)',
                backgroundColor: '#F8F8F9',
                borderColor: '#15112B20',
                opacity: !showHint ? '0.8' : '1',
              },
              transition: 'all 0.3s ease',
            })}
            onClick={onHintClick}>
            <div className={css({ width: '16px', height: '16px' })}>
              <HintIcon width={16} height={16} />
            </div>
            {!showHint ? (
              <span
                className={css({
                  fontSize: '16px',
                  lineHeight: '19.36px',
                })}>
                {t('flashcards.getAHint')}
              </span>
            ) : (
              <p
                className={css({
                  color: 'rgba(0,0,0,0.8)',
                  fontSize: '16px',
                  lineHeight: '19.36px',
                  margin: '0',
                  '& .message-renderer p': {
                    margin: '0',
                  },
                })}>
                <ContentRenderer className="message-renderer" content={flashcard?.hint || ''} />
              </p>
            )}
          </div>
        </>
      )}
      <HStack justifyContent="flex-end">
        <Button
          variant="ghost"
          padding="4px"
          onClick={e => {
            onEdit(flashcard);
            e.stopPropagation();
          }}>
          <EditIcon width={20} height={20} />
        </Button>
        <Button
          variant="ghost"
          padding="4px"
          marginRight="30px"
          onClick={e => {
            e.stopPropagation();
            toggleFavourite();
          }}>
          <FavouriteIcon isFavourite={flashcard?.is_favorite} />
        </Button>
      </HStack>
    </HStack>
  );

  return (
    <Center>
      <div
        className={css({
          width: '100%',
          height: '569px',
          marginTop: '25px',
          position: 'relative',
          perspective: '1500px',
        })}>
        {/* Study Status - Moved outside card animation */}
        <AnimatePresence>
          {studyStatus && (
            <motion.div
              key="status-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 15 }}
              className={css({
                position: 'absolute',
                bottom: '0',
                width: '100%',
                paddingTop: '12px',
                paddingBottom: '0px',
                backgroundColor: '#6D56FA',
                color: 'white',
                zIndex: '100',
                textAlign: 'center',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                transform: isFlipped ? 'rotateX(180deg)' : 'none',
                backfaceVisibility: 'hidden',
              })}>
              <div style={{ transform: isFlipped ? 'rotateX(180deg)' : 'none' }}>
                <p className={css({ fontSize: '1rem', fontWeight: '500', margin: 0, paddingBottom: '12px' })}>
                  {studyStatus}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={flashcard?.flashcard_id}
          className={css({
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            border: memorized ? '2px solid #00B389' : `1.16px solid #4141411F`,
            boxShadow: '0px 6px 12px 0px #A8A8A81F',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            position: 'absolute',
          })}
          onClick={() => !memorized && handleCardClick()}
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.6, type: 'spring', damping: 15 }}>
          <motion.div
            className={css({
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              borderRadius: '20px',
            })}
            initial={{ opacity: 0 }}
            animate={{ opacity: memorized ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <p
              className={css({
                fontSize: '48px',
                fontWeight: '500',
                lineHeight: '58px',
                color: '#00B389',
                margin: '0',
              })}>
              {t('flashcards.memorized')}
            </p>
          </motion.div>

          {/* Front Side (Question) */}
          <motion.div
            className={cardSideStyles}
            initial={{ opacity: 1 }}
            animate={{ opacity: isFlipped || memorized ? 0 : 1 }}>
            <ActionButtons />
            <Center flex="1">
              <div className={contentStyles}>
                <ContentRenderer className="message-renderer" content={flashcard?.question || ''} />
              </div>
            </Center>
          </motion.div>

          {/* Back Side (Answer) */}
          <motion.div
            className={`${cardSideStyles} ${css({ transform: 'rotateX(180deg)' })}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipped ? 1 : 0 }}>
            <ActionButtons />
            <Center flex="1">
              <div
                className={`${contentStyles} ${css({
                  maxHeight: '440px',
                  overflowY: 'auto',
                })}`}>
                <ContentRenderer className="message-renderer" content={flashcard?.answer || ''} />
              </div>
            </Center>
            {isFlipped && flashcard?.chunk_id && (
              <styled.div position={'absolute'} bottom={'6'} right={'9'}>
                <SourceButton chunkId={flashcard.chunk_id} />
              </styled.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Center>
  );
};
