import { ResourceChunk } from '@/types';
import { Flashcard } from './flashcard';

export interface FlashcardSet {
  set_id: string;
  file_names: string[];
  file_types: string[];
  number_of_flashcards: number;
  flashcards: Flashcard[];
  date_generated: string;
  is_approved: boolean;
  created_at_utc: string; // ISO 8601 format (e.g. "2022-01-01T00:00:00Z")
  tracking_progress?: boolean;
  shuffle?: boolean;
  resource_chunks?: ResourceChunk[];
}
