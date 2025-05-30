import { Button } from '@/components/elements/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { useTranslation } from 'react-i18next';
import { styled, VStack } from 'styled-system/jsx';
import { FlashcardIcon } from '@/features/menu-bar/components/flashcard-icon';
import { BookOpenCheck } from 'lucide-react';

export const EmptyFlashcards = ({ isQuiz }: { isQuiz?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <VStack w="100%" gap={6} h={'100%'} display="flex" flexDir="column" justifyContent="center" textAlign={'center'}>
      <FlashcardIcon height="85" width="85" />
      <VStack gap={1}>
        <styled.span fontWeight={500} fontSize={'3xl'} color={'#15112b'}>
          {isQuiz ? t('collection.quizzes.empty.title') : t('collection.flashcards.list.empty.title')}
        </styled.span>
        <styled.span
          fontWeight={400}
          fontFamily={'var(--font-gt-walsheim)'}
          fontSize={'lg'}
          color={'rgba(21, 17, 43, 0.5)'}>
          {isQuiz
            ? t('collection.quizzes.empty.description')
            : t('collection.flashcards.list.empty.description')}
        </styled.span>
      </VStack>
      <Button
        variant={'solid'}
        size={'sm'}
        backgroundColor={'#15112b'}
        onClick={() => {
          router.push('/?tab=' + (isQuiz ? 'Quiz' : 'Flashcards'));
        }}>
        {isQuiz ? (
          <BookOpenCheck size={24} />
        ) : (
          <PlusIcon size={24} />
        )}
        <styled.span fontWeight={500} fontSize={'xs'}>
          {isQuiz ? t('common.newQuiz') : t('common.newFlashcard')}
        </styled.span>
      </Button>
    </VStack>
  );
};
