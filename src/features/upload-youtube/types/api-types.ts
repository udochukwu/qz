import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';

export interface IngestVideoPost extends CRUDFilesPost {
  video_url: string;
}

export interface IngestVideoResponse {
  workspace_file_id: string;
  external_video_id: string;
  external_media_name: string;
  status_text: string;
  status_code: number;
}
