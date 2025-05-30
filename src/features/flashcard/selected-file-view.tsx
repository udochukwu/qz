'use client';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { FileView } from './file-view';
import { WorkspaceNotFound } from '@/features/class/components/selected-workspace-view/components/workspace-not-found';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { LoadingScreen } from '@/features/user-feedback/loading-screen';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import GeneratingFlashcardLoader from '@/features/flashcard/components/generating-flashcard-loader';
import { motion } from 'framer-motion';

interface Props {
  selectedFileId: string;
}

export const SelectedFileView = ({ selectedFileId }: Props) => {
  const { t } = useTranslation();
  const { data: fileList, isLoading, isError, refetch } = useFiles();
  const [hasFoundFile, setHasFoundFile] = useState(false);
  const file = fileList?.files.find(f => f.workspace_file_id === selectedFileId);

  useEffect(() => {
    if (file) {
      // This way when it switches from uploading to uploaded (i noticed there's a gap) it won't say file missing
      setHasFoundFile(true);
    }
  }, [file]);

  if (isError) {
    return <ErrorRetry error={t('class.workspace.error', { count: 1 })} retry={refetch} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (file?.status === WorkspaceFileUploadStatus.UPLOADING) {
    return (
      <styled.section w="100%" h="100vh" bgColor="#F8F8F8" overflow="hidden">
        <styled.div display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <GeneratingFlashcardLoader customText={t('files.pdf.upload.singular')} />
        </styled.div>
      </styled.section>
    );
  }

  return (
    <styled.section w="100%" h="100vh" bgColor="#F8F8F8" overflow="hidden">
      {file?.workspace_file_id ? (
        <FileView fileId={selectedFileId} selelectedFilename={file.filename} />
      ) : (
        !hasFoundFile && <WorkspaceNotFound />
      )}
    </styled.section>
  );
};
