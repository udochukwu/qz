import React from 'react';
import { Dialog } from '@/components/elements/dialog';
import { Stack } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import { IconButton } from '@/components/elements/icon-button';
import { XIcon } from 'lucide-react';
import { useFiles } from '../../../../../hooks/files/use-files';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import toast from 'react-hot-toast';
import { FileManager } from '@/features/files-pdf-chunks-sidebar/files-manager';
import { useSelectedFile } from '@/features/files-pdf-chunks-sidebar/hooks/use-selected-file';
import { PreviewFileDrawer } from './components/preview-file-drawer';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { useTranslation } from 'react-i18next';

interface Props {
  multiSelectConfirm: (workspaceFiles: WorkspaceFile[]) => void;
  multiSelectActionName?: string;
  excludeFiles?: CRUDFilesPost;
  crudPayload?: CRUDFilesPost;
}

export const AllFileBrowsing = ({ multiSelectConfirm, multiSelectActionName, excludeFiles, crudPayload }: Props) => {
  const { t } = useTranslation();

  const { data: pendingFileList, isError, refetch } = useFiles({ excludeFiles });

  const fileList = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED) ?? [];

  const selectedFiles = fileList.filter(file => file.isSelected);

  const isFilesSelected = selectedFiles && selectedFiles.length > 0;

  const onMultiSelectConfirm = () => {
    if (isFilesSelected) {
      multiSelectConfirm(selectedFiles);
    } else {
      toast.error(t('class.workspace.allFileBrowsing.selectFile'));
    }
  };

  const { displayedFile, clearDisplayedFile, expandFile, isFileSelected } = useSelectedFile({
    excludeFiles,
  });

  if (isError) {
    <ErrorRetry error={t('class.workspace.allFileBrowsing.error')} retry={refetch} />;
  }

  return (
    <>
      {displayedFile && (
        <PreviewFileDrawer
          file={displayedFile}
          onClose={clearDisplayedFile}
          open={isFileSelected}
          onOpenChange={openChangeDetails => {
            if (!openChangeDetails.open) {
              clearDisplayedFile();
            }
          }}
        />
      )}
      <Stack gap="8" p="8" h="100%" overflow="hidden">
        <FileManager
          crudPayload={crudPayload}
          expandFile={expandFile}
          fileListContainerStyles={{ height: '400px' }}
          extensions={{
            isMultiSelectEnabled: true,
            isFilterablebyFileType: true,
            isFilterableByClass: true,
          }}
          excludeFiles={excludeFiles}
        />
        <Stack gap="3" direction="row" width="full" alignItems={'stretch'}>
          <Dialog.CloseTrigger asChild>
            <Button variant="outline" flexGrow={1}>
              {t('common.cancel')}
            </Button>
          </Dialog.CloseTrigger>
          <Button onClick={onMultiSelectConfirm} flexGrow={1}>
            {multiSelectActionName} {isFilesSelected && <span>({selectedFiles.length})</span>}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
