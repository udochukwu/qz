import { Box, Flex, HStack, VStack } from 'styled-system/jsx';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Table } from '@/components/elements/table';
import { format } from 'date-fns';
import { extractFileName } from '../../../../util/extract-file-name';
import { getFileExtension } from '../../../../util/get-file-extension';
import { styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { CRUDFilesPost, UnsavedRecording } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { Portal } from '@ark-ui/react';
import { Checkbox } from '@/components/elements/checkbox';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { useBoolean } from '@/hooks/use-boolean';
import { RefreshCcw, Trash2Icon } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useUserStore } from '@/stores/user-store';
import { css } from 'styled-system/css';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { PreviewFile } from './components/preview-file';
import PlaybackConfirmView from '@/features/chat/components/new-chat-view/components/classes-files-browser/record/playback-confirm-view';
import { useIngestAudio } from '@/features/chat/components/new-chat-view/components/classes-files-browser/record/hooks/use-ingest-audio';
import { IngestAudioPayload } from '@/features/chat/components/new-chat-view/components/classes-files-browser/record/types';
import { Dialog } from '@/components/elements/dialog';
import { useTranslation } from 'react-i18next';

interface Props {
  recording: UnsavedRecording;
  crudPayload?: CRUDFilesPost;
  isFileViewToggleEnabled?: boolean;
  isMultiSelectEnabled?: boolean;
  expandFile: (file: WorkspaceFile) => void;
  expandOn?: 'click' | 'double-click';
  excludeFiles?: CRUDFilesPost;
  variant?: 'reduced' | 'expanded' | 'sidebar';
}

export const UnsavedRecordingItem = ({
  recording,
  crudPayload,
  isFileViewToggleEnabled = false,
  isMultiSelectEnabled = false,
  expandFile,
  excludeFiles,
  variant = 'expanded',
  expandOn = 'double-click',
}: Props) => {
  const { t } = useTranslation();
  const timeUploaded = format(recording.created_at, 'MMM dd, yyyy');
  const fileName = extractFileName(recording.filename);
  const fileExtension = getFileExtension(recording.filename);
  const isDeleteModalOpen = useBoolean();
  const isReingestModalOpen = useBoolean();
  const { impersonated } = useUserStore();

  const {
    deleteFileMutation: { mutateAsync: deleteFilePost, isLoading },
  } = useFileDelete({ crudPayload, excludeFiles });

  const deleteFile = async () => {
    // NOTE: Unsaved recordings are considered as inactive files (i.e. deleted), force=true is used to explicitly hide the file from the user.
    await deleteFilePost({ workspace_file_id: recording.workspace_file_id, force: true });
    isDeleteModalOpen.setFalse();
  };

  const sidebarRowStyle = css({
    border: 'none',
    backgroundColor: '#f5f5f6',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    height: '60px',
  });
  const leftCellRadius = css({
    borderTopLeftRadius: 'md',
    borderBottomLeftRadius: 'md',
  });
  const rightCellRadius = css({
    borderTopRightRadius: 'md',
    borderBottomRightRadius: 'md',
  });

  const formatSeconds = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const getAudioBlob = async () => {
    return await fetch(recording.url).then(r => r.blob());
  };

  return (
    <>
      <ConfirmDeleteModal
        isLoading={isLoading}
        name={fileName}
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteFile}
        entityType="file"
      />
      <Table.Row width={'100%'} className={variant === 'sidebar' ? sidebarRowStyle : undefined}>
        <Table.Cell
          width={'100%'}
          verticalAlign={'middle'}
          className={variant === 'sidebar' ? leftCellRadius : undefined}>
          <HStack textStyle="xs" fontWeight="semibold" alignItems="center">
            {/* no-op : placed for alignment purposes */}
            {isMultiSelectEnabled && (
              <Box p={4} m={-4}>
                <Checkbox visibility="hidden" />
              </Box>
            )}
            <FileItemExtension extension={fileExtension} />
            <styled.div textStyle="xs" display="flex" justifyContent="flex-start" textAlign="left" alignItems="center">
              <styled.span color={'#FF0D0D'} pb={0} fontSize={'xs'} display="flex" gap="2.5" alignItems="center">
                <styled.div>{formatSeconds(recording.length)}</styled.div>
                <styled.div
                  rounded="full"
                  backgroundColor={'#FF0D0D08'}
                  px={2}
                  py={1}
                  fontSize={'xs'}
                  textAlign="center">
                  {t('files.list.recording.unsaved.recover')}
                </styled.div>
              </styled.span>
            </styled.div>
          </HStack>
        </Table.Cell>

        {variant === 'expanded' && (
          <Table.Cell textStyle="xs" color={'#FF0D0D'}>
            {timeUploaded}
          </Table.Cell>
        )}
        {/* Placeholder for classes */}
        <Table.Cell></Table.Cell>
        {/* Placeholder for classes */}
        <Table.Cell
          textStyle="xs"
          className={variant === 'sidebar' ? rightCellRadius : undefined}
          display={'flex'}
          alignItems={'center'}
          justifyContent={variant === 'reduced' ? 'space-between' : 'flex-end'}>
          <div className="stop-propagation">
            <Dialog.Root
              lazyMount
              unmountOnExit
              open={isReingestModalOpen.value}
              onOpenChange={e => isReingestModalOpen.setValue(e.open)}>
              <Dialog.Trigger>
                <IconButton variant="ghost" onClick={isReingestModalOpen.setTrue}>
                  <RefreshCcw size={18} color={'#FF0D0D'} />
                </IconButton>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <PlaybackConfirmView
                      audioBlob={getAudioBlob}
                      file_id={recording.file_id}
                      workspace_file_id={recording.workspace_file_id}
                      onDelete={deleteFile}
                    />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </div>
          <div className="stop-propagation">
            <IconButton variant="ghost" onClick={isDeleteModalOpen.setTrue}>
              <Trash2Icon size={18} color={'#FF0D0D'} />
            </IconButton>
          </div>
        </Table.Cell>
      </Table.Row>
      {/* Separator */}
      {variant === 'sidebar' && <Table.Row h={2} border={0} />}
    </>
  );
};
