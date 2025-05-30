import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { GenericGridSection } from './generic-grid-section';
import { useTranslation } from 'react-i18next';
import { FlashcardListCard } from './flashcard-list-card';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';

interface FlashcardGridSectionProps {
  title: string;
  sets: FlashcardSets[];
}

export const FlashcardGridSection = ({ title, sets }: FlashcardGridSectionProps) => {
  const { t } = useTranslation();

  const renderFlashcard = (flashcard: FlashcardSets) => {
    const fileName = flashcard.file_names?.[0] || '';
    return (
      <FlashcardListCard
        key={flashcard.set_id}
        setId={flashcard.set_id}
        title={fileName}
        flashcardCount={t('collection.terms', { count: flashcard.number_of_flashcards })}
        fileName={fileName}
      />
    );
  };

  return <GenericGridSection title={title} items={sets} renderItem={renderFlashcard} />;
};
