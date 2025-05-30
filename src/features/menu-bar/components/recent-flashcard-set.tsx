import { Stack, VStack, styled } from 'styled-system/jsx';
import FlashcardSetItem from './flashcard-set-item';
import { FlashcardIcon } from './flashcard-icon';
import { useTranslation } from 'react-i18next';
import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';

interface RecentFlashcardProps {
  flashcardSets: FlashcardSets[];
}

export default function RecentFlashcardSet({ flashcardSets }: RecentFlashcardProps) {
  const { t } = useTranslation();

  return (
    <styled.div mt="31px" w="full">
      <VStack gap={3} w="100%">
        {flashcardSets?.length > 0 ? (
          flashcardSets.map((flashset, index) => {
            return <FlashcardSetItem data={flashset} key={index} />;
          })
        ) : (
          <Stack display="flex" flexDir="column" alignItems="center">
            <FlashcardIcon color="#8A8895" height="20" width="20" />
            <styled.p m="0" fontSize="14px" fontWeight="500" color="#8A8895">
              {t('flashcards.noFlashcard')}
            </styled.p>
          </Stack>
        )}
      </VStack>
    </styled.div>
  );
}
