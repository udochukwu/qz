import { ResourceChunk } from '@/types';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  SHORT_ANSWER = 'short_answer',
}

export enum AnswerValidationType {
  EXACT_MATCH = 'exact_match',
  AI_VALIDATION = 'ai_validation',
}

export interface QuizQuestion {
  question_id: string;
  file_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  correct_answer: any;
  answer_validation_type: AnswerValidationType;
  validation_context?: Record<string, any>;
  hint: string;
  explanation: string;
  topic: string;
  completed: boolean;
  active: boolean;
}

export interface Quiz {
  quiz_id: string;
  user_id: string;
  title: string;
  description?: string;
  questions: Record<string, QuizQuestion>;
  workspace_file_ids: string[];
  created_at_utc: number;
  last_accessed_at_utc?: number;
  created_at: string;
  updated_at: string;
  resource_chunks: ResourceChunk[];
  is_unlimited?: boolean;
}

export interface QuizSessionQuestion {
  quiz_session_id: string;
  question_id: string;
  submitted_answer?: string;
  is_correct: boolean;
  custom_ai_explanation: string | null;
  submitted_at_utc: number;
  skipped?: boolean;
}

export interface QuizSessionBase {
  quiz_session_id: string;
  quiz_id: string;
  question_order: string[];
  started_at_utc: number;
}

export type QuizSession = QuizSessionBase & {
  [key: string]: QuizSessionQuestion;
};

export interface QuizPreview {
  quiz_id: string;
  title: string;
  file_ids: string[];
  number_of_questions: number;
  created_at_utc: number;
  question_topics: string[];
  is_unlimited: boolean;
}
