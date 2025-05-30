'use client';

import { ShevronLeftIcon } from '@/features/flashcard/components/shevron-left-icon';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import { ShareIcon } from '@/features/flashcard/components/share-icon';
import { Switch } from '@/components/elements/switch';
import { ShevronRightIcon } from '@/features/flashcard/components/shevron-right-icon';
import { ShuffleIcon } from '@/features/flashcard/components/shuffle-icon';
import { ExpandIcon } from '@/features/flashcard/components/expand-icon';
import { CustomTabs } from '@/features/flashcard/components/custom-tabs';
import { FlashcardCard } from '@/features/flashcard/components/flashcard-card';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from '@/components/modal/modal';
import { useDeleteFlashcardSet } from '@/features/flashcard/hooks/use-delete-flashcard-set';
import EditModal from '@/features/flashcard/components/edit-modal';
import { Flashcard, FlashCardProgressStatus } from '@/features/flashcard/types/flashcard';
import { useEditFlashcard } from '@/features/flashcard/hooks/use-edit-flashcard';
import { useRouter } from 'next13-progressbar';
import HomeFlashcardViewHeader from '@/features/flashcard/components/home-flashcard-view-header';
import { useGetFlashcardSet } from '@/features/flashcard/hooks/use-get-flashcard-set';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { Skeleton } from '@/components/elements/skeleton';
import ReviewFlashCards from '@/features/flashcard/review-flashcards';
import DeleteConfirmationModal from '@/features/flashcard/components/delete-confirmation-modal';
import { useDeleteFlashcard } from '@/features/flashcard/hooks/use-delete-flashcard';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { XIcon } from '@/features/flashcard/components/x-icon';
import { CheckIcon } from '@/features/flashcard/components/check-icon';
import ProgressTrackingResult from '@/features/flashcard/progress-tracking-result';
import { useEditFlashcardSet } from '@/features/flashcard/hooks/use-edit-flashcard-set';
import { useRestartFlashcardSet } from '@/features/flashcard/hooks/use-restart-flashcard-set';
import { useBoolean } from '@/hooks/use-boolean';
import { ShareFlashcardModal } from '@/features/flashcard/components/share-flashcard-modal';
interface Props {
  params: { set_id: string };
}

const MotionNumberFlow = motion(NumberFlow);

const Flashcards = (props: Props) => {
  const { t } = useTranslation();
  const set_id = props.params.set_id;

  const { data: flashcardSet, isLoading: isFlashcardLoading, isError, refetch } = useGetFlashcardSet(set_id);

  const router = useRouter();
  const [cardIndex, setCardIndex] = useState(0);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const { mutate: deleteFlashcardSet, isLoading: isDeletingFlashcardSet } = useDeleteFlashcardSet();
  const { mutate: deleteFlashcard, isLoading: isDeletingFlashcard } = useDeleteFlashcard();
  const [isFlashcardDeleteModalOpen, setIsFlashcardDeleteModalOpen] = useState(false);
  const [isFlashcardSetDeleteModalOpen, setIsFlashcardSetDeleteModalOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<Flashcard | null>(null);
  const { mutate: editFlashcard } = useEditFlashcard();
  const { mutate: editFlashcardSet } = useEditFlashcardSet();
  const { mutate: restartFlashcardSet } = useRestartFlashcardSet();
  const [isEdititingCard, setIsEditingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [studyStatus, setStudyStatus] = useState<React.ReactNode | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'all' | 'starred'>('all');
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [keybindsShown, setKeybindsShown] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusIdRef = useRef<number>(0);
  const flashcardContainerRef = useRef<HTMLDivElement>(null);
  const [memorized, setIsMemorized] = useState(false);
  const isShareModalOpen = useBoolean();

  useEffect(() => {
    mixpanel.track(EventName.FlashcardPageViewed, {
      path: window.location.pathname,
    });
  }, []);

  const showStudyStatus = useCallback((message: React.ReactNode) => {
    // Clear any existing timeout
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }

    // Generate a new status ID
    const currentStatusId = ++statusIdRef.current;

    // Set the new status
    setStudyStatus(message);

    // Set a new timeout
    statusTimeoutRef.current = setTimeout(() => {
      // Only clear the status if it's still the current one
      if (currentStatusId === statusIdRef.current) {
        setStudyStatus(undefined);
        statusTimeoutRef.current = null;
      }
    }, 5000);
  }, []);

  const clearStudyStatus = useCallback(() => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
    // Increment the status ID to invalidate any pending timeouts
    statusIdRef.current++;
    setStudyStatus(undefined);
  }, []);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (flashcardSet?.flashcards) {
      setCards([...flashcardSet.flashcards]);
      setFilteredCards([...flashcardSet.flashcards]);

      // Only show keybinds if we haven't shown them yet
      if (!keybindsShown) {
        showStudyStatus(
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <span>Use</span> <kbd style={{ padding: '2px 6px', background: '#FFFFFF33', borderRadius: '4px' }}>←</kbd>
            <kbd style={{ padding: '2px 6px', background: '#FFFFFF33', borderRadius: '4px' }}>→</kbd>{' '}
            <span>to navigate,</span>
            <kbd style={{ padding: '2px 6px', background: '#FFFFFF33', borderRadius: '4px' }}>space</kbd>{' '}
            <span>to flip</span>
          </span>,
        );
        setKeybindsShown(true);
      }

      // Focus the container when flashcard set is loaded
      setTimeout(() => {
        if (flashcardContainerRef.current) {
          flashcardContainerRef.current.focus({ preventScroll: true });
        }
      }, 100);
    }
  }, [flashcardSet?.flashcards, showStudyStatus, keybindsShown]);

  // Filter cards when tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredCards([...cards]);
    } else {
      const starredCards = cards.filter(card => card.is_favorite);
      setFilteredCards(starredCards);
      setCardIndex(0);
    }
  }, [activeTab, cards]);

  const shuffleCards = () => {
    setIsFlipped(false);
    setCardIndex(0);
    if (!isShuffleMode) {
      // Only shuffle when turning shuffle mode on
      const shuffled = [...filteredCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFilteredCards(shuffled);
      showStudyStatus(<span style={{ color: 'white' }}>Card shuffle is ON</span>);
    } else {
      // Reset to original order based on active tab
      if (activeTab === 'all') {
        setFilteredCards([...(flashcardSet?.flashcards || [])]);
      } else {
        setFilteredCards([...(flashcardSet?.flashcards || []).filter(card => card.is_favorite)]);
      }
      showStudyStatus(<span style={{ color: 'white' }}>Card shuffle is OFF</span>);
    }
    resetFlashcards();
    setIsShuffleMode(!isShuffleMode);
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent shortcuts when a modal is open or when typing in an input/textarea
      if (
        isFlashcardDeleteModalOpen ||
        isFlashcardSetDeleteModalOpen ||
        isEdititingCard ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Only process if we have flashcards
      if (!filteredCards?.length) {
        return;
      }

      const totalCards = filteredCards.length;

      switch (event.key) {
        case 'ArrowLeft':
          // Go to previous card with looping behavior
          setIsFlipped(false);
          clearStudyStatus();
          if (cardIndex > 0) {
            setCardIndex(cardIndex - 1);
          } else {
            // Loop to the last card if at the first card
            setCardIndex(totalCards - 1);
          }
          break;
        case 'ArrowRight':
          // Go to next card with looping behavior
          setIsFlipped(false);
          clearStudyStatus();
          if (cardIndex < totalCards - 1) {
            setCardIndex(cardIndex + 1);
          } else {
            // Loop to the first card if at the last card
            setCardIndex(0);
          }
          break;
        case ' ': // Space bar
          // Flip the current card
          event.preventDefault(); // Prevent page scrolling
          clearStudyStatus();
          setIsFlipped(!isFlipped);
          break;
      }
    },
    [
      cardIndex,
      isFlipped,
      filteredCards,
      isFlashcardDeleteModalOpen,
      isFlashcardSetDeleteModalOpen,
      isEdititingCard,
      clearStudyStatus,
    ],
  );

  // Add and remove keyboard event listener
  useEffect(() => {
    // Only add the event listener to the flashcard container element
    const currentContainer = flashcardContainerRef.current;

    if (currentContainer) {
      currentContainer.addEventListener('keydown', handleKeyDown);

      // Focus the container when it's available and we have cards to display
      if (filteredCards.length > 0) {
        // Use preventScroll option to avoid unwanted scrolling
        currentContainer.focus({ preventScroll: true });
      }
    }

    // Cleanup function to remove event listener
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleKeyDown, filteredCards]);

  const handleHintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowHint(!showHint);
    // Maintain focus on the container
    if (flashcardContainerRef.current) {
      flashcardContainerRef.current.focus({ preventScroll: true });
    }
  };

  // Reset hint when card changes
  useEffect(() => {
    setShowHint(false);
  }, [cardIndex]);

  if (isError) {
    return <ErrorRetry error={t('flashcards.error')} retry={refetch} />;
  }

  const onEdit = (flashcard: Flashcard | undefined) => {
    setEditingCard(flashcard);
    setIsEditingCard(true);
  };

  const onDeleteClicked = (card: Flashcard) => {
    setFlashcardToDelete(card);
    setIsFlashcardDeleteModalOpen(true);
  };

  const handleDeleteFlashcard = async () => {
    mixpanel.track(EventName.FlashcardDeleted);
    flashcardToDelete &&
      deleteFlashcard(
        { setId: flashcardToDelete?.set_id, flashcardId: flashcardToDelete?.flashcard_id },
        {
          onSuccess() {
            setIsFlashcardDeleteModalOpen(false);
          },
        },
      );
  };

  const handleDeleteFlashcardSet = async () => {
    flashcardSet &&
      deleteFlashcardSet(
        { setId: flashcardSet?.set_id },
        {
          onSuccess() {
            setIsFlashcardSetDeleteModalOpen(false);
            router.push('/');
          },
        },
      );
  };

  const handleSaveEditedCard = async (question: string, answer: string) => {
    editingCard &&
      (await editFlashcard(
        { setId: editingCard?.set_id, flashcardId: editingCard?.flashcard_id, data: { question, answer } },
        {
          onSuccess: () => {
            setIsEditingCard(false);
          },
        },
      ));
  };

  const updateProgressStatus = (cardIndex: number, status: FlashCardProgressStatus) => {
    const cardToEdit = filteredCards?.[cardIndex];
    editFlashcard({
      setId: cardToEdit?.set_id,
      flashcardId: cardToEdit?.flashcard_id,
      data: { progress_status: status },
    });
  };

  const resetFlashcards = () => {
    setCardIndex(0);
    flashcardSet && restartFlashcardSet({ setId: flashcardSet?.set_id });
  };

  const isTrackingProgressCompleted = flashcardSet?.tracking_progress && cardIndex >= filteredCards?.length;
  const learningCardsCount = filteredCards?.filter(f => f.progress_status === 'learning').length || 0;
  const memorizedCardsCount = filteredCards?.filter(f => f.progress_status === 'memorized').length || 0;
  const flashcardDeleteModal = (
    <Modal
      isOpen={isFlashcardDeleteModalOpen}
      onOpenChange={e => setIsFlashcardDeleteModalOpen(e)}
      width="300px"
      backgroundColor="#1818181F"
      backdropFilter="blur(12px)">
      <DeleteConfirmationModal
        isLoading={isDeletingFlashcard}
        onDelete={handleDeleteFlashcard}
        onCancel={() => setIsFlashcardDeleteModalOpen(false)}
        title={t('flashcards.review.deleteCards')}
        subTitle={t('flashcards.review.areYouSure', { confirmAction: t('flashcards.review.deleteThisFlashcard') })}
      />
    </Modal>
  );

  const flashcardSetDeleteModal = (
    <Modal
      isOpen={isFlashcardSetDeleteModalOpen}
      onOpenChange={e => setIsFlashcardSetDeleteModalOpen(e)}
      width="300px"
      backgroundColor="#1818181F"
      backdropFilter="blur(12px)">
      <DeleteConfirmationModal
        isLoading={isDeletingFlashcardSet}
        onDelete={handleDeleteFlashcardSet}
        onCancel={() => setIsFlashcardSetDeleteModalOpen(false)}
        title={t('flashcards.review.deleteFlashcardSetTitle')}
        subTitle={t('flashcards.review.deleteFlashcardSetSubTitle', {
          confirmAction: t('flashcards.review.deleteThisFlashcard'),
        })}
      />
    </Modal>
  );

  const editModal = (
    <Modal
      isOpen={isEdititingCard}
      onOpenChange={e => setIsEditingCard(e)}
      width="300px"
      backgroundColor="#1818181F"
      backdropFilter="blur(12px)">
      <EditModal
        cardQuestion={editingCard?.question || ''}
        cardAnswer={editingCard?.answer || ''}
        onPositiveActionClicked={handleSaveEditedCard}
        onCancel={() => setIsEditingCard(false)}
      />
    </Modal>
  );

  const LoadingSkeleton = () => (
    <VStack w="100%" h={'100%'} gap={6} marginTop="51px" paddingX="7%">
      <Skeleton w="100%" h="43px"></Skeleton>

      <Skeleton w="100%" h="600px"></Skeleton>
    </VStack>
  );

  if (flashcardSet && !flashcardSet.is_approved) {
    return (
      <>
        {isFlashcardDeleteModalOpen && flashcardDeleteModal}
        {isFlashcardSetDeleteModalOpen && flashcardSetDeleteModal}
        <ReviewFlashCards
          flashcardSet={flashcardSet}
          onApprovalSuccess={() => {
            // Refetch the flashcard set to get the updated is_approved status
            refetch().then(() => {
              // Reset state for the main view
              setCardIndex(0);
              setIsFlipped(false);
              setKeybindsShown(false); // This will trigger the keybinds hint to show again

              // Focus the container after a short delay to ensure DOM is updated
              setTimeout(() => {
                if (flashcardContainerRef.current) {
                  flashcardContainerRef.current.focus({ preventScroll: true });
                }
              }, 100);
            });
          }}
          onFlashcardSetDeleteClicked={() => setIsFlashcardSetDeleteModalOpen(true)}
          onFlashcardDeleteClicked={card => {
            onDeleteClicked(card);
          }}
        />
      </>
    );
  }
  return (
    <div className={css({ overflow: 'scroll', mb: '-200px' })}>
      {isFlashcardLoading ? (
        <LoadingSkeleton />
      ) : (
        <div
          className={css({
            height: '100vh',
            width: '100%',
            backgroundColor: '#F8F8F8',
            outline: 'none',
            maxWidth: '5xl',
            margin: '0 auto',
            paddingTop: '12px',
          })}>
          {isFlashcardDeleteModalOpen && flashcardDeleteModal}
          {isFlashcardSetDeleteModalOpen && flashcardSetDeleteModal}
          {isEdititingCard && editModal}
          {flashcardSet && (
            <ShareFlashcardModal
              flashcard_set_id={flashcardSet?.set_id}
              setIsOpen={isShareModalOpen.setValue}
              isOpen={isShareModalOpen.value}
            />
          )}
          <HomeFlashcardViewHeader
            classTitleParams={flashcardSet?.file_names?.[0] && extractFileName(flashcardSet?.file_names[0])}
            showChatTitle={false}
            showSubTitle={false}
            fileType={
              flashcardSet?.file_types?.[0] ||
              (flashcardSet?.file_names?.[0] && getFileExtension(flashcardSet?.file_names[0])) ||
              'PDF'
            }
            onDeleteClick={() => setIsFlashcardSetDeleteModalOpen(true)}
            onShareClick={() => isShareModalOpen.setTrue()}
          />

          {isTrackingProgressCompleted ? (
            <VStack>
              <ProgressTrackingResult flashcards={filteredCards} resetFlashcardSet={resetFlashcards} />
            </VStack>
          ) : (
            <div
              ref={flashcardContainerRef}
              tabIndex={0} // Make the container focusable
              className={css({
                paddingX: '5%',
                outline: 'none', // Remove focus outline
              })}>
              <HStack justifyContent="start" padding="0px">
                <Button
                  fontSize="1rem"
                  fontWeight="400"
                  lineHeight="1.21rem"
                  textAlign="left"
                  color="#3E3C46"
                  borderRadius="12px"
                  border="1.32px solid #4141411F"
                  padding="8px 20px"
                  background="#FFFFFF"
                  display="none">
                  {t('flashcards.share')}
                  <ShareIcon />
                </Button>
              </HStack>

              {flashcardSet?.tracking_progress && (
                <HStack justifyContent="space-between" marginTop="22px" padding="0px" alignItems="center">
                  <div className={css({ display: 'flex', gap: '12px' })}>
                    <div
                      className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '40px',
                        width: '40px',
                        border: '1px solid #FF6258',
                        borderRadius: '10px',
                        background: '#FF62581A',
                        color: '#FF6258',
                      })}>
                      {learningCardsCount || 0}
                    </div>
                    <p
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5rem',
                        color: '#FF6258',
                        margin: '0px',
                      })}>
                      {t('flashcards.stillLearning')}
                    </p>
                  </div>
                  <div
                    className={css({
                      display: 'flex',
                      gap: '12px',
                    })}>
                    <p
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5rem',
                        color: '#00B389',
                        margin: '0px',
                      })}>
                      {t('flashcards.memorized')}
                    </p>
                    <div
                      className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '40px',
                        width: '40px',
                        border: '1px solid #00B389',
                        borderRadius: '10px',
                        background: '#00B3891A',
                        color: '#00B389',
                      })}>
                      {memorizedCardsCount || 0}
                    </div>
                  </div>
                </HStack>
              )}

              <FlashcardCard
                flashcard={filteredCards[cardIndex]}
                onEdit={onEdit}
                isFlipped={isFlipped}
                setIsFlipped={() => {
                  clearStudyStatus();
                  setIsFlipped(!isFlipped);
                }}
                studyStatus={studyStatus}
                memorized={memorized}
                showHint={showHint}
                onHintClick={handleHintClick}
              />

              <HStack justifyContent="space-between" marginTop="10px" padding="0px">
                <HStack w="200px">
                  <p
                    className={css({
                      fontWeight: '500',
                      fontSize: '1rem',
                      lineHeight: '1.5rem',
                      color: '#868492',
                      margin: '0px',
                    })}>
                    {t('flashcards.trackProgress')}
                  </p>

                  <Switch
                    checked={flashcardSet?.tracking_progress}
                    onChange={() => {
                      flashcardSet &&
                        editFlashcardSet({
                          setId: flashcardSet?.set_id,
                          data: { tracking_progress: !flashcardSet?.tracking_progress },
                        });
                    }}
                  />
                </HStack>

                <HStack marginTop="12px" gap={4} alignItems="center">
                  {flashcardSet?.tracking_progress ? (
                    <Button
                      disabled={memorized || cardIndex + 1 > (filteredCards?.length ?? 0)}
                      background="#FFFFFF"
                      border="1px solid #4141411F"
                      borderRadius="full"
                      height="40px"
                      width="40px"
                      padding="0px"
                      onClick={() => {
                        updateProgressStatus(cardIndex, 'learning');
                        setIsFlipped(false);
                        clearStudyStatus();
                        setCardIndex(cardIndex + 1);
                      }}>
                      <XIcon height="14px" width="14px" />
                    </Button>
                  ) : (
                    <Button
                      background="#FFFFFF"
                      border="1px solid #4141411F"
                      borderRadius="full"
                      padding="12px"
                      width="40px"
                      height="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      outline="none"
                      onClick={() => {
                        setIsFlipped(false);
                        clearStudyStatus();
                        if (cardIndex > 0) {
                          setCardIndex(cardIndex - 1);
                        } else if (filteredCards?.length) {
                          setCardIndex(filteredCards.length - 1);
                        }
                      }}>
                      <ShevronLeftIcon width="9" height="180" />
                    </Button>
                  )}
                  <motion.div
                    layout="position"
                    transition={{
                      duration: 0.4,
                      ease: 'easeOut',
                      layout: {
                        duration: 0.3,
                      },
                    }}
                    className={css({
                      color: '#15112B80',
                      fontSize: '1.2rem',
                      fontWeight: '500',
                      lineHeight: '1.8125rem',
                      fontVariantNumeric: 'tabular-nums',
                      textAlign: 'center',
                      minWidth: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    })}>
                    <MotionNumberFlow layout="position" value={cardIndex + 1} />
                    <motion.span layout="position">/</motion.span>
                    <MotionNumberFlow layout="position" value={filteredCards.length} />
                  </motion.div>
                  {flashcardSet?.tracking_progress ? (
                    <Button
                      disabled={memorized || cardIndex + 1 > filteredCards.length}
                      background="#FFFFFF"
                      border="1px solid #4141411F"
                      borderRadius="full"
                      height="40px"
                      width="40px"
                      padding="0px"
                      onClick={() => {
                        setIsMemorized(true);
                        updateProgressStatus(cardIndex, 'memorized');
                        setIsFlipped(false);
                        clearStudyStatus();
                        setTimeout(() => {
                          setIsMemorized(false);
                          setCardIndex(prevIndex => prevIndex + 1);
                        }, 700);
                      }}>
                      <CheckIcon height="20px" width="20px" />
                    </Button>
                  ) : (
                    <Button
                      background="#FFFFFF"
                      border="1px solid #4141411F"
                      borderRadius="full"
                      padding="12px"
                      width="40px"
                      height="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      outline="none"
                      onClick={() => {
                        setIsFlipped(false);
                        clearStudyStatus();
                        if (filteredCards?.length && cardIndex < filteredCards.length - 1) {
                          setCardIndex(cardIndex + 1);
                        } else {
                          setCardIndex(0);
                        }
                      }}>
                      <ShevronRightIcon />
                    </Button>
                  )}
                </HStack>

                <HStack gap="25px" w="200px" justifyContent="end">
                  <Button
                    background="#FFFFFF"
                    border={isShuffleMode ? '1px solid #6D56FA' : '1px solid #4141411F'}
                    borderRadius="full"
                    padding="12px"
                    width="40px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={shuffleCards}>
                    <ShuffleIcon stroke={isShuffleMode ? '#6D56FA' : undefined} />
                  </Button>
                  <HStack display="none">
                    <ExpandIcon />
                  </HStack>
                </HStack>
              </HStack>

              <div
                className={css({
                  marginTop: '24px',
                  width: '100%',
                  height: '1px',
                  backgroundColor: '#0000001A',
                  position: 'relative',
                })}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: filteredCards.length > 0 ? `${((cardIndex + 1) / filteredCards.length) * 100}%` : '0%',
                  }}
                  transition={{
                    duration: 0.4,
                    type: 'spring',
                    bounce: 0,
                  }}
                  className={css({
                    position: 'absolute',
                    height: '100%',
                    backgroundColor: '#6D56FA',
                    left: 0,
                    top: 0,
                    borderRadius: '1px',
                  })}
                />
              </div>

              <div
                className={css({
                  marginTop: '40px',
                  marginBottom: '40px',
                })}>
                <CustomTabs
                  flashcards={flashcardSet?.flashcards || []}
                  onDeleteClicked={card => {
                    onDeleteClicked(card);
                  }}
                  onTabChange={(tab: string) => {
                    const newTab = tab as 'all' | 'starred';

                    // Only show status message when tab actually changes
                    if (newTab !== activeTab) {
                      // Show appropriate status message based on the new tab
                      if (newTab === 'all') {
                        const allCards = flashcardSet?.flashcards || [];
                        if (allCards.length > 0) {
                          showStudyStatus(`Showing all ${allCards.length} cards`);
                        }
                      } else {
                        const starredCards = (flashcardSet?.flashcards || []).filter(card => card.is_favorite);
                        if (starredCards.length > 0) {
                          showStudyStatus(`Showing ${starredCards.length} starred cards`);
                        } else {
                          showStudyStatus('No starred cards found');
                        }
                      }
                    }

                    setActiveTab(newTab);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
