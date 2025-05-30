//AudioFilePayload, AudioFileResponse

export interface AudioFilePayload {
  filename: string;
  file_type: string;
}

export interface AudioFileResponse {
  message: string;
  status_code: number;
  file_id: string;
  workspace_file_id: string;
  upload_url: string;
}

export interface IngestAudioPayload {
  file_id: string;
  filename: string;
  length: number;
  workspace_id?: string;
  langcode?: string;
}

export interface IngestAudioResponse {
  message: string;
  success: boolean;
  status_code: number;
  file_id: string;
  filename: string;
  workspace_file_id: string;
  workspace_id?: string;
}
