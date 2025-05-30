import { QuizPreview } from '@/features/quiz/types/quiz';
import { GenericGridSection } from './generic-grid-section';
import { useTranslation } from 'react-i18next';
import { QuizListCard } from './quiz-list-card';

interface QuizGridSectionProps {
  title: string;
  quizzes: QuizPreview[];
}

export const QuizGridSection = ({ title, quizzes }: QuizGridSectionProps) => {
  const { t } = useTranslation();

  const renderQuiz = (quiz: QuizPreview) => {
    return (
      <QuizListCard
        key={quiz.quiz_id}
        quiz={quiz}
        questionCount={t('collection.questions', { count: quiz.number_of_questions })}
      />
    );
  };

  return <GenericGridSection title={title} items={quizzes} renderItem={renderQuiz} />;
};
