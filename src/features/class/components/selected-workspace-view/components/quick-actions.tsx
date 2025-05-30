import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { WorkspaceClass } from '@/types';
import React from 'react';
import { Box, Flex, styled } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { useRouter, useSearchParams } from 'next/navigation';
import RecordingView from '@/features/chat/components/new-chat-view/components/classes-files-browser/record/recording-view';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { useUserStore } from '@/stores/user-store';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import { useTranslation } from 'react-i18next';
import { useViewTypeStore } from '@/stores/view-type-store';

interface QuickActionsCardData {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  bgColor: string;
  hoverBorderColor: string;
  onClick?: () => void;
  comingSoon?: boolean;
}

export const QuickActions = ({ workspace }: { workspace: WorkspaceClass }) => {
  const { t } = useTranslation();
  const { switchView } = useViewTypeStore();
  const { mutate: createChat } = useCreateChat();
  const { impersonated } = useUserStore();
  const crudPayload: CRUDFilesPost = { workspace_id: workspace.workspace_id };
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRecording = searchParams.get('recording') === 'true';
  const updateUrlParams = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };
  const handleRecordClick = () => {
    updateUrlParams('recording', 'true');
  };
  const handleDeleteRecording = () => {
    updateUrlParams('recording', 'false');
  };
  const onSaved = () => {
    updateUrlParams('recording', 'false');
    mixpanel.track(EventName.SaveRecordedLecture, {
      path: window.location.pathname,
      source_action: 'home_modal',
    });
  };
  const [ExtractIcon, extractTitle] = getClassNameAndIcon(workspace.class_name);
  const quickActionCardList: QuickActionsCardData[] = [
    {
      id: 1,
      icon: '/icons/ic_message.svg',
      title: 'common.newChat',
      subtitle: 'class.workspace.quickActions.chatWith',
      bgColor: '#6D56FA12',
      hoverBorderColor: '#6D56FA42',
      onClick: () => createChat(crudPayload),
    },
    {
      id: 2,
      icon: '/icons/ic_record.svg',
      title: 'common.newRecording',
      subtitle: 'class.workspace.quickActions.recordFor',
      bgColor: '#FA565612',
      hoverBorderColor: '#FA565642',
      onClick: () => handleRecordClick(),
    },
    {
      id: 3,
      icon: '/icons/ic_flashcard.svg',
      title: 'common.newFlashCard',
      subtitle: 'class.workspace.quickActions.flashcardFor',
      bgColor: '#55CBFD12',
      hoverBorderColor: '#55CBFD5C',
      onClick: () => {
        router.push(`/?tab=Flashcards`);
      },
    },
    {
      id: 4,
      icon: '/icons/ic_quiz.svg',
      title: 'common.newQuiz',
      subtitle: 'class.workspace.quickActions.quizFor',
      bgColor: '#E656F912',
      hoverBorderColor: '#E656F942',
      onClick: () => {
        router.push(`/?tab=Quiz`);
      },
    },
  ];
  return (
    <>
      <Box pt="7" bg="gray.50" borderRadius="md" minW="300px" w={'70%'} mx="auto" containerType="inline-size">
        <styled.div fontSize="xl" color="#00000" marginBottom="22px" fontWeight="500">
          {t('class.workspace.quickActions.title')}
        </styled.div>
        <styled.div
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="20px"
          css={{
            '@container (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}>
          {quickActionCardList.map(card => (
            <Flex
              key={card.id}
              flex="1"
              direction="row"
              align="center"
              bg="white"
              width="full"
              borderRadius="14px"
              height={'90px'}
              border="1px solid #EFEFF0"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = card.hoverBorderColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#EFEFF0';
              }}
              cursor="pointer"
              onClick={!impersonated ? card.onClick : undefined}
              position="relative"
              paddingRight={'30px'}
              data-quick-action={
                card.id === 1 ? 'chat' : card.id === 2 ? 'record' : card.id === 3 ? 'flashcards' : undefined
              }>
              <styled.div
                bgColor={card.bgColor}
                borderTopLeftRadius="14px"
                borderBottomLeftRadius="14px"
                height={'90px'}
                display={'flex'}
                alignItems={'center'}
                w="84px"
                justifyContent={'center'}
                style={{
                  backgroundColor: card.bgColor,
                }}>
                <styled.img src={card.icon} alt="" height="25px" width="25px" marginX="30px" />
              </styled.div>
              <Flex direction="column" align="start">
                <styled.span fontSize="16px" fontWeight="500" color={'#3E3C46'} marginLeft="19px">
                  {t(card.title)}
                </styled.span>
                <styled.span
                  fontSize="xs"
                  color="#3E3C4699"
                  fontWeight="normal"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxW="126px"
                  marginLeft="19px">
                  {t(card.subtitle)}
                  {extractTitle}
                </styled.span>
              </Flex>
              {card.comingSoon && (
                <Box
                  bgColor="#6D56FA12"
                  borderRadius="26px"
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  right="2"
                  top="2"
                  paddingX="6px"
                  paddingY="3px">
                  <styled.p style={{ fontSize: '5.2px', color: '#6D56FA', margin: 0 }}>Coming Soon</styled.p>
                </Box>
              )}
            </Flex>
          ))}
        </styled.div>
      </Box>
      {isRecording && (
        <RecordingView onDelete={handleDeleteRecording} workspace_id={workspace.workspace_id} onSaved={onSaved} />
      )}
    </>
  );
};
