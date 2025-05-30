export type FlashCardProgressStatus = 'learning' | 'memorized' | null;

export interface Flashcard {
  flashcard_id: string;
  question: string;
  answer: string;
  is_favorite: boolean;
  set_id: string;
  file_name: string;
  workspace_file_id: string;
  string: string;
  progress_status?: FlashCardProgressStatus;
  hint?: string;
  chunk_id?: string;
}
