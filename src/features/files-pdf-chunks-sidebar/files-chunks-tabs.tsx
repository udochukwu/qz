import { Tabs } from '@/components/elements/tabs';
import { FileManager } from './files-manager';
import ChunksView from './chunks-viewer/chunks-view';
import { css } from 'styled-system/css';
import { FilesChunksTabsEnum, SideBarRoutes, WorkspaceFile } from './types/types';
import useChunksStore from '../chat/stores/chunks-strore';
import { useSideBarRouter } from './hooks/use-side-bar-router';
import { AllFilesManagerImportWorkspace } from './all-files-manager-import-workspace';
import { CRUDFilesPost } from './types/api-types';
import { useBoolean } from '@/hooks/use-boolean';
import useFileStore from './stores/file-store';
import { HStack, styled } from 'styled-system/jsx';
import { ChevronsRightIcon, FolderClosed } from 'lucide-react';
import { Button } from '@/components/elements/button';
import useSideBarStore from '../chat/stores/side-bar-store';
import { getFileExtension } from './files-manager/util/get-file-extension';
import { ReferencesIcon } from './references-icon';
import { FileChangeDetails } from './hooks/files/use-file-upload';
import useGetChatId from '../chat/hooks/use-chatId';
import { useTranslation } from 'react-i18next';

export interface FilesChunksTabsProps {
  activeTab: FilesChunksTabsEnum;
  uploadingController?: {
    uploadFiles: (files: FileChangeDetails) => void;
  };
}
export function FilesChunksTabs({ activeTab, uploadingController }: FilesChunksTabsProps) {
  const { t } = useTranslation();
  const chatId = useGetChatId();
  const all_resource_chunks = useChunksStore(state => state.all_resource_chunks);
  const { changeTab, changeRoute } = useSideBarRouter();
  const setSideBarOpen = useSideBarStore(state => state.setSideBarOpen);

  const crudPayload: CRUDFilesPost = { chat_id: chatId };

  const isImportFilesManagerOpen = useBoolean();

  const setFileData = useFileStore(state => state.setFileData);

  const setChunks = useFileStore(state => state.setChunks);

  const expandFile = (file: WorkspaceFile) => {
    setChunks(null);
    setFileData(file);
    const avExtensions = ['youtube', 'webm', 'mp4', 'mp3', 'wav', 'm4a'];
    if (avExtensions.includes(getFileExtension(file.filename))) {
      changeRoute(SideBarRoutes.VIDEO_VIEW);
    } else {
      changeRoute(SideBarRoutes.FILE_VIEW);
    }
  };

  return (
    <>
      {chatId && (
        <AllFilesManagerImportWorkspace
          crudPayload={crudPayload}
          setIsOpen={isImportFilesManagerOpen.setValue}
          isOpen={isImportFilesManagerOpen.value}
          excludeFiles={chatId ? { chat_id: chatId } : undefined}
        />
      )}
      <HStack pr="15px" height="100vh" pl="15px">
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            height: 'calc(100vh - 30px)',
            width: '100%',
            padding: 5,
            borderRadius: 'xl',
            overflowY: 'hidden',
            border: '1px solid token(colors.gray.4)',
          })}>
          <styled.div flexDirection={'column'}>
            <Button
              variant={'ghost'}
              size={'md'}
              position={'absolute'}
              top={4}
              right={4}
              zIndex={1}
              onClick={() => setSideBarOpen(false)}>
              <ChevronsRightIcon />
            </Button>
          </styled.div>
          <Tabs.Root value={activeTab} onValueChange={e => changeTab(e.value as FilesChunksTabsEnum)}>
            <Tabs.List>
              <Tabs.Trigger value={FilesChunksTabsEnum.FILES} fontWeight={'500'}>
                <FolderClosed color={FilesChunksTabsEnum.FILES === activeTab ? '#6D56FA' : '#15112B80'} />
                <span>{t('common.files')}</span>
              </Tabs.Trigger>
              <Tabs.Trigger value={FilesChunksTabsEnum.CHUNKS} fontWeight={'500'}>
                <ReferencesIcon color={FilesChunksTabsEnum.CHUNKS === activeTab ? '#6D56FA' : '#15112B80'} />
                <span>{t('common.references')}</span>
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value={FilesChunksTabsEnum.CHUNKS} fontWeight={'500'}>
              <ChunksView all_resource_chunks={all_resource_chunks} crudPayload={crudPayload} />
            </Tabs.Content>
            <Tabs.Content value={FilesChunksTabsEnum.FILES}>
              <FileManager
                uploadingController={uploadingController}
                expandFile={expandFile}
                fileListContainerStyles={{ height: '40vh' }}
                crudPayload={crudPayload}
                extensions={{
                  openImportFromCourseGPTEnabled: isImportFilesManagerOpen.setTrue,
                  isFileViewToggleEnabled: true,
                  isFileUploadEnabled: true,
                }}
                variant={'sidebar'}
              />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </HStack>
    </>
  );
}
