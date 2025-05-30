import { FlashcardIcon } from '@/features/menu-bar/components/flashcard-icon';
import { useRouter } from 'next13-progressbar';
import { getIconColors } from '@/utils/get-icon-colors';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { GenericCard } from './generic-card';

interface FlashcardListCardProps {
  setId: string;
  title: string;
  fileName: string;
  flashcardCount: string;
}

export const FlashcardListCard = ({ setId, title, fileName, flashcardCount }: FlashcardListCardProps) => {
  const router = useRouter();
  const [backgroundColor, iconColor] = getIconColors(setId);
  const displayTitle = extractFileName(title);

  return (
    <GenericCard
      title={displayTitle}
      fileName={fileName}
      countText={flashcardCount}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      icon={<FlashcardIcon width="24px" height="24px" color={iconColor} />}
      onClick={() => router.push(`/flashcards/${setId}`)}
    />
  );
};
