import { styled } from 'styled-system/jsx';
import FlashcardFiles from './flashcard-files';
import { CRUDFilesPost, GetFilesResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { CSSProperties, useEffect, useState } from 'react';
import { WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { useQueryClient } from 'react-query';
import UploadYoutubeButton from '@/features/upload-youtube/components/UploadYoutubeButton';
import { FileUpload } from '@/components/elements/file-upload';
import { ACCEPTED_FILE_TYPES } from '@/features/files-pdf-chunks-sidebar/consts/accepted-files';
import { useUserStore } from '@/stores/user-store';
import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from 'react-i18next';
import { HStack, VStack } from 'styled-system/jsx';
import { Select } from '@/components/elements/select';
import { PlusIcon, LaptopIcon } from 'lucide-react';
import { useNewFlashcardsWithPendingFiles } from '@/features/chat/hooks/use-new-flashcards-with-pending-files';
import { Modal } from '@/components/modal/modal';
import { Dialog } from '@/components/elements/dialog';
import UploadActionBox from '@/components/upload-action-box';
import { css } from 'styled-system/css';
import { useQuizViewStore } from '@/features/quiz/stores/quiz-view-store';

interface Props {
  crudPayload?: CRUDFilesPost;
  fileListContainerStyles?: CSSProperties;
  extensions?: {
    isFileUploadEnabled?: boolean;
    openImportFromCourseGPTEnabled?: VoidFunction;
    isFilterablebyFileType?: boolean;
    isFileViewToggleEnabled?: boolean;
    isMultiSelectEnabled?: boolean;
    isFilterableByClass?: boolean;
    isYoutubeUploadEnabled?: boolean;
  };
  excludeFiles?: CRUDFilesPost;
}

export default function FilesSection({ crudPayload, extensions, fileListContainerStyles, excludeFiles }: Props) {
  const { data: pendingFileList, isLoading } = useFiles({ crudPayload, excludeFiles });
  const fileList = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED);
  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);
  const { t } = useTranslation();
  const { impersonated } = useUserStore();
  const isSelectMenuOpen = useBoolean(false);
  const [isUploadedFilesModalOpen, setIsUploadedFilesModalOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const { uploadFiles: uploadFlashcardsFiles } = useNewFlashcardsWithPendingFiles();
  const { open: openQuizView } = useQuizViewStore();
  const queryClient = useQueryClient();

  const UnstuckLogoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.03206 11C0.869334 6.1796 1.16856 1 5.73472 1C9.53238 1 10.5263 4.15352 10.5082 6.44069C10.454 7.96849 9.91374 10.4311 8.33856 10.4311C6.5 10.4311 5.06481 1.07081 14.6539 2.69834"
        stroke="#15112B"
        strokeOpacity="0.9"
        strokeWidth="1.72407"
      />
    </svg>
  );

  useEffect(
    function unselectAllFiles() {
      if (isLoading) return;
      queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        return {
          files: prevFiles.map(traversedFile => {
            return { ...traversedFile, isSelected: false };
          }),
        };
      });
    },
    [isLoading],
  );

  useEffect(() => {}, [pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED)]);

  const handleOpenUploadedFilesModal = () => {
    setIsUploadedFilesModalOpen(true);
    isSelectMenuOpen.setValue(false);
  };

  const renderUploadMenu = () => (
    <Select.Root
      w={'70%'}
      positioning={{ sameWidth: true }}
      open={isSelectMenuOpen.value}
      onOpenChange={details => isSelectMenuOpen.setValue(details.open)}
      items={['From Computer', 'From Uploaded Files', 'From Youtube']}>
      <Select.Control>
        <Select.Trigger
          borderRadius="12px"
          w="fit-content"
          height="43px"
          backgroundColor="white"
          py="12px"
          px="10px"
          border="1px solid #4141410D"
          shadow="md"
          color="black"
          className={`file-manager ${css({
            '& svg': { color: 'black' },
            '&:hover svg': {
              color: '#6D56FA',
            },
          })}`}
          _hover={{ color: '#6D56FA', backgroundColor: '#6D56FA1F' }}
          onClick={event => event.stopPropagation()}>
          <HStack gap="10px" display="inline-flex">
            <PlusIcon size={18} />
            <Select.ValueText
              textStyle="sm"
              fontSize="15.38px"
              placeholder={t('chat.dragToUpload.select.placeholder')}
              textAlign="center"
              fontWeight="500"
            />
          </HStack>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup id="uploads">
            <FileUpload.Trigger asChild onClick={e => e.stopPropagation()}>
              <Select.Item fontSize={'xs'} key={'From Computer'} item={'item'} w={'100%'}>
                <HStack gap={2}>
                  <LaptopIcon color="rgba(21, 17, 43, 0.9)" size={18} />
                  <Select.ItemText textAlign="start">{t('chat.dragToUpload.select.computer')}</Select.ItemText>
                </HStack>
              </Select.Item>
            </FileUpload.Trigger>
            <Select.Item
              fontSize={'xs'}
              key={'From Uploaded Files'}
              item={'item2'}
              w={'100%'}
              onClick={handleOpenUploadedFilesModal}>
              <HStack gap={2}>
                <UnstuckLogoIcon />
                <Select.ItemText fontSize={'xs'} whiteSpace={'nowrap'} textAlign="start">
                  {t('chat.dragToUpload.select.files')}
                </Select.ItemText>
              </HStack>
            </Select.Item>
            {extensions?.isYoutubeUploadEnabled && <UploadYoutubeButton variant="sidebar" disabled={impersonated} />}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );

  return (
    <styled.div>
      {extensions?.isFileUploadEnabled && (
        <FileUpload.Root
          disabled={impersonated}
          onFileChange={acceptedFiles => {
            setUploadKey(prev => prev + 1);
            uploadFlashcardsFiles(acceptedFiles.acceptedFiles);
          }}
          maxFiles={20}
          accept={ACCEPTED_FILE_TYPES}
          bgColor={'white'}
          borderRadius={12}
          key={uploadKey}>
          <UploadActionBox
            title={`${t('landing.uploadWizard.fileUpload.forFlashcards.title.click')}|${t('landing.uploadWizard.fileUpload.forFlashcards.title.dragAndDrop')}`}
            description={t('chat.fileUpload.description_flashcards')}
            buttonText={t('chat.dragToUpload.select.placeholder')}
            buttonIcon={<PlusIcon size={18} />}
            onClick={() => {
              openQuizView('flashcards');
            }}
            additionalContent={
              <img src="/images/action-box-thumbnails/flashcards.jpg" alt="flashcards" width={120} height={120} />
            }>
            <FileUpload.Dropzone display={'none'} />
          </UploadActionBox>
          <FileUpload.HiddenInput />
        </FileUpload.Root>
      )}
      {/* Modal for showing uploaded files */}
      <Modal height="600px" width="600px" isOpen={isUploadedFilesModalOpen} onOpenChange={setIsUploadedFilesModalOpen}>
        <Dialog.Title pt={'24px'} pb={0} px={11} fontSize={'22px'}>
          From your files
        </Dialog.Title>
        <styled.hr m={'0px'} />
        <styled.div px={4}>
          <FlashcardFiles
            isFilterablebyFileType={true}
            isFilterableByClass={true}
            files={fileList}
            isLoading={isLoading}
            fileListContainerStyles={fileListContainerStyles}
          />
        </styled.div>
      </Modal>
    </styled.div>
  );
}
