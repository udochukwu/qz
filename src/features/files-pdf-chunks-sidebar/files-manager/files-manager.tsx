'use client';
import React, { CSSProperties, useEffect } from 'react';
import { FilesList } from './components/files-list/files-list';
import { CRUDFilesPost, GetFilesResponse } from '../types/api-types';
import { useFiles } from '../hooks/files/use-files';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '../utils/get-files-query-key';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../types/types';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { FileChangeDetails } from '../hooks/files/use-file-upload';
import { useUnsavedRecordings } from '../hooks/files/use-unsaved-recordings';
import { useTranslation } from 'react-i18next';

interface Props {
  crudPayload?: CRUDFilesPost;
  fileListContainerStyles?: CSSProperties;
  expandFile: (file: WorkspaceFile) => void;
  displayUnsavedRecordings?: boolean;
  extensions?: {
    isFileUploadEnabled?: boolean;
    openImportFromCourseGPTEnabled?: VoidFunction;
    isFilterablebyFileType?: boolean;
    isFileViewToggleEnabled?: boolean;
    isMultiSelectEnabled?: boolean;
    isFilterableByClass?: boolean;
  };
  excludeFiles?: CRUDFilesPost;
  uploadingController?: {
    uploadFiles: (files: FileChangeDetails) => void;
  };
  variant?: 'default' | 'sidebar';
}

export function FileManager({
  crudPayload,
  extensions,
  fileListContainerStyles,
  expandFile,
  excludeFiles,
  uploadingController,
  displayUnsavedRecordings,
  variant = 'default',
}: Props) {
  const { t } = useTranslation();

  const { data: pendingFileList, isLoading, isError, refetch } = useFiles({ crudPayload, excludeFiles });
  const { data: pendingUnsavedRecordings } = useUnsavedRecordings();

  const fileList = pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED);
  const unsavedRecordings = displayUnsavedRecordings ? pendingUnsavedRecordings?.files : [];

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const queryClient = useQueryClient();

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

  if (isError) {
    return <ErrorRetry error={t('class.workspace.allFileBrowsing.error')} retry={refetch} />;
  }

  return (
    <FilesList
      uploadingController={uploadingController}
      crudPayload={crudPayload}
      isFilterablebyFileType={extensions?.isFilterablebyFileType}
      isFileViewToggleEnabled={extensions?.isFileViewToggleEnabled}
      isMultiSelectEnabled={extensions?.isMultiSelectEnabled}
      isFilterableByClass={extensions?.isFilterableByClass}
      files={fileList}
      unsavedRecordings={unsavedRecordings}
      excludeFiles={excludeFiles}
      expandFile={expandFile}
      isFileUploadEnabled={extensions?.isFileUploadEnabled}
      openImportFromCourseGPTEnabled={extensions?.openImportFromCourseGPTEnabled}
      isLoading={isLoading}
      fileListContainerStyles={fileListContainerStyles}
      variant={variant}
    />
  );
}
