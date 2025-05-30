import { FlashcardListCard } from './flashcard-list-card';
import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { useTranslation } from 'react-i18next';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { GenericGrid } from './generic-grid';

interface FlashcardGridProps {
  flashcardSets: FlashcardSets[];
}

export const FlashcardGrid = ({ flashcardSets }: FlashcardGridProps) => {
  const { t } = useTranslation();

  const renderFlashcardItem = (flashcard: FlashcardSets) => {
    const title = extractFileName(flashcard.file_names?.[0]);

    return (
      <FlashcardListCard
        key={flashcard.set_id}
        setId={flashcard.set_id}
        title={title}
        flashcardCount={t('collection.terms', { count: flashcard.number_of_flashcards })}
        fileName={flashcard.file_names?.[0]}
      />
    );
  };

  return <GenericGrid items={flashcardSets} renderItem={flashcard => renderFlashcardItem(flashcard)} />;
};
