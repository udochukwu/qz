import { WorkspaceFile } from './types';

export interface CRUDFilesPost {
  workspace_id?: string;
  file_id?: string;
  chat_id?: string | null;
}

export interface FileToUploadPost {
  file: File;
  langcode?: string;
}

export interface GetFilesResponse {
  files: WorkspaceFile[];
}

export interface UploadFilePost {
  isPro: boolean;
  file: File;
  payload?: CRUDFilesPost;
  onUploadProgress: (progress: number) => void;
  langcode?: string;
}

export interface UploadFilesResponse {
  message: string;
  upload_url: string;
  status_code: number;
  file_id: string;
  workspace_file_id: string;
  already_registered: boolean;
  blob_already_uploaded: boolean;
}

export interface DeleteFilePost {
  workspace_file_id: string;
  myfiles?: boolean;
  force?: boolean;
}

export interface DeleteFileResponse {
  message: string;
}

export interface AddFilePost {
  workspace_file_id: string;
  filename: string;
  destination_chat_id: string;
  destination_workspace_id: string;
}

export interface AddFileResponse {
  workspace_file_id: string;
}

export interface RenameFilePost {
  workspace_file_id: string;
  new_filename: string;
}

export interface RenameFileResponse {
  message: string;
}

export interface FileMediaRequest {
  workspace_file_id: string;
}

export interface FileMediaResponse {
  external_video_id: string;
  external_media_name: string;
  external_media_metadata: {
    id: string;
    title: string;
    url: string;
    description: string;
    thumbnail: string;
    channel_id: string;
    duration: number;
  };
  type: string;
  subtitles: VideoSubtitle[];
}

export interface VideoSubtitle {
  index: number;
  start: number;
  end: number;
  content: string;
}

export interface ShareFilePost {
  workspace_file_id: string;
}

export type ShareFileResponse = {
  message: string;
  share_id: string;
};

export interface SharePreviewPost {
  share_id: string;
}

export interface GetSharePreviewResponse {
  share_id: string;
  share_type: string;
  share_name: string;
  created_at_utc: string;
}

export interface UnsavedRecording {
  file_id: string;
  workspace_file_id: string;
  filename: string;
  created_at: number;
  last_modified: number;
  url: string;
  length: number;
}
export interface GetUnsavedRecordingsResponse {
  files: UnsavedRecording[];
}
