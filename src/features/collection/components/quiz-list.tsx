import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { useGetRecentQuizes } from '@/features/quiz/hooks/use-get-recent-quizes';
import { QuizPreview } from '@/features/quiz/types/quiz';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { LoadingSkeleton } from './loading-skeleton';
import { QuizGridSection } from './quiz-grid-section';
import { groupByDateDescending } from '../utils/date-grouping';
import { EmptyFlashcards } from './empty-flashcards';
export const QuizList = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useGetRecentQuizes();

  const renderQuizSections = (quizzes: Record<string, QuizPreview[]>) => {
    return Object.entries(quizzes).map(([group, items], index) => (
      <div
        className={css({
          marginTop: index !== 0 ? '56px' : '0px',
        })}
        key={group}>
        <QuizGridSection key={group} title={group} quizzes={items} />
      </div>
    ));
  };

  if (isError) {
    return <ErrorRetry error={t('collection.quizzes.list.error')} retry={refetch} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Ensure we have valid data
  const quizzes = Array.isArray(data) ? data : [];
  const noQuizzes = quizzes.length === 0;

  // Group the quizzes by date
  const groupedQuizzes = groupByDateDescending(quizzes, t);

  if (noQuizzes) {
    return <EmptyFlashcards isQuiz />;
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
        {renderQuizSections(groupedQuizzes)}
      </styled.div>
    </styled.div>
  );
};
