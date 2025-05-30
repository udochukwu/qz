import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { styled, HStack } from 'styled-system/jsx';
import { FolderClosed, MessageCircleMore } from 'lucide-react';
import { useBoolean } from '@/hooks/use-boolean';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { NoFiles } from '@/features/files-pdf-chunks-sidebar/files-manager/components/no-files';
import { FileItem } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/file-item/file-item';
import { Table } from '@/components/elements/table';
import { css } from 'styled-system/css';
import { FilesDrawer } from '@/components/files-drawer';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import NewChatUpload from './new-chat-upload';

interface HomeFilesListProps {
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function HomeFilesList({ inputRef }: HomeFilesListProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: createChat, isLoading: isLoadingCreateChat } = useCreateChat();

  const { data: pendingFileList, isLoading: isLoadingGetFiles, isError, refetch } = useFiles();

  const files = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED) ?? [];

  const drawerState = useBoolean();

  const onSelectFile = ({ workspace_file_id, isSelected }: WorkspaceFile) => {
    // Toggle selection instead of creating chat
    const updatedFiles =
      pendingFileList?.files.map(file => {
        if (file.workspace_file_id === workspace_file_id) {
          return { ...file, isSelected: !isSelected };
        }
        return file;
      }) || [];

    // Update the files in the cache
    queryClient.setQueryData(getFilesQueryKey(), {
      ...pendingFileList,
      files: updatedFiles,
    });

    // Focus the input after file selection
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const onStartChat = () => {
    const selectedFiles = files.filter(file => file.isSelected);
    createChat({ workspace_file_ids: selectedFiles.map(file => file.workspace_file_id) });
  };

  if (isError) {
    return <ErrorRetry error={t('common.error.files')} retry={refetch} />;
  }

  return (
    <>
      {files.length === 0 && (
        <styled.div p="10">
          <NoFiles />
        </styled.div>
      )}

      <styled.div maxHeight="230" overflowY="auto" scrollbarColor="rgba(0, 0, 0, 0.2) transparent" px={1.5}>
        <Table.Root>
          <Table.Body>
            {files.map(file => (
              <FileItem
                file={file}
                key={file.workspace_file_id}
                variant="reduced"
                expandFile={() => onSelectFile(file)}
                expandOn="click"
                isMultiSelectEnabled={true}
                showCreatedAt={false}
                showTranscriptOption={false}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </styled.div>
      <HStack justifyContent="center" mt="19px" mx="20px" mb="20px">
        {files.some(file => file.isSelected) ? (
          <styled.button
            className={css({
              alignItems: 'center',
              fontSize: '16px',
              lineHeight: 'sm',
              px: '4',
              backgroundColor: '#F8F8F9',
              _hover: {
                backgroundColor: 'rgba(26, 12, 108, 0.06)', // New background color on hover
              },
              color: '#3E3C46',
              border: '1px dashed #DCDCDC',
              cursor: 'pointer',
              borderRadius: '12px',
              width: '100%',
              height: '56px',
              display: 'flex',
              fontWeight: 'medium',
              justifyContent: 'center',
              gap: '10px',
            })}
            onClick={onStartChat}>
            <MessageCircleMore color="#3E3C46" />
            <span>&nbsp;{t('common.startChat')}</span>
          </styled.button>
        ) : (
          <styled.button
            className={css({
              alignItems: 'center',
              fontSize: '16px',
              lineHeight: 'sm',
              px: '4',
              backgroundColor: '#F8F8F9',
              _hover: {
                backgroundColor: 'rgba(26, 12, 108, 0.06)', // New background color on hover
              },
              color: '#3E3C46',
              border: '1px dashed #DCDCDC',
              cursor: 'pointer',
              borderRadius: '12px',
              width: '100%',
              height: '56px',
              display: 'flex',
              fontWeight: 'medium',
              justifyContent: 'center',
              gap: '10px',
            })}
            onClick={() => drawerState.setTrue()}>
            <FolderClosed color="#3E3C46" />
            <span>&nbsp;{t('common.viewAll')}</span>
          </styled.button>
        )}
      </HStack>
      <FilesDrawer
        open={drawerState.value}
        onOpenChange={details => {
          details.open ? drawerState.setTrue() : drawerState.setFalse();
        }}
        files={files}
        onSelectFile={onSelectFile}
        showTranscriptOption={false}
      />
    </>
  );
}
