import { ChatMessageProps } from '@/types';

export interface StopStreamingPost {
  message_id: string;
}

export interface StopStreamResponse {
  message: string;
  message_id: string;
}
export enum FeedbackType {
  NESTED = 'NESTED',
  NOT_NESTED = 'NOT_NESTED',
}
export enum FeedbackQuestionType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  OPEN_ENDED = 'OPEN_ENDED',
}
export interface FeedbackQuestion {
  question: string;
  type: FeedbackQuestionType;
  options?: string[];
}
export interface FeedbackData {
  type: FeedbackType;
  id: string;
  questions: FeedbackQuestion[];
}

export interface SubmitFeedbackParams {
  feedback_form_id: string;
  response: string[];
}

export interface class_title_params {
  chat_name: string;
  chat_desc: string;
  is_class_chat: boolean;
  number_of_files: number;
  workspace_id: string;
}
export interface UseSendNewMessageResponse {
  onMessageSend: (
    message: string,
    chatId: string,
    parent_message_id: string | null,
    message_id: string,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => Promise<void>;
  regenerateQuestion: (
    question: string,
    chatId: string,
    parent_message_id: string | null,
    message_id: string,
    failed_message_id: string,
  ) => Promise<void>;
}

export type ShareChatPost = {
  chat_id: string;
  include_messages: boolean;
};
export type ShareChatResponse = {
  message: string;
  share_id: string;
};

export type MessageSuggestion = {
  message: string;
  suggestion_type: MessageSuggestionType;
  suggestion_id?: string;
  file_id?: string;
};

export type CompactFileSuggestion = {
  suggestion_id: string;
  file_id: string;
};

export type CompactSuggestion = {
  suggestion_id: string;
};

export enum MessageSuggestionType {
  DEFAULT = 'default',
  FILE = 'file',
  WORKSPACE = 'workspace',
  CONVERSATION = 'conversation',
}

export enum FeedbackReactionType {
  VERY_SATISFIED = 'very_satisfied',
  SATISFIED = 'satisfied',
  NEUTRAL = 'neutral',
  DISAPPOINTED = 'disappointed',
  VERY_DISAPPOINTED = 'very_disappointed',
}

export type Reason = {
  id: number;
  label: string;
};

export interface PlaylistVideo {
  video_id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  playlist_title?: string;
}

export interface ChatInputProps {
  chatId: string | null;
  parent_message_id?: string | null;
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  onHandleSendReady?: (
    fn: (message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => Promise<void>,
  ) => void;
  onMessageLoadingChange?: (isLoading: boolean) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export interface UseVideoUploadProps {
  chatId: string | null;
}

export interface YouTubeUrlInfo {
  videoId?: string;
  playlistId?: string;
  isYouTubeUrl: boolean;
}
