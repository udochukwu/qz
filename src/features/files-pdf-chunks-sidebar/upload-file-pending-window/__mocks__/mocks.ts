import { uuid4 } from '@sentry/utils';
import { UploadingWorkspaceFile, WorkspaceFileUploadStatus } from '../../types/types';

const createMockFile = (name: string, size: number, type: string): File => {
  return new File([new Blob([new ArrayBuffer(size)])], name, { type });
};

// Example placeholder mock objects
const mockFile1: UploadingWorkspaceFile = {
  id: uuid4(),
  file: createMockFile('document1.pdf', 102400, 'application/pdf'),
  status: WorkspaceFileUploadStatus.FINISHED,
  progress: 0,
};

const mockFile2: UploadingWorkspaceFile = {
  id: uuid4(),
  file: createMockFile('image1.jpg', 204800, 'image/jpeg'),
  status: WorkspaceFileUploadStatus.UPLOADING,
  progress: 50,
};

const mockFile3: UploadingWorkspaceFile = {
  id: uuid4(),
  file: createMockFile('video1.mp4', 1048576, 'video/mp4'),
  status: WorkspaceFileUploadStatus.FINISHED,
  timeCompleted: Date.now(),
  progress: 100,
};

const mockFile4: UploadingWorkspaceFile = {
  id: uuid4(),
  file: createMockFile('archive1.pdf', 512000, 'application/pdf'),
  status: WorkspaceFileUploadStatus.FAILED,
  progress: 54,
};

const mockFile5: UploadingWorkspaceFile = {
  id: uuid4(),
  file: createMockFile('archive13333.pdf', 512000, 'application/pdf'),
  status: WorkspaceFileUploadStatus.UPLOADING,
  progress: 54,
};

const MOCK_FILES: UploadingWorkspaceFile[] = [mockFile1, mockFile2, mockFile3, mockFile4, mockFile5];
