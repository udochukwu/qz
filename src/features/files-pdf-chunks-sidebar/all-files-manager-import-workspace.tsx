import React from 'react';
import { AllFilesManagerModal } from './all-files-manager-modal/all-files-manager-modal';
import { CRUDFilesPost } from './types/api-types';
import { useAddFile } from './hooks/files/use-add-file';
import { WorkspaceFile } from './types/types';

interface Props {
  isOpen?: boolean;
  setIsOpen: (val: boolean) => void;
  crudPayload: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
}

export const AllFilesManagerImportWorkspace = ({ isOpen, setIsOpen, excludeFiles, crudPayload }: Props) => {
  const { addAllFiles, isLoading } = useAddFile();

  const onAddAllFiles = (files: WorkspaceFile[]) => {
    addAllFiles(
      { files, crudPayload },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <AllFilesManagerModal
      crudPayload={crudPayload}
      isOpen={isOpen}
      excludeFiles={excludeFiles}
      setIsOpen={setIsOpen}
      multiSelectConfirm={onAddAllFiles}
      isLoading={isLoading}
    />
  );
};
