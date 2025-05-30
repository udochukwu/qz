import { Flex, styled } from 'styled-system/jsx';
import { BookOpenCheck, Infinity } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { QuizPreview } from '@/features/quiz/types/quiz';
import { BaseItem } from './base-item';

interface QuizItemProps {
  quiz: QuizPreview;
  active: boolean;
}

export function QuizItem({ quiz, active }: QuizItemProps) {
  const router = useRouter();
  const activeColor = '#6D56FA';

  const handleClick = () => router.push(`/quiz/${quiz.quiz_id}`);

  const icon = <BookOpenCheck size={14} color={'#868492'} />;

  const rightContent = (
    <Flex aspectRatio={1} alignItems="center" gap="2">
      <styled.span fontSize="10px" color="#868492" bg="#F0F0F0" px="1" py="0.5" borderRadius="4px" fontWeight="medium">
        {quiz.is_unlimited ? <Infinity color="black" opacity={0.5} size={12} /> : quiz.number_of_questions}
      </styled.span>
    </Flex>
  );

  return (
    <BaseItem
      active={active}
      activeColor={activeColor}
      icon={icon}
      title={quiz.title}
      onClick={handleClick}
      rightContent={rightContent}
    />
  );
}
