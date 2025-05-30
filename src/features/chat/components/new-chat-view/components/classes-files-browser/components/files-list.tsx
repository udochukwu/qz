import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import RecentClassesFilesList from './recent-classes-files-list';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { NewChatBrowserFooter } from './new-chat-browser-footer';
import { HStack } from 'styled-system/jsx';
import { FileTextIcon } from 'lucide-react';
import { AllFilesManagerModal } from '@/features/files-pdf-chunks-sidebar/all-files-manager-modal/all-files-manager-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { useTranslation } from 'react-i18next';

interface Props {
  onAddFile: VoidFunction;
}

export default function FilesList({ onAddFile }: Props) {
  const { t } = useTranslation();

  const { mutate: createChat, isLoading: isLoadingCreateChat } = useCreateChat();

  const { data: pendingFileList, isLoading: isLoadingGetFiles, isError, refetch } = useFiles();

  const isFileBrowserOpen = useBoolean();

  const files = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED) ?? [];

  const onSelectFile = ({ workspace_file_id }: WorkspaceFile) => {
    createChat({ workspace_file_ids: [workspace_file_id] });
  };

  const createChatWithMultipleFiles = (files: WorkspaceFile[]) => {
    const fileIds = files.map(file => file.workspace_file_id);
    createChat({ workspace_file_ids: fileIds });
  };

  if (isError) {
    return <ErrorRetry error={t('common.error.files')} retry={refetch} />;
  }

  return (
    <>
      <AllFilesManagerModal
        isLoading={isLoadingCreateChat}
        multiSelectConfirm={createChatWithMultipleFiles}
        isOpen={isFileBrowserOpen.value}
        setIsOpen={isFileBrowserOpen.setValue}
        multiSelectActionName={t('common.startChat')}
      />
      <RecentClassesFilesList
        items={files}
        createText={t('common.addFile')}
        createAction={onAddFile}
        emptyState="No files added yet"
        isLoading={isLoadingGetFiles}
        onItemSelect={onSelectFile}
        itemRenderer={(workspaceFile: WorkspaceFile) => {
          return (
            <HStack>
              <FileTextIcon size={'16px'} color={'#73726F'} style={{ marginRight: 2, flexShrink: 0 }} />
              <span>{workspaceFile.filename}</span>
            </HStack>
          );
        }}
      />
      <NewChatBrowserFooter
        onBrowse={isFileBrowserOpen.setTrue}
        onCreate={onAddFile}
        createText={t('common.addFile')}
        browseText="Browse all Files"
      />
    </>
  );
}
