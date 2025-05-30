//MAKE SURE TO ADD THE PRODUCT TOUR COMPONENT TO THE LAYOUT OR PAGE YOU ARE IMPLEMENTING THIS ON

'use client';
import { NewChatView } from '@/features/chat/components/new-chat-view/new-chat-view';
import { DragToUploadNewChat } from '@/features/files-pdf-chunks-sidebar/drag-to-upload-new-chat';
import { OnboardModal } from '@/features/onboarding/components/onboard-modal';
import { Flex } from 'styled-system/jsx';
import { ProductTour } from '@/features/onboarding/components/product-tour';

export default function ChatPage() {
  return (
    <>
      <OnboardModal />
      <ProductTour />
      <DragToUploadNewChat />
      <Flex flexDirection="row" height="100vh" width="100%">
        <Flex
          flexDirection="row"
          height="100%"
          width="100%"
          backgroundColor="#F8F8F8"
          justifyContent="flex-start"
          alignItems="flex-start">
          <NewChatView />
        </Flex>
      </Flex>
    </>
  );
}
