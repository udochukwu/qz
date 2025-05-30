export interface ChatHistory {
  chat_id: string;
  description: string;
  last_message_at: number;
  last_message: string;
  class_name?: string;
}
