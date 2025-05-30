'use client';

import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { Button } from '@/components/elements/button';
import { ProgressSuccessIcon } from '@/features/flashcard/components/progress-success-icon';
import { styled } from 'styled-system/jsx';
import { useRouter } from 'next13-progressbar';
import { Flashcard } from './types/flashcard';

interface ProgressTrackingResultProps {
  resetFlashcardSet: () => void;
  flashcards: Flashcard[];
}
const ProgressTrackingResult = ({ resetFlashcardSet, flashcards }: ProgressTrackingResultProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const learningCardsCount = flashcards?.filter(f => f.progress_status === 'learning').length || 0;
  const memorizedCardsCount = flashcards?.filter(f => f.progress_status === 'memorized').length || 0;
  const totalCardsCount = flashcards?.length || 0;
  const memorizedPercentage = `${(memorizedCardsCount / totalCardsCount) * 100}%`;
  const learningPercentage = `${(learningCardsCount / totalCardsCount) * 100}%`;

  const getProgressMessage = (percentage: number) => {
    if (percentage > 80) {
      return t('flashcards.progressCompletionMessage');
    } else if (percentage > 60) {
      return t('flashcards.progressMessage80');
    } else if (percentage > 40) {
      return t('flashcards.progressMessage60');
    } else if (percentage > 20) {
      return t('flashcards.progressMessage40');
    } else {
      return t('flashcards.progressMessage20');
    }
  };

  const restartFlashCards = async () => {
    resetFlashcardSet();
  };

  const handleFinish = () => {
    resetFlashcardSet();
    router.push('/classes');
  };

  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '112.67px',
      })}>
      <div
        className={css({
          width: '500px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          border: '1.16px solid #4141411F',
          padding: '36px 24px',
        })}>
        <div className={css({ display: 'flex', justifyContent: 'center', marginBottom: '20px' })}>
          <ProgressSuccessIcon />
        </div>
        <p
          className={css({
            textAlign: 'center',
            fontSize: '26px',
            lineHeight: '36px',
            marginBottom: '0px',
          })}>
          {getProgressMessage((memorizedCardsCount / totalCardsCount) * 100)}
        </p>
        <h2
          className={css({
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '56px',
            lineHeight: '67.77px',
          })}>
          {Math.floor((memorizedCardsCount / totalCardsCount) * 100)}%
        </h2>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '28px',
            padding: '0px 32px',
          })}>
          <styled.div
            style={{ width: memorizedPercentage }}
            className={css({
              height: '9px',
              backgroundColor: '#00B389',
              borderRadius: '4px',
            })}></styled.div>
          <styled.div
            style={{ width: learningPercentage }}
            className={css({
              height: '9px',
              backgroundColor: '#FFC16C',
              borderRadius: '4px',
            })}></styled.div>
        </div>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '56px',
            padding: '0px 32px',
          })}>
          <div
            className={css({
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              gap: '8px',
              width: '50%',
            })}>
            <div
              className={css({ height: '16px', width: '16px', borderRadius: '50%', backgroundColor: '#00B389' })}></div>
            <p className={css({ margin: '0px', color: '#15112B80', fontWeight: '500', fontSize: '16px' })}>
              {t('flashcards.memorized')}
            </p>
          </div>
          <div
            className={css({
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '8px',
              width: '50%',
            })}>
            <div
              className={css({ height: '16px', width: '16px', borderRadius: '50%', backgroundColor: '#FFC16C' })}></div>
            <p className={css({ margin: '0px', color: '#15112B80', fontWeight: '500', fontSize: '16px' })}>
              {t('flashcards.stillLearning')}
            </p>
          </div>
        </div>
        <div className={css({ display: 'flex', justifyContent: 'space-between', gap: '12px' })}>
          <Button
            width="50%"
            variant="outline"
            onClick={restartFlashCards}
            borderRadius="10px"
            color="#3E3C46"
            fontWeight="500"
            fontSize="14px"
            lineHeight="16.94px">
            {t('flashcards.restartFlashcards')}
          </Button>
          <Button
            width="50%"
            variant="solid"
            onClick={handleFinish}
            borderRadius="10px"
            fontWeight="500"
            fontSize="14px"
            lineHeight="16.94px">
            {t('common.finish')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingResult;
