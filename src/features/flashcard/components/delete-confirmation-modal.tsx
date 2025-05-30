'use client';
import { HStack, VStack } from 'styled-system/jsx';
import { FlashCardIcon } from './flash-card-icon';
import { css } from 'styled-system/css';
import { Button } from '@/components/elements/button';
import { SpinningIcon } from '@/components/spinning-icon';
import { useTranslation } from 'react-i18next';

interface ConfirmActionModalProps {
  onDelete: () => void;
  onCancel: () => void;
  title: string;
  subTitle: string;
  isLoading: boolean;
}

const DeleteConfirmationModal = ({ onDelete, onCancel, title, subTitle, isLoading }: ConfirmActionModalProps) => {
  const { t } = useTranslation();

  function handleDelete() {
    onDelete();
  }

  return (
    <VStack paddingX="36px" gap={0}>
      <div className={css({ marginTop: '44px' })}>
        <FlashCardIcon isAccept={false} />
      </div>
      <p
        className={css({
          marginTop: '40px',
          marginBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: '500',
          lineHeight: '2.375rem',
          textAlign: 'center',
          color: '#3E3C46',
        })}>
        {title}
      </p>
      <p
        className={css({
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.25rem',
          textAlign: 'center',
          color: '#535862',
          marginBottom: '0px',
        })}>
        {subTitle}
      </p>
      <HStack width="100%" justifyContent="space-between" marginTop="40px" marginBottom="36px">
        <Button
          className={css({
            padding: '12px',
            gap: '10px',
            borderRadius: '8px',
            border: '1px solid #FF45451F',
            background: '#FF45450F',
            color: '#FF4545',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.5rem',
            width: '158px',
          })}
          onClick={() => onCancel()}
          disabled={isLoading}>
          {t('flashcards.review.no')}
        </Button>
        <Button
          className={css({
            padding: '12px',
            gap: '10px',
            borderRadius: '8px',
            background: '#FF4545',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.5rem',
            width: '158px',
          })}
          disabled={isLoading}
          onClick={() => handleDelete()}>
          {isLoading ? <SpinningIcon /> : t('flashcards.review.yesDelete')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default DeleteConfirmationModal;
