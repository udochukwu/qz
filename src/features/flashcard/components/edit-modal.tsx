'use client';
import { HStack, VStack } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Button } from '@/components/elements/button';
import { SpinningIcon } from '@/components/spinning-icon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/elements/textarea';
import { EditPencilIcon } from './edit-pencil-icon';
import TextareaComponent from './textarea-component';

interface EditModalProps {
  cardQuestion: string;
  cardAnswer: string;
  onPositiveActionClicked: (question: string, answer: string) => void;
  onCancel: () => void;
}

const EditModal = ({ cardQuestion, cardAnswer, onPositiveActionClicked: onSave, onCancel }: EditModalProps) => {
  const { t } = useTranslation();

  const [isConfirmedPositive, setIsConfirmedPositive] = useState(false);
  const [question, setQuestion] = useState(cardQuestion);
  const [answer, setAnswer] = useState(cardAnswer);

  function handleSave() {
    setIsConfirmedPositive(true);
    onSave(question, answer);
  }
  return (
    <VStack paddingX="24px" gap={0} justifyContent="flex-start" alignItems="flex-start">
      <p
        className={css({
          marginTop: '24px',
          marginBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: '500',
          lineHeight: '1.875rem',
          color: '#3E3C46',
          p: '0px',
        })}>
        {t('flashcards.edit')}
      </p>

      <HStack justifyContent="space-between" width="100%">
        <Textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className={css({
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '1.21rem',
            textAlign: 'left',
            color: '#3E3C46',
            width: '100%',
            overflow: 'hidden',
            resize: 'none',
            whiteSpace: 'pre-wrap',
            border: 'none',
            marginTop: '24px',
            p: 0,
            _focus: {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            },
          })}
        />

        <EditPencilIcon />
      </HStack>

      <div
        className={css({
          marginTop: '16px',
          width: '100%',
          border: '1px solid #0000001A',
        })}
      />

      <TextareaComponent
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        isEditing={true}
        customStyles={{
          border: '1px solid #4141411A',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '16px',
        }}
      />
      <HStack width="100%" marginTop="24px" marginBottom="24px" justifyContent="flex-end" gap="12px">
        <Button
          className={css({
            padding: '8px',
            borderRadius: '12px',
            border: '1px solid #6D56FA1F',
            background: '#6D56FA26',
            color: '#6D56FA',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.5rem',
            width: '106px',
          })}
          onClick={() => onCancel()}
          disabled={isConfirmedPositive}>
          {t('common.cancel')}
        </Button>
        <Button
          className={css({
            padding: '8px',
            borderRadius: '12px',
            background: '#6D56FA',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.5rem',
            width: '103px',
          })}
          disabled={isConfirmedPositive}
          onClick={() => handleSave()}>
          {isConfirmedPositive ? <SpinningIcon /> : t('common.save')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default EditModal;
