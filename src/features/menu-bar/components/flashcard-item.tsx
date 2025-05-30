import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { Flex, styled } from 'styled-system/jsx';
import { GalleryVerticalEnd } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { BaseItem } from './base-item';

interface FlashcardItemProps {
  flashcard: FlashcardSets;
  active: boolean;
}

export function FlashcardItem({ flashcard, active }: FlashcardItemProps) {
  const router = useRouter();
  const activeColor = '#6D56FA';

  const handleClick = () => router.push(`/flashcards/${flashcard.set_id}`);

  const icon = <GalleryVerticalEnd size={14} />;

  const rightContent = (
    <Flex alignItems="center" gap="2">
      <styled.span fontSize="10px" color="#868492" bg="#F0F0F0" px="1" py="0.5" borderRadius="4px" fontWeight="medium">
        {flashcard.number_of_flashcards}
      </styled.span>
    </Flex>
  );

  return (
    <BaseItem
      active={active}
      activeColor={activeColor}
      icon={icon}
      title={flashcard.name || flashcard.file_names?.[0]}
      onClick={handleClick}
      rightContent={rightContent}
    />
  );
}
