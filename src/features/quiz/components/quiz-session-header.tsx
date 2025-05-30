import { styled } from 'styled-system/jsx';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NumberFlow from '@number-flow/react';
import { UnlimitedBadge } from '@/components/elements/unlimited-badge';
import { useQuizTimer } from '@/features/quiz/hooks/use-quiz-timer';
import { useParams } from 'next/navigation';

interface QuizSessionHeaderProps {
  quizTitle: string;
  isUnlimited: boolean;
  onQuit: () => void;
}

export function QuizSessionHeader({ quizTitle, isUnlimited, onQuit }: QuizSessionHeaderProps) {
  const { t } = useTranslation();
  const params = useParams();
  const quizId = params.quiz_id as string;
  const quizSessionId = params.quiz_session as string;
  const { elapsed } = useQuizTimer(quizId, quizSessionId);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <styled.div display={'flex'} alignItems={'center'} justifyContent={'space-between'} pt={10}>
      <styled.h1 fontSize={'xl'} display={'flex'} alignItems={'center'} gap={3} fontWeight={'semibold'}>
        {quizTitle}
        {isUnlimited && <UnlimitedBadge />}
      </styled.h1>
      <styled.div display={'flex'} alignItems={'center'} gap={6}>
        {/* Stopwatch: starts on mount, resets on page change */}
        <styled.div
          opacity={0.7}
          display="flex"
          whiteSpace={'nowrap'}
          pl={6}
          alignItems="center"
          fontSize="sm"
          fontWeight="semibold"
          gap={0.5}>
          <styled.span fontVariantNumeric="tabular-nums" textAlign="right">
            {hours < 10 && <styled.span fontVariantNumeric="tabular-nums">0</styled.span>}
            <NumberFlow value={hours} />
          </styled.span>
          <styled.span fontVariantNumeric="tabular-nums">:</styled.span>
          <styled.span fontVariantNumeric="tabular-nums" textAlign="right">
            {minutes < 10 && <styled.span fontVariantNumeric="tabular-nums">0</styled.span>}
            <NumberFlow value={minutes} />
          </styled.span>
          <styled.span fontVariantNumeric="tabular-nums">:</styled.span>
          <styled.span fontVariantNumeric="tabular-nums" textAlign="right">
            {seconds < 10 && <styled.span fontVariantNumeric="tabular-nums">0</styled.span>}
            <NumberFlow value={seconds} />
          </styled.span>
        </styled.div>
        <styled.button
          bg="#00000010"
          onClick={onQuit}
          _hover={{ bg: '#00000020' }}
          cursor="pointer"
          px={3}
          py={2}
          borderRadius="lg"
          fontSize={'sm'}
          fontWeight={'semibold'}
          display="flex"
          alignItems="center"
          height={'fit-content'}
          gap={2}>
          <X size={16} />
          <span>{isUnlimited ? t('quiz.modal.finish') : t('quiz.modal.quit')}</span>
        </styled.button>
      </styled.div>
    </styled.div>
  );
}
