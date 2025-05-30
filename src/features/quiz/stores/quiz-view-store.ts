import { create } from 'zustand';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';

// Define possible variants
type QuizViewVariant = 'quiz' | 'flashcards' | null; // Add other variants as needed

interface QuizViewStore {
  selectedFiles: WorkspaceFile[];
  isOpen: boolean;
  variant: QuizViewVariant; // Add variant state
  topics: string[];
  quickMake: boolean;
  setSelectedFiles: (files: WorkspaceFile[]) => void;
  open: (
    variant?: QuizViewVariant,
    file?: WorkspaceFile[] | WorkspaceFile,
    topics?: string[],
    quickMake?: boolean,
  ) => void; // Update open signature
  close: () => void;
}

export const useQuizViewStore = create<QuizViewStore>(set => ({
  selectedFiles: [],
  isOpen: false,
  variant: null, // Initialize variant
  topics: [],
  quickMake: false,
  setSelectedFiles: files => set({ selectedFiles: files }),
  // Update open implementation
  open: (variant = 'quiz', file: any | undefined, topics: string[] | undefined, quickMake: boolean = false) =>
    set({
      selectedFiles: file ? (Array.isArray(file) ? [...file] : [file]) : [],
      isOpen: true,
      variant: variant, // Set variant on open
      topics: topics ? topics : [],
      quickMake: Array.isArray(file) && file.length > 0 ? quickMake : false,
    }),
  // Update close implementation
  close: () => set({ isOpen: false, variant: null, selectedFiles: [], topics: [] }), // Reset variant and selectedFiles on close
}));
