import { Dict } from 'styled-system/types';

export interface DocumentChunkProps {
  page_number: number;
  page_height: number;
  page_width: number;
  coordinates: {
    top_left_x: number;
    top_left_y: number;
    width: number;
    height: number;
  };
  has_image: boolean;
  has_table: boolean;
  has_new_line_equation: boolean;
  image_metadata_list: any[];
  document_metadata: any;
}

export interface SubtitleChunkProps {
  video_url?: string;
  video_thumbnail_url?: string;
  start_time: number;
  end_time: number;
  video_metadata?: any;
}

export interface ResourceChunk {
  chunk: string;
  chunk_id: string;
  ws_file_name: string;
  ws_file_id: string;
  file_url: string;
  workspace_file_id: string;
  chunk_type: 'text' | 'image' | 'subtitle';
  metadata: DocumentChunkProps | SubtitleChunkProps;
}

export const isSubtitleChunk = (
  chunk: ResourceChunk,
  metadata: DocumentChunkProps | SubtitleChunkProps,
): metadata is SubtitleChunkProps => {
  return chunk.chunk_type === 'subtitle';
};

export const isDocumentChunk = (
  chunk: ResourceChunk,
  metadata: DocumentChunkProps | SubtitleChunkProps,
): metadata is DocumentChunkProps => {
  return chunk.chunk_type === 'text';
};

export interface DownloadFile {
  workspace_file_id: string;
  filename: string;
  url: string;
}
export type ErrorResponse<T = string> = {
  response: {
    data: {
      detail: T;
      status: number;
    };
  };
};

export enum AuthorTypes {
  USER = 'user',
  AI = 'ai',
}

export enum TemporaryMessageIds {
  AI = 'TEMP_AI_MESSAGE_ID',
}
export enum MessageStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  STOPPED = 'stopped',
  SENDING = 'sending',
  NEEDS_PRO = 'needs_pro',
}
export interface ChatMessageProps {
  message_id: string;
  message: string;
  parent_message_id: string | null;
  children: string[];
  created_at: number;
  siblings_node_ids?: string[];
  author: {
    name: string;
    type: AuthorTypes;
  };
  status: MessageStatus;
  resource_chunks?: ResourceChunk[];
  copilot?: CopilotData;
  isStreaming?: boolean;
}

export enum CopilotActionType {
  QUERY = 'query',
  FILE = 'file',
}
//TODO: When it's a file type meta data will have ext and extensions can be: .pdf | .docx | .youtube | .pptx | .ppt

export interface CopilotAction {
  title: string;
  icon: string;
  metadata: any; //for now we will keep it as any
  type: CopilotActionType;
}

export interface CopilotSubStep {
  title: string;
  actions: CopilotAction[];
}

export interface CopilotStep {
  title: string;
  substeps: CopilotSubStep[];
  isCompleted: boolean;
}

export interface CopilotData {
  steps: CopilotStep[];
  state: 'in_progress' | 'completed';
}

export interface ResourceChunkWithMessageId {
  message_id: string;
  resource_chunks: ResourceChunk[];
}
export interface ChatHistoryMessagesProps {
  messages: ChatMessageProps[];
  workspace_id: string;
  chat_title: string;
  is_class_chat: boolean;
  number_of_files: number;
  chat_desc: string;
  pro_required: boolean;
}

export interface UnassignedChatHistoryProps {
  chat_id: string;
  description: string;
  last_message_at: string;
}

export interface ClassWorkSpaceHistoryProps {
  class_name: string;
  workspace_id: string;
  chats: UnassignedChatHistoryProps[];
}

export interface RecentChatHistoryProps {
  class_name?: string;
  workspace_id?: string;
  chat_id: string;
  description: string;
  last_message_at: string;
}

export interface SideBarProps {
  workspace_chats: ClassWorkSpaceHistoryProps[];
  unassigned_chats: UnassignedChatHistoryProps[];
}

export interface WorkspaceClass {
  class_name: string;
  created_at: number;
  updated_at: number;
  workspace_id: string;
  number_of_files: number;
}

export interface ClassesListProps {
  classes: WorkspaceClass[];
}

export interface TooltipsProps {
  tooltips: Dict;
}

export interface SetTooltipParams {
  guideId: string;
  showTooltip: boolean;
}

export interface SelectedNode {
  message_id: string | null;
  selected_child?: string;
}
export type ReasonType =
  | 'message-limit'
  | 'flashcard-limit'
  | 'quiz-limit'
  | 'recording-limit'
  | 'document-limit'
  | 'youtube-limit'
  | 'chat-header'
  | 'menu-bar'
  | 'onboarding'
  | 'quiz-unlimited-questions-reached'
  | 'hard-country-paywall';
