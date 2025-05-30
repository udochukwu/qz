import { css } from 'styled-system/css';
import useTutorialStore from '../stores/tutorial-store';
import { HStack, styled, VStack } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import { XIcon } from 'lucide-react';
import { IconButton } from '@/components/elements/icon-button';
import { Dialog } from '@/components/elements/dialog';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';

interface TutorialStep {
  tile: string;
  subtitle: string;
  additionalContent?: JSX.Element;
}

const VideoTutorial = (props: { tutorialSource: string }) => {
  return (
    <video
      className={css({
        mt: '6',
        rounded: '2xl',
        maxW: '775px',
      })}
      controls
      autoPlay
      key={props.tutorialSource} // Add this line
      muted>
      <source src={props.tutorialSource} type="video/mp4" />
      <span>Your browser does not support the video tag.</span>
    </video>
  );
};

const tutorialSteps: TutorialStep[] = [
  {
    tile: 'Hi There!',
    subtitle: 'I`m here to help you ace your courses by leveraging all your course materials. Let`s get started!',
  },
  {
    tile: 'Upload your course files',
    subtitle:
      'Throw your lecture slides, textbooks, YouTube videos, PDFs, PPTXs, and more my way. I`ll use these to answer your questions and save them for later in the "My Files" page. You can always add more from the home page or through the "My Files" button!',
    additionalContent: <VideoTutorial tutorialSource="/upload.mp4" />,
  },
  {
    tile: 'Let`s chat about your courses',
    subtitle:
      'Once you`ve uploaded your materials, fire away with your questions! I`ll dig into your sources and show you exactly where I found the answer - be it a specific lecture minute, textbook paragraph, or slide.',
    additionalContent: <VideoTutorial tutorialSource="/chat.mp4" />,
  },
  {
    tile: 'Create a class',
    subtitle:
      'Want to chat using all your course knowledge at once? Easy! Upload your materials into a course, and create multiple chats drawing from that pooled knowledge whenever you need a boost.',
    additionalContent: <VideoTutorial tutorialSource="/course.mp4" />,
  },
  {
    tile: 'That`s all, folks!',
    subtitle:
      'Need a refresher or have a specific question? Click the "Get Help" dropdown in the bottom left. You`ll find this tutorial and a way to contact our support team directly.',
    additionalContent: <VideoTutorial tutorialSource="/help.mp4" />,
  },
];

export const TutorialDialog = () => {
  const { t } = useTranslation();

  const { showTutorial, displayTutorial, closeTutorial, setTutorialIndex, tutorialIndex } = useTutorialStore();

  const onConfirm = () => {
    if (tutorialIndex === tutorialSteps.length - 1) {
      closeTutorial();
    } else {
      setTutorialIndex(tutorialIndex + 1);
    }
  };

  return (
    <Modal
      isOpen={showTutorial}
      onOpenChange={e => {
        closeTutorial();
      }}>
      <Dialog.Content className={css({ width: '800px', maxWidth: '90vw' })}>
        <VStack p="4" alignItems="flex-start" gap={3}>
          <VStack alignItems="flex-start" w="100%">
            <HStack justifyContent="space-between" w="100%">
              <styled.span color="neutral.800" textStyle="md" fontWeight="medium">
                {tutorialSteps[tutorialIndex].tile}
              </styled.span>
              <IconButton aria-label={t('common.closeDialog')} variant="ghost" size="sm" onClick={closeTutorial}>
                <XIcon />
              </IconButton>
            </HStack>
            <styled.p textStyle="sm" textAlign="start" color="#15112BB2">
              {tutorialSteps[tutorialIndex].subtitle}
            </styled.p>
          </VStack>
          <HStack justifyContent="center" w="100%">
            {tutorialSteps[tutorialIndex].additionalContent}
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <HStack>
              {tutorialSteps.map((_, index) => (
                <styled.div
                  onClick={() => setTutorialIndex(index)}
                  cursor="pointer"
                  key={index}
                  w={index === tutorialIndex ? '10px' : '8px'}
                  h={index === tutorialIndex ? '10px' : '8px'}
                  rounded={'full'}
                  border="3px solid"
                  bgColor={index === tutorialIndex ? '#6D56FA !important' : '#2121211A !important'}
                  borderColor={index === tutorialIndex ? '#6D56FA !important' : '#2121211A !important'}
                />
              ))}
            </HStack>
            <Button alignSelf="flex-end" onClick={onConfirm}>
              {tutorialIndex === tutorialSteps.length - 1 ? t('common.close') : t('common.next')}
            </Button>
          </HStack>
        </VStack>
      </Dialog.Content>
    </Modal>
  );
};
