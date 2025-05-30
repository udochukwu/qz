export enum SideBarRoutes {
  FILE_VIEW = 'file-view',
  FILE_CHUNKS_ROUTE = 'file-chunks-route',
  VIDEO_VIEW = 'video-view',
}

export enum FilesChunksTabsEnum {
  FILES = 'files',
  VIDEOS = 'videos',
  CHUNKS = 'chunks',
}

export interface WorkspaceFile {
  filename: string;
  created_at: number;
  workspace_file_id: string;
  last_modified: number;
  url: string;
  workspace_id?: string;
  uploadingFile?: UploadingWorkspaceFile;
  isSelected?: boolean;
  enabled?: boolean;
  class_name?: string[];
  path?: string;
  sha256?: string;
  status?: WorkspaceFileUploadStatus;
  completion_percentage?: number;
  inprogressId?: string;
  user_shown_error?: string;
}

export interface UploadingWorkspaceFile {
  file: File;
  id: string;
  status: WorkspaceFileUploadStatus;
  progress?: number;
  timeCompleted?: number;
  isVideo?: boolean;

  isHiddenFromPendingWindowView?: boolean;
}

export enum WorkspaceFileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'in progress',
  FINISHED = 'finished',
  FAILED = 'failed',
}
