import { BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { getIconColors } from '@/utils/get-icon-colors';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { GenericCard } from './generic-card';
import { QuizPreview } from '@/features/quiz/types/quiz';

interface QuizListCardProps {
  quiz: QuizPreview;
  questionCount: string;
}

export const QuizListCard = ({ quiz, questionCount }: QuizListCardProps) => {
  const router = useRouter();
  const [backgroundColor, iconColor] = getIconColors(quiz.quiz_id);
  const fileName = quiz.file_ids?.[0] || '';
  const displayTitle = quiz.title || extractFileName(fileName);

  return (
    <GenericCard
      title={displayTitle}
      fileName={fileName}
      countText={questionCount}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      icon={<BookOpenCheck size={24} color={iconColor} />}
      onClick={() => router.push(`/quiz/${quiz.quiz_id}`)}
    />
  );
};
