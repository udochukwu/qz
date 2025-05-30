'use client';
import { OnboardModal } from '@/features/onboarding/components/onboard-modal';
import { Flex } from 'styled-system/jsx';
import { NewFlashcardView } from './new-flashcard-view/new-flashcard-view';

export default function FlashcardPage({ filterByClass }: { filterByClass?: boolean }) {
  return (
    <>
      <OnboardModal />
      <Flex flexDirection="row" height="100vh" width="100%">
        <Flex
          flexDirection="row"
          height="100%"
          width="100%"
          backgroundColor="#F8F8F8"
          justifyContent="flex-start"
          alignItems="flex-start">
          <NewFlashcardView />
        </Flex>
      </Flex>
    </>
  );
}
