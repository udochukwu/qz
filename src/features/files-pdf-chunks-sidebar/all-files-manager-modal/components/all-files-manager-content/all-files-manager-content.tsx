import { SpinningIcon } from '@/components/spinning-icon';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import React from 'react';
import { VStack } from 'styled-system/jsx';
import { AllFileBrowsing } from './components/all-file-browsing/all-file-browsing';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';

interface Props {
  multiSelectConfirm: (workspaceFiles: WorkspaceFile[]) => void;
  multiSelectActionName?: string;
  isLoading?: boolean;
  excludeFiles?: CRUDFilesPost;
  crudPayload?: CRUDFilesPost;
}

export const AllFilesManagerContent = ({
  multiSelectConfirm,
  isLoading,
  multiSelectActionName,
  excludeFiles,
  crudPayload,
}: Props) => {
  if (isLoading) {
    return (
      <VStack
        w="100%"
        h="100%"
        justify="center"
        alignItems="center"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0">
        <SpinningIcon />
      </VStack>
    );
  }

  return (
    <AllFileBrowsing
      multiSelectConfirm={multiSelectConfirm}
      multiSelectActionName={multiSelectActionName}
      excludeFiles={excludeFiles}
      crudPayload={crudPayload}
    />
  );
};
