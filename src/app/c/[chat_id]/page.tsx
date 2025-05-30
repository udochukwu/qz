'use client';
import React from 'react';
import { ChatView } from '@/features/chat';
import { FilesSideBar } from '@/features/files-pdf-chunks-sidebar';
import CustomSplitter from '@/components/custom-splitter';
import { styled } from 'styled-system/jsx';
import useSideBarStore from '@/features/chat/stores/side-bar-store';
import { BlockUIFromMobile } from '@/components/block-ui-from-mobile';
import { DragToUpload } from '@/features/files-pdf-chunks-sidebar/drag-to-upload/drag-to-upload';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import VideoOnboarding from '@/features/quest/components/floating-vidoe';
import { useGetQuest } from '@/features/quest/hooks/use-get-quest';
import useOnboardingVideoStore from '@/features/quest/stores/use-onboarding-video-store';
import { OnboardModal } from '@/features/onboarding/components/onboard-modal';
import { useUserStore } from '@/stores/user-store';
import { ProductTour } from '@/features/onboarding/components/product-tour';

interface Params {
  chat_id: string;
}

const ChatPage: React.FC<{ params: Params }> = ({ params }) => {
  const { chat_id } = params;
  const { experiments } = useUserStore();

  const isSideBarOpen = useSideBarStore(state => state.isSideBarOpen);
  const { data } = useGetQuest();
  const isReadyToshowOnboardingVideo = useOnboardingVideoStore(state => state.showOnboardingVideo);
  const isVideoPlaying = useOnboardingVideoStore(state => state.isVideoPlaying);
  const crudPayload: CRUDFilesPost = { chat_id: chat_id };
  const { onFilesChange } = useOnUploadFileController({});
  const showOnboardingVideo =
    (data?.quest_data?.explainer_video === false && isReadyToshowOnboardingVideo) || isVideoPlaying;

  const showOnboardingModal = experiments && experiments['onboarding-modal'];

  return (
    <>
      <BlockUIFromMobile>
        {showOnboardingVideo && <VideoOnboarding />}
        {showOnboardingModal && <OnboardModal />}
        <ProductTour />
        <DragToUpload
          onDrop={files => {
            onFilesChange({ acceptedFiles: files, uploadFilePayload: crudPayload });
          }}
        />
        <styled.section display="flex" h="100vh" w="100%" bg="#F8F8F9" overflow="clip">
          <CustomSplitter containerStyles={{ width: '100%' }} isToggleable={{ isToggled: isSideBarOpen }}>
            <ChatView />
            <FilesSideBar
              uploadingController={{
                uploadFiles: ({ acceptedFiles }) => {
                  onFilesChange({ acceptedFiles, uploadFilePayload: crudPayload });
                },
              }}
            />
          </CustomSplitter>
        </styled.section>
      </BlockUIFromMobile>
    </>
  );
};

export default ChatPage;
