import { Box, HStack, VStack } from 'styled-system/jsx';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Switch } from '@/components/elements/switch';
import { Table } from '@/components/elements/table';
import { format } from 'date-fns';
import { extractFileName } from '../../../../util/extract-file-name';
import { getFileExtension } from '../../../../util/get-file-extension';
import { styled } from 'styled-system/jsx';
import { FileItemMoreActionsMenu } from './components/file-item-more-actions-menu/file-item-more-actions-menu';
import { CRUDFilesPost, GetFilesResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { SwitchCheckedChangeDetails } from '@ark-ui/react';
import { useFileChatToggle } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-toggle-file';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { FileItemName } from './components/file-item-name';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { useBoolean } from '@/hooks/use-boolean';
import { RenameFileModal } from './components/file-item-more-actions-menu/components/rename-file-modal';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { formatTimeAgo } from '@/utils/formatting-utils';
import { useUserStore } from '@/stores/user-store';
import { css } from 'styled-system/css';
import { useRef, useState } from 'react';
import { ClassesIconList } from './components/classes-icon-list';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { PreviewFile } from './components/preview-file';
import { ShareFileModal } from './components/file-item-more-actions-menu/components/share-file-modal';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/elements/checkbox';
interface Props {
  file: WorkspaceFile;
  crudPayload?: CRUDFilesPost;
  isFileViewToggleEnabled?: boolean;
  isMultiSelectEnabled?: boolean;
  isFilterableByClass?: boolean;
  expandFile: (file: WorkspaceFile) => void;
  expandOn?: 'click' | 'double-click';
  excludeFiles?: CRUDFilesPost;
  variant?: 'reduced' | 'expanded' | 'sidebar';
  showCreatedAt?: boolean;
  showTranscriptOption?: boolean;
}

export const FileItem = ({
  file,
  crudPayload,
  isFileViewToggleEnabled = false,
  isMultiSelectEnabled = false,
  isFilterableByClass = false,
  expandFile,
  excludeFiles,
  variant = 'expanded',
  expandOn = 'double-click',
  showCreatedAt = true,
  showTranscriptOption = true,
}: Props) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const timeUploaded = format(file.created_at * 1000, 'MMM dd, yyyy');

  const fileName = extractFileName(file.filename);

  const fileExtension = getFileExtension(file.filename);

  const fileClassname = file.class_name;

  const fileId = file.workspace_file_id;

  const [isFileEnabled, setIsFileEnabled] = useState(file.enabled);

  const isMultiSelected = file.isSelected;

  const { mutate: toggleFileChat } = useFileChatToggle();
  const isDeleteModalOpen = useBoolean();

  const isRenameModalOpen = useBoolean();

  const isShareModalOpen = useBoolean();

  const { impersonated } = useUserStore();

  const onToggleFileView = (details: SwitchCheckedChangeDetails) => {
    toggleFileChat({ fileId: file.workspace_file_id, enabled: details.checked });
    setIsFileEnabled(details.checked);
  };
  const {
    deleteFileMutation: { mutateAsync: deleteFilePost, isLoading },
  } = useFileDelete({ crudPayload, excludeFiles });

  const deleteFile = async () => {
    await deleteFilePost({ workspace_file_id: fileId });
    isDeleteModalOpen.setFalse();
  };
  const onToggleMultiSelect = (details: SwitchCheckedChangeDetails) => {
    queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
      const prevFiles = prev?.files ?? [];
      return {
        files: prevFiles.map(traversedFile => {
          if (traversedFile.workspace_file_id === file.workspace_file_id) {
            return { ...file, isSelected: details.checked };
          }
          return traversedFile;
        }),
      };
    });
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

  const timeoutId = useRef<number | null>(null);

  const onClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('.stop-propagation')) {
      e.stopPropagation();
      return;
    }
    if (expandOn === 'click') {
      expandFile(file);
      return;
    }
    if (e.detail === 2) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      expandFile(file);
    } else if (e.detail === 1) {
      timeoutId.current = window.setTimeout(() => {
        onToggleMultiSelect({ checked: !isMultiSelected });
      }, 200);
    }
  };
  return (
    <>
      <ShareFileModal fileId={fileId} isOpen={isShareModalOpen.value} setIsOpen={isShareModalOpen.setValue} />
      <RenameFileModal
        fileExt={fileExtension}
        isOpen={isRenameModalOpen.value}
        setIsOpen={isRenameModalOpen.setValue}
        fileId={fileId}
        fileName={fileName}
        excludeFiles={excludeFiles}
      />
      <ConfirmDeleteModal
        isLoading={isLoading}
        name={fileName}
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteFile}
        entityType="file"
      />
      <Table.Row
        onClick={onClick}
        width={'100%'}
        className={variant === 'sidebar' ? sidebarRowStyle : undefined}
        px={4}
        // height={variant == 'reduced' ? '82px' : ''}
        verticalAlign="middle"
        borderColor="#E3E2E6">
        <Table.Cell
          width={'100%'}
          verticalAlign={'middle'}
          className={variant === 'sidebar' ? leftCellRadius : undefined}>
          <HStack textStyle="xs" fontWeight="semibold" alignItems="center">
            {isMultiSelectEnabled && (
              <Box p={4} m={-4}>
                <Checkbox disabled={true} checked={isMultiSelected} borderColor="#D0D5DD" />
              </Box>
            )}
            <FileItemExtension extension={fileExtension} />
            {variant === 'expanded' || variant === 'sidebar' || showCreatedAt == false ? (
              <FileItemName fileName={fileName} variant={variant} />
            ) : (
              <VStack alignItems="flex-start" gap="0.5">
                <FileItemName fileName={fileName} variant={variant} />
                <styled.div textStyle="2xs" fontWeight="normal">
                  {formatTimeAgo(file.created_at, t)}
                </styled.div>
              </VStack>
            )}
          </HStack>
        </Table.Cell>
        {variant === 'expanded' && <Table.Cell textStyle="xs">{timeUploaded}</Table.Cell>}
        {isFilterableByClass && variant !== 'reduced' && (
          <Table.Cell textStyle="xs">{fileClassname && <ClassesIconList classNames={fileClassname} />}</Table.Cell>
        )}
        <Table.Cell
          textStyle="xs"
          className={variant === 'sidebar' ? rightCellRadius : undefined}
          display={'flex'}
          alignItems={'center'}
          // height={variant == 'reduced' ? '82px' : ''}
          justifyContent={variant === 'reduced' ? 'space-between' : 'flex-end'}>
          {isFileViewToggleEnabled && (
            <Switch
              checked={isFileEnabled}
              onCheckedChange={onToggleFileView}
              disabled={impersonated}
              className="stop-propagation"
            />
          )}

          {variant === 'reduced' && fileClassname && <ClassesIconList classNames={fileClassname} />}
          {variant === 'expanded' && (
            <div className="stop-propagation">
              <PreviewFile file={file} expandFile={expandFile} />
            </div>
          )}
          <div className="stop-propagation">
            <FileItemMoreActionsMenu
              variant={variant}
              fileName={fileName}
              fileExt={fileExtension}
              fileId={fileId}
              file={file}
              onShareFileClick={isShareModalOpen.setTrue}
              expandFile={expandFile}
              iconColor="rgba(138, 136, 149, 1)"
              showTranscriptOption={showTranscriptOption}
            />
          </div>
        </Table.Cell>
      </Table.Row>
      {variant === 'sidebar' && <Table.Row h={2} border={0} />}
    </>
  );
};
