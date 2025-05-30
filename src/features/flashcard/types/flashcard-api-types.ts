import { FlashcardSet } from './flashcard-set';

export interface FlashcardSets {
  set_id: string;
  file_names: string[];
  file_types: string[];
  number_of_flashcards: number;
  name?: string; // Mayne remove later: reason APi response schema does not include this but its it needed
  fileId?: string; // Mayne remove later: reason APi response schema does not include this but its it needed
  created_at_utc?: string; // ISO 8601 format (e.g. "2022-01-01T00:00:00Z")
}

export interface Flashcard {
  question: string;
  answer: string;
  flashcard_id: string;
  filename?: string;
  workspace_file_id?: string;
  workspace_id?: string;
  set_id: string;
  is_favorite: boolean;
  created_at_utc?: string; // ISO 8601 format (e.g. "2022-01-01T00:00:00Z")
}

export interface FlashcardSetResponse {
  flashcard_sets: FlashcardSets[];
}

export interface GenerateFlashcardQuery {
  chat_id?: string;
  workspace_id?: string;
  workspace_file_ids?: string[];
  file_ids?: string[];
  topics?: string[];
}

export interface GenerateFlashcardResponse {
  flashcard_set: FlashcardSet;
}
