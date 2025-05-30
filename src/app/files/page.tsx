'use client';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/page-header';
import { useUserStore } from '@/stores/user-store';
import { ClipboardIcon } from 'lucide-react';
import React from 'react';
import { Flex, styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { UploadFiles } from '@/features/files-pdf-chunks-sidebar/files-manager/components/upload-files';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { FileManager } from '@/features/files-pdf-chunks-sidebar/files-manager';
import CustomSplitter from '@/components/custom-splitter';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { useSelectedFile } from '@/features/files-pdf-chunks-sidebar/hooks/use-selected-file';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { PreviewEntireMedia } from '@/features/files-pdf-chunks-sidebar/audio-video-viewer/components/preview-entire-media';
import { PreviewEntireFile } from '@/features/files-pdf-chunks-sidebar/preview-entire-file';
import { Button } from '@/components/elements/button';
// const UploadFiles = dynamic(
//   () =>
//     import('@/features/files-pdf-chunks-sidebar/files-manager/components/upload-files').then(mod => mod.UploadFiles),
//   {
//     ssr: false,
//   },
// );

// const FileManager = dynamic(
//   () => import('@/features/files-pdf-chunks-sidebar/files-manager').then(mod => mod.FileManager),
//   {
//     ssr: false,
//   },
// );

const Files = () => {
  const { t } = useTranslation();
  const crudPayload: CRUDFilesPost = {};
  const { uploadFiles } = useOnUploadFileController({});
  const { expandFile, displayedFile, clearDisplayedFile, isFileSelected } = useSelectedFile();
  const { mutate: createChat } = useCreateChat();
  const { data: filesData } = useFiles();

  const displayFile = (file?: WorkspaceFile) => {
    if (!file) return;
    const avExtensions = ['youtube', 'webm', 'mp4', 'mp3', 'wav', 'm4a'];
    if (avExtensions.includes(getFileExtension(file.filename))) {
      return <PreviewEntireMedia file={file} onClose={clearDisplayedFile} />;
    }
    return <PreviewEntireFile file={file} onClose={clearDisplayedFile} />;
  };

  const onStartChat = () => {
    const selectedFiles = filesData?.files.filter(file => file.isSelected) || [];
    createChat({ workspace_file_ids: selectedFiles.map(file => file.workspace_file_id) });
  };

  const contentWidth = '80%';
  const contentMaxWidth = '900px';
  const isAnyFileSelected = filesData?.files.some(file => file.isSelected) || false;

  return (
    <CustomSplitter isToggleable={{ isToggled: isFileSelected }}>
      <styled.section display="flex" flexDir="column" gap={5} h="100vh" px={'6%'} py={5} w="100%" overflow="auto">
        <PageHeader
          pageName={t('files.pageHeader.title')}
          pageDescription={t('files.pageHeader.description')}
          PageIcon={ClipboardIcon}
          actionButton={
            isAnyFileSelected ? (
              <Button bgColor={'#15112b'} onClick={onStartChat}>
                {t('common.startChat')}
              </Button>
            ) : undefined
          }
        />

        <Flex direction="column" width={contentWidth} maxW={contentMaxWidth} mx="auto" gap={8} flexGrow={1} pb={5}>
          <styled.div>
            <UploadFiles
              uploadFilePayload={crudPayload}
              uploadingController={{
                uploadFiles: ({ acceptedFiles }) => {
                  if (acceptedFiles) {
                    uploadFiles(acceptedFiles, crudPayload);
                  }
                },
              }}
              showFromUploadedFilesOption={false}
              variant="default"
            />
          </styled.div>

          <FileManager
            crudPayload={crudPayload}
            expandFile={expandFile}
            displayUnsavedRecordings={true}
            extensions={{
              isFilterablebyFileType: true,
              isFileUploadEnabled: false,
              isFilterableByClass: true,
              isMultiSelectEnabled: true,
            }}
          />
        </Flex>
      </styled.section>
      {displayFile(displayedFile)}
    </CustomSplitter>
  );
};

export default Files;
