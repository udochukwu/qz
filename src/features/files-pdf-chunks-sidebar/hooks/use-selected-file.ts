import { useState } from 'react';
import { CRUDFilesPost } from '../types/api-types';
import { useFiles } from './files/use-files';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../types/types';
import { useUnsavedRecordings } from './files/use-unsaved-recordings';

interface Props {
  crudPayload?: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
}

export const useSelectedFile = (props?: Props) => {
  const { data: pendingFileList } = useFiles({ crudPayload: props?.crudPayload, excludeFiles: props?.excludeFiles });
  const { data: pendingUnsavedRecordings } = useUnsavedRecordings();

  const filteredPendingFiles =
    pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED) ?? [];
  const filteredUnsavedRecordings = pendingUnsavedRecordings?.files ?? [];
  const fileList = [...filteredPendingFiles, ...filteredUnsavedRecordings];

  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);

  // Ensure that the selected file is still in the file list and not deleted
  const displayedFile: WorkspaceFile | undefined = fileList?.find(
    traversedFile => traversedFile.workspace_file_id === selectedFile?.workspace_file_id,
  );

  const clearDisplayedFile = () => {
    setSelectedFile(null);
  };

  return { displayedFile, expandFile: setSelectedFile, clearDisplayedFile, isFileSelected: !!displayedFile };
};
