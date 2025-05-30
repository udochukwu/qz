import { UploadingWorkspaceFile } from '../../types/types';

export function getPendingFilesArray(inprogressFiles: Record<string, UploadingWorkspaceFile[]>) {
  const filesArray = Object.values(inprogressFiles)?.reduce((prev, cur) => {
    if (!prev) {
      return [...cur];
    }
    return [...prev, ...cur];
  }, []);

  const files = filesArray.filter(file => !file?.isHiddenFromPendingWindowView);
  return files;
}
