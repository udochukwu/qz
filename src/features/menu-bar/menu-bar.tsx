'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Box, Divider, Flex, HStack, Wrap, styled } from 'styled-system/jsx';
import MenuHeader from './components/menu-header';
import { useSideBarData } from './hooks/use-list-side-bar';

import { useInitializeUser } from './hooks/use-initalize-user';
import { ErrorRetry } from '../user-feedback/error-retry';
import NewButton from './components/new-button';
import { TutorialDialog } from '../tutorial/components/tutorial-dialog';

import { useSplitterStore } from '@/stores/splitter-api-store';
import { UpgradePlanSidebarButton } from '../paywall/components/upgrade-plan-sidebar-button';
import { useSubscriptionStatus } from '../paywall/hooks/use-subscription-status';
import QuestView from '../quest/components/quest-view';
import { useUnsavedRecordings } from '../files-pdf-chunks-sidebar/hooks/files/use-unsaved-recordings';
import LeftSideMenuBar from './components/left-side-menu-bar';
import { AddToWorkspaceModal } from '../class/components/add-to-workspace-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { RecentChatHistoryProps } from '@/types';
import { MENU_TAB } from './types';
import { useViewTypeStore } from '@/stores/view-type-store';
import { useGetRecentFlashcardSets } from '../flashcard/hooks/use-get-recent-flashcard-sets';
import { useGetRecentQuizes } from '../quiz/hooks/use-get-recent-quizes';
import UnifiedItemList from './components/unified-item-list';
const MotionFlex = motion(Flex);

interface Props {
  isOpen?: boolean;
  toggle?: VoidFunction;
}

export default function MenuBar({ isOpen: externalIsOpen, toggle: externalToggle }: Props) {
  const { t } = useTranslation();

  const { data, isError, isLoading, refetch } = useSideBarData();
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [isInternalOpen, setInternalOpen] = useState(true);
  const { data: proData, isLoading: proStatusLoading } = useSubscriptionStatus();
  const show_upgrade = !proStatusLoading && !proData?.is_pro;
  const isWorkspaceModalOpen = useBoolean(false);
  const [ChatIdToAdd, setChatIdToAdd] = useState<string | null>(null);
  const { data: pendingUnsavedRecordings } = useUnsavedRecordings();
  const numUnsavedRecordings = pendingUnsavedRecordings?.files.length ?? 0;
  const pathname = usePathname();
  const [currentFlashcardId, setCurrentFlashcardId] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  // Whether clicking on recent chat should also open associated workspace
  const openWorkspaceFromRecentChat = true;

  const { currentView } = useViewTypeStore();
  const { data: flashSet } = useGetRecentFlashcardSets();
  const { data: quizes } = useGetRecentQuizes();
  //Extract unique classes from the workspace chats
  const classes = [
    ...new Map(
      data?.workspace_chats.map(w => [w.workspace_id, { workspace_id: w.workspace_id, class_name: w.class_name }]),
    ).values(),
  ];

  const getClassById = (workspaceId: string) => {
    return classes.find(c => c.workspace_id === workspaceId);
  };

  const getRecentChats = (): RecentChatHistoryProps[] => {
    const workspaceChats =
      data?.workspace_chats.flatMap(w =>
        w.chats.map(
          chat =>
            ({
              class_name: w.class_name,
              workspace_id: w.workspace_id,
              chat_id: chat.chat_id,
              description: chat.description,
              last_message_at: chat.last_message_at,
            }) as RecentChatHistoryProps,
        ),
      ) || [];

    const unassignedChats = (data?.unassigned_chats || []).map(
      chat =>
        ({
          chat_id: chat.chat_id,
          description: chat.description,
          last_message_at: chat.last_message_at,
        }) as RecentChatHistoryProps,
    );

    const allChats = [...workspaceChats, ...unassignedChats].sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime(),
    );

    return allChats ?? [];
  };

  // Get the current conversations based on the current workspace
  const currentConversations = currentWorkspace
    ? data?.workspace_chats.find(w => w.workspace_id === currentWorkspace)?.chats
    : getRecentChats().slice(0, 10);

  const currentFlashcardSet = currentWorkspace ? [] : flashSet?.flashcard_sets;
  const currentQuizes = currentWorkspace ? [] : quizes;
  const OnAddChatToWorkspace = (chatId: string) => {
    setChatIdToAdd(chatId);
    isWorkspaceModalOpen.setValue(true);
  };
  useInitializeUser();

  const internalToggleSidebar = () => {
    setInternalOpen(!isSidebarOpen);
  };
  const { chatSize } = useSplitterStore();

  const toggleSidebar = externalToggle ?? internalToggleSidebar;
  const isSidebarOpen = externalIsOpen !== undefined ? externalIsOpen : isInternalOpen;

  useEffect(() => {
    if (chatSize <= 50 && isSidebarOpen) {
      toggleSidebar();
    }
  }, [chatSize]);

  // Set current chat and workspace based on the URL
  useEffect(() => {
    const patharray = pathname.split('/');
    if (patharray.length >= 3) {
      if (patharray[1] === 'quiz') {
        setCurrentQuiz(patharray[2]);
        setCurrentFlashcardId(null); // Reset flashcard active state
        setCurrentChat(null); // Reset chat active state
      } else if (patharray[1] === 'c') {
        // For chat pages
        setCurrentChat(patharray[2]);
        setCurrentFlashcardId(null); // Reset flashcard active state
        setCurrentQuiz(null); // Reset quiz active state
        if (openWorkspaceFromRecentChat) {
          const ws_id = data?.workspace_chats.find(w => w.chats.find(c => c.chat_id === patharray[2]))?.workspace_id;
          ws_id && setCurrentWorkspace(ws_id);
        }
      } else if (patharray[1] === 'classes') {
        // For class pages
        setCurrentWorkspace(patharray[2]);
        setCurrentFlashcardId(null); // Reset flashcard active state
        setCurrentQuiz(null); // Reset quiz active state
        setCurrentChat(null); // Reset chat active state
      } else if (patharray[1] === 'flashcards') {
        // For flashcard pages
        setCurrentWorkspace(null);
        setCurrentFlashcardId(patharray[2]);
        setCurrentQuiz(null); // Reset quiz active state
        setCurrentChat(null); // Reset chat active state
      } else if (patharray[1] === 'f') {
        // Keep this for backward compatibility
        setCurrentWorkspace(null);
        setCurrentFlashcardId(patharray[2]);
        setCurrentQuiz(null); // Reset quiz active state
        setCurrentChat(null); // Reset chat active state
      } else {
        // For other pages
        setCurrentChat(null);
        setCurrentWorkspace(null);
        setCurrentFlashcardId(null);
        setCurrentQuiz(null); // Reset quiz active state
      }
    } else {
      // For home page or other pages with different URL structure
      setCurrentChat(null);
      setCurrentWorkspace(null);
      setCurrentFlashcardId(null);
      setCurrentQuiz(null);
    }
  }, [pathname, isLoading]);

  const sidebarVariants = {
    open: {
      width: '260px',
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    minimized: {
      width: '0px',
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  if (isError) {
    return (
      <styled.div h="100%" w="300px">
        <ErrorRetry error={t('class.menu.sidebar.error')} retry={refetch} />
      </styled.div>
    );
  }

  return (
    <>
      <AddToWorkspaceModal
        isOpen={isWorkspaceModalOpen.value}
        setIsOpen={isWorkspaceModalOpen.setValue}
        chatId={ChatIdToAdd}
      />
      <HStack gap={0} h={'100vh'} bg={'#f8f8f8'} pl={'15px'}>
        <LeftSideMenuBar
          onSideBarToggle={toggleSidebar}
          numUnsavedRecordings={numUnsavedRecordings}
          classes={classes}
          currentWorkspace={currentWorkspace}
          isSideBarOpen={isSidebarOpen}
          isLoading={isLoading}
        />
        <motion.nav initial={false} animate={isSidebarOpen ? 'open' : 'minimized'}>
          <TutorialDialog />
          <MotionFlex
            variants={sidebarVariants}
            initial="open"
            gap={5}
            height={'calc(100vh - 30px)'}
            animate={isSidebarOpen ? 'open' : 'minimized'}
            bg="#FFFFFF"
            py={4}
            border="1px solid token(colors.gray.4)"
            borderLeft="none !important"
            borderRightRadius={'xl'}
            flexDirection="column">
            {isSidebarOpen && (
              <>
                <Box
                  flex={1}
                  overflowY="hidden"
                  overflowX={'hidden'}
                  width={'100%'}
                  display="flex"
                  scrollbarColor="rgba(0, 0, 0, 0.1) transparent"
                  _scrollbar={{
                    width: '3px',
                    height: '3px',
                  }}
                  flexDirection="column"
                  height="100%">
                  <Wrap width="100%" flexDirection="column" height="100%" display="flex">
                    <Box mb="0" display="flex" flexDirection="column" width="full">
                      <MenuHeader workspace={currentWorkspace ? getClassById(currentWorkspace) : undefined} />
                      <Box mt="20px" px={4}>
                        <NewButton workspace_id={currentWorkspace} />
                      </Box>
                    </Box>

                    <Box width="100%" flex={1} overflowY="auto" minHeight={0} px={4}>
                      <span>
                        {!isSidebarOpen ? (
                          <></>
                        ) : isError ? (
                          <ErrorRetry error={t('class.menu.sidebar.error')} retry={refetch} w="200px" />
                        ) : isLoading ? (
                          // Show skeleton loaders when loading
                          <>
                            <UnifiedItemList
                              conversations={[]}
                              flashcardSets={[]}
                              quizes={[]}
                              isLoading={true}
                              currentChat={null}
                              currentFlashcardId={null}
                              currentQuiz={null}
                              currentWorkspace={null}
                            />
                          </>
                        ) : (
                          // Show actual data when loaded
                          <>
                            <QuestView />
                            <UnifiedItemList
                              currentQuiz={currentQuiz}
                              conversations={currentConversations ?? []}
                              flashcardSets={currentWorkspace ? [] : currentFlashcardSet || []}
                              quizes={currentWorkspace ? [] : currentQuizes || []}
                              isLoading={isLoading}
                              OnAddChatToWorkspace={currentWorkspace ? undefined : OnAddChatToWorkspace}
                              currentChat={currentChat}
                              currentFlashcardId={currentFlashcardId}
                              currentWorkspace={currentWorkspace}
                            />
                          </>
                        )}
                      </span>
                    </Box>
                  </Wrap>
                </Box>
                {show_upgrade && <UpgradePlanSidebarButton />}
              </>
            )}
          </MotionFlex>
        </motion.nav>
      </HStack>
    </>
  );
}
