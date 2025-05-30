'use client';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { ThrashIcon } from '@/features/flashcard/components/thrash-icon';
import { EditIcon } from '@/features/flashcard/components/edit-icon';
import { Button } from '@/components/elements/button';
import { Textarea } from '@/components/elements/textarea';
import { SpinningIcon } from '@/components/spinning-icon';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '../../flashcard/types/flashcard';
import { FavouriteIcon } from './favourite-icon';
import { SpeakIcon } from './speak-icon';
import { useEditFlashcard } from '../hooks/use-edit-flashcard';
import TextareaComponent from './textarea-component';
import { RefreshIcon } from './refresh-icon';
import { EditingIcon } from './editing-icon';
import ContentRenderer from './content-renderer-engine';
import { useReplaceFlashcards } from '../hooks/use-replace-flashcards';
import { TooltipWrappper } from '@/components/tooltip-wrapper';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import SourceButton from '@/features/quiz/components/SourceButton';

interface EditableFlashcardProps {
  card: Flashcard;
  onDeleteClicked: (card: Flashcard) => void;
  page?: 'review' | 'flashcard';
  cardIndex: number;
}

const EditableFlashcard = ({ card, onDeleteClicked, page, cardIndex }: EditableFlashcardProps) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isLoading: isUpdating } = useEditFlashcard();
  const { mutate: replaceFlashcards, isLoading: isReplacing } = useReplaceFlashcards();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [answer, isEditing]);

  const hanldeEditCard = () => {
    card && mutate({ setId: card?.set_id, flashcardId: card?.flashcard_id, data: { question, answer } });
    setIsEditing(false);
  };

  const hanldeReplaceCard = () => {
    mixpanel.track(EventName.FlashcardReplaced);
    replaceFlashcards({ setId: card?.set_id, flashcard_id: card?.flashcard_id, cardIndex });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setQuestion(card.question);
    setAnswer(card.answer);
  };

  const toggleFavourite = () => {
    if (card?.is_favorite) {
      mixpanel.track(EventName.FlashcardUnstarred);
    } else {
      mixpanel.track(EventName.FlashcardStarred);
    }
    mutate({ setId: card?.set_id, flashcardId: card?.flashcard_id, data: { is_favorite: !card?.is_favorite } });
  };

  useEffect(() => {
    setAnswer(card.answer);
    setQuestion(card.question);
  }, [card]);

  return (
    <styled.div
      w="100%"
      display="flex"
      flexDir="column"
      shadow={'sm'}
      borderRadius="12px"
      bg="white"
      border="1px solid #41414114"
      opacity="1"
      h="auto"
      mb="16px">
      <styled.div
        px="20px"
        pt="10px"
        borderBottomWidth={1}
        borderColor="rgba(0, 0, 0, 0.2)"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb="10px"
        w="100%">
        <styled.div fontSize="1rem" fontWeight="500" color="#3E3C46">
          {cardIndex + 1}
        </styled.div>
        <styled.div display="flex" gap="12px" mb="-5px" alignItems="center" justifyContent="end">
          <TooltipWrappper
            trigger={
              <styled.button h="16px" w="16px" cursor="pointer" onClick={() => setIsEditing(true)}>
                <EditIcon height={16} width={16} />
              </styled.button>
            }
            content="Edit flashcard"
          />

          {page === 'review' && (
            <TooltipWrappper
              content={'Replace'}
              trigger={
                <styled.button h="16px" w="16px" cursor="pointer" disabled={isReplacing} onClick={hanldeReplaceCard}>
                  {isReplacing ? <SpinningIcon height={16} width={16} color="#15112B" /> : <RefreshIcon />}
                </styled.button>
              }
            />
          )}

          {page === 'flashcard' && (
            <TooltipWrappper
              trigger={
                <styled.button cursor="pointer" onClick={toggleFavourite}>
                  <FavouriteIcon height={16} width={16} isFavourite={card.is_favorite} />
                </styled.button>
              }
              content="Add to favourite"
            />
          )}

          <TooltipWrappper
            trigger={
              <styled.button cursor="pointer" onClick={() => onDeleteClicked(card)}>
                <ThrashIcon height={16} width={16} />
              </styled.button>
            }
            content="Delete flashcard"
          />
        </styled.div>
      </styled.div>

      <styled.div display="flex" flexDir="row" w="100%" gap="0px" px="20px">
        <styled.div
          display="flex"
          pr="20px"
          pt="16px"
          justifyContent="space-between"
          h="full"
          alignItems="flex-start"
          pb="100px"
          w="100%">
          {isEditing ? (
            <Textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              fontSize="1rem"
              fontWeight="400"
              lineHeight="1.21rem"
              textAlign="left"
              color="#3E3C46"
              w="100%"
              overflow="hidden"
              resize="none"
              whiteSpace="pre-wrap"
              border="none"
              p={0}
              _focus={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
              }}
            />
          ) : (
            <styled.div fontSize="1rem" fontWeight="400" lineHeight="1.21rem" textAlign="left" color="#3E3C46">
              <ContentRenderer className="message-renderer" content={question} />
            </styled.div>
          )}
        </styled.div>

        <styled.div borderLeftWidth={1} pt="16px" pl="20px" borderColor="rgba(0, 0, 0, 0.2)" w="100%" overflowX="auto">
          {isEditing ? (
            <>
              <TextareaComponent
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                isEditing={isEditing}
                customStyles={{
                  border: '1px solid #41414126',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              />
              <styled.div pb={5} display="flex" justifyContent="space-between" w="100%">
                <Button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  bg="#15112B0D"
                  color="#3E3C46"
                  p="8px 35px"
                  borderRadius="12px"
                  fontSize="0.875rem"
                  fontWeight="500"
                  lineHeight="1.5rem">
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={hanldeEditCard}
                  disabled={isUpdating}
                  bg="#6D56FA"
                  color="white"
                  p="8px 35px"
                  borderRadius="12px"
                  fontSize="0.875rem"
                  fontWeight="500"
                  lineHeight="1.5rem">
                  {isUpdating ? <SpinningIcon /> : t('common.done')}
                </Button>
              </styled.div>
            </>
          ) : (
            <styled.div display="flex" flexDir="column" h="full" pb="16px" justifyContent="space-between">
              <styled.div mb="-1em">
                <ContentRenderer className="message-renderer" content={answer} />
              </styled.div>
              {card.chunk_id && (
                <styled.div display="flex" justifyContent="end">
                  <styled.div pt={2}>
                    <SourceButton chunkId={card.chunk_id} />
                  </styled.div>
                </styled.div>
              )}
            </styled.div>
          )}
        </styled.div>
      </styled.div>
    </styled.div>
  );
};

export default EditableFlashcard;
