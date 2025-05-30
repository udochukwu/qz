import { Tabs } from '@/components/elements/tabs';
import { css } from 'styled-system/css';
import ClassesList from './components/classes-list';
import HomeFilesList from './components/home-files-list';
import { useEffect, useState, useRef } from 'react';
import { useListClasses } from '@/hooks/use-list-classes';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { Skeleton } from '@/components/elements/skeleton';
import { ClassesFilesErrorWrapper } from './components/classes-files-error-wrapper';
import { ChatInput } from '../../../input/chat-input';
import { MessageCircle, FolderClosed, Paperclip, BookOpen, GalleryVerticalEnd, BookOpenCheck } from 'lucide-react';
import { styled, Box, HStack } from 'styled-system/jsx';
import NewChatUpload from './components/new-chat-upload';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { RecordIcon } from './components/record-icon';
import RecordLecture from './record/record-lecture-tab';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { WorkspaceClass } from '@/types';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { NewFlashcardView } from '@/features/flashcard/new-flashcard-view/new-flashcard-view';
import { Badge } from '@/components/elements/badge';
import React from 'react';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import QuizView from '@/features/quiz/components/quiz-view';

interface ContentTypeButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ContentTypeButton = ({ isSelected, onClick, icon, label }: ContentTypeButtonProps) => (
  <styled.div
    fontSize={'sm'}
    fontWeight={'medium'}
    px={3}
    py={2}
    borderRadius={'full'}
    borderColor={isSelected ? '#E2DEFF' : '#E2DEFF'}
    width={'fit-content'}
    borderWidth={'1px'}
    bg={isSelected ? '#E2DEFF' : 'white'}
    color={isSelected ? '#6D56FA' : '#8F8AA9'}
    cursor={'pointer'}
    _hover={{
      opacity: 0.9,
      backgroundColor: 'rgba(26, 12, 108, 0.06)',
    }}
    onClick={onClick}
    transition="all 0.2s ease">
    <HStack gap={1.5} alignItems="center">
      {icon}
      <span>{label}</span>
    </HStack>
  </styled.div>
);

export default function ClassesFilesBrowser() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'Classes';

  // State for content type selector
  const [contentType, setContentType] = useState<'Classes' | 'Files' | 'Upload'>('Classes');

  // State for selected class and files
  const [selectedClass, setSelectedClass] = useState<WorkspaceClass | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: classList,
    isLoading: isClassesLoading,
    isError: isErrorClasses,
    refetch: refetchClasses,
  } = useListClasses();
  const { data: pendingFileList, isLoading: isFilesLoading, isError: isErrorFiles, refetch: refetchFiles } = useFiles();
  const { mutate: createChat } = useCreateChat();

  const fileList = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED) ?? [];
  const selectedFiles = fileList.filter(file => file.isSelected) || [];

  const isLoading = isClassesLoading || isFilesLoading;

  useEffect(() => {
    if (!isLoading && classList?.classes.length === 0 && fileList?.length === 0 && currentTab !== 'Record') {
      router.push(`?tab=Classes`);
    }
  }, [isLoading, router]);

  const handleTabChange = (event: { value: string }) => {
    if (event.value === 'Flashcards') {
      mixpanel.track(EventName.FlashcardTabSelectedOnHome);
    }
    router.push(`?tab=${event.value}`);
  };

  // Handler for content type selection
  const handleContentTypeChange = (type: 'Classes' | 'Files' | 'Upload') => {
    setContentType(type);
    // Reset selection when switching between Classes and Files
    setSelectedClass(null);

    // Reset file selections when switching tabs
    if (pendingFileList && pendingFileList.files.length > 0) {
      const updatedFiles = pendingFileList.files.map(file => ({
        ...file,
        isSelected: false,
      }));

      // Update the files in the cache to reset selections
      queryClient.setQueryData(getFilesQueryKey(), {
        ...pendingFileList,
        files: updatedFiles,
      });
    }

    // Focus the input after changing content type
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handler for class selection
  const handleClassSelect = (classItem: WorkspaceClass) => {
    setSelectedClass(classItem);
    // Focus the input after selecting a class
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Get placeholder text based on selection
  const getPlaceholderText = () => {
    if (contentType === 'Classes') {
      return selectedClass ? `Ask anything to ${selectedClass.class_name}` : t('chat.input.placeholder');
    } else {
      const selectedCount = selectedFiles.length;
      return selectedCount > 0 ? `Ask anything to ${selectedCount} files` : t('chat.input.placeholder');
    }
  };

  const tabs = [
    {
      label: t('common.chat'),
      value: 'Classes',
      content: (
        <ClassesFilesErrorWrapper isError={isErrorClasses} retry={refetchClasses}>
          <styled.div display={'flex'} gap={2} alignItems={'center'}>
            <ContentTypeButton
              isSelected={contentType === 'Classes'}
              onClick={() => handleContentTypeChange('Classes')}
              icon={<MessageCircle size={14} />}
              label={t('common.classes')}
            />
            <ContentTypeButton
              isSelected={contentType === 'Files'}
              onClick={() => handleContentTypeChange('Files')}
              icon={<FolderClosed size={14} />}
              label={t('common.allFiles')}
            />
            <ContentTypeButton
              isSelected={contentType === 'Upload'}
              onClick={() => handleContentTypeChange('Upload')}
              icon={<Paperclip size={14} />}
              label={t('common.upload')}
            />
          </styled.div>

          {/* Render the appropriate component based on the selected content type */}
          {contentType === 'Classes' && <ClassesList onSelectClass={handleClassSelect} selectedClass={selectedClass} />}
          {contentType === 'Files' && (
            <styled.div mt={2}>
              <HomeFilesList inputRef={inputRef} />
            </styled.div>
          )}
          {contentType === 'Upload' && (
            <styled.div mt={4}>
              <NewChatUpload />
            </styled.div>
          )}
        </ClassesFilesErrorWrapper>
      ),
      icon: <MessageCircle />,
    },
    {
      label: t('common.flashcards'),
      value: 'Flashcards',
      content: (
        <styled.div>
          <NewFlashcardView />
        </styled.div>
      ),
      icon: <GalleryVerticalEnd />,
    },
    {
      label: t('common.quiz'),
      value: 'Quiz',
      newFeature: true,
      content: <QuizView />,
      icon: <BookOpenCheck />,
    },
    {
      label: `${t('common.record')}`,
      value: 'Record',
      content: (
        <styled.div>
          <RecordLecture />
        </styled.div>
      ),
      icon: <RecordIcon size={5} />,
    },
  ];

  return (
    <Skeleton w="auto" mx="auto" isLoaded={!isLoading}>
      <div
        className={
          css({
            display: 'flex',
            flexDirection: 'column',
            width: '50vw',
            maxWidth: '750px',
            overflow: 'visible',
            mx: 'auto',
            marginTop: '20px',
          }) + ' classes-files-browser'
        }
        data-selected-class-id={selectedClass?.workspace_id || ''}
        data-selected-file-ids={selectedFiles.map(file => file.workspace_file_id).join(',')}>
        <Tabs.Root py={0} value={currentTab} onValueChange={handleTabChange}>
          <Tabs.List
            px="6px"
            paddingBottom="4px"
            zIndex={0}
            style={{
              overflow: 'visible',
            }}
            _horizontal={{ boxShadow: '0 -1px 0 0 inset rgba(0,0,0,0)' }}>
            {tabs.map(tab => (
              <Tabs.Trigger
                value={tab.value}
                key={tab.label}
                fontWeight="400"
                fontSize="14px"
                background="white"
                height="!48px"
                px="8px 18px"
                py="!12px"
                className={css({
                  shadow: currentTab == tab.value ? 'md' : '',
                  backgroundColor: currentTab === tab.value ? '#6D56FA' : 'transparent',
                  color: currentTab === tab.value ? 'white' : '#3E3C46',
                  rounded: '12px',
                  border: '1px solid',
                  borderColor: currentTab === tab.value ? '#6D56FA' : '#E2E2E2',
                  '&:hover': {
                    backgroundColor: currentTab === tab.value ? '#6D56FA' : '#6D56FA14',
                    color: currentTab === tab.value ? 'white' : '#6D56FA',
                    borderColor: currentTab === tab.value ? '#6D56FA' : '#6D56FA14',
                  },
                  '&:hover .icon-wrapper': {
                    borderColor: currentTab === tab.value ? '#FFFFFF38' : '#6D56FA14',
                    backgroundColor: currentTab === tab.value ? '#FFFFFF1A' : '#6D56FA14',
                  },
                })}>
                <styled.div
                  padding="6px"
                  border="0.5px solid #4141411F"
                  borderRadius="6px"
                  className={
                    currentTab == tab.value
                      ? `${css({
                          borderColor: '#FFFFFF38',
                          backgroundColor: '#FFFFFF1A',
                        })} icon-wrapper`
                      : 'icon-wrapper'
                  }>
                  {tab.icon}
                </styled.div>
                <styled.span fontWeight={'medium'}>{tab.label}</styled.span>
                {tab.newFeature && (
                  <Badge
                    className={css({
                      bg: currentTab === tab.value ? 'white' : '#6D56FA',
                      color: currentTab === tab.value ? '#6D56FA' : 'white',
                    })}>
                    New
                  </Badge>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Box
            className={css({
              margin: '6px',
              shadow: 'md',
              rounded: '22px',
              bg: 'white',
              mt: '26px',
              padding: '12px',
            })}>
            <div>
              {/* Show ChatInput for Classes tab regardless of content type */}
              {currentTab === 'Classes' && (
                <div className={css({ marginBottom: 2 })}>
                  <ChatInput
                    chatId={null}
                    style={{
                      width: '100%',
                      margin: '0',
                    }}
                    placeholder={getPlaceholderText()}
                    inputRef={inputRef}
                  />
                </div>
              )}

              {tabs.map(tab => (
                <Tabs.Content value={tab.value} key={tab.label} overflow="clip" pos="relative" style={{ padding: '0' }}>
                  {tab.content}
                </Tabs.Content>
              ))}
            </div>
          </Box>
        </Tabs.Root>
      </div>
    </Skeleton>
  );
}
