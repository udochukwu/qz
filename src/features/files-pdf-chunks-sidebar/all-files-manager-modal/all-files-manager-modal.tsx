'use client';

import React from 'react';
import { WorkspaceFile } from '../types/types';
import { AllFilesManagerContent } from './components/all-files-manager-content/all-files-manager-content';
import { CRUDFilesPost } from '../types/api-types';
import { Modal } from '@/components/modal/modal';

interface Props {
  multiSelectConfirm: (workspaceFiles: WorkspaceFile[]) => void;
  multiSelectActionName?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  setIsOpen: (val: boolean) => void;
  excludeFiles?: CRUDFilesPost;
  crudPayload?: CRUDFilesPost;
}

export const AllFilesManagerModal = ({
  multiSelectActionName = 'Import',
  multiSelectConfirm,
  isLoading = false,
  isOpen = false,
  setIsOpen,
  excludeFiles,
  crudPayload,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} width="800px" contentProps={{ overflow: 'clip' }}>
      <AllFilesManagerContent
        multiSelectConfirm={multiSelectConfirm}
        isLoading={isLoading}
        excludeFiles={excludeFiles}
        crudPayload={crudPayload}
        multiSelectActionName={multiSelectActionName}
      />
    </Modal>
  );
};
