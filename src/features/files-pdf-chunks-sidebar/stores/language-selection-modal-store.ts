import { create } from 'zustand';
import { FileToUploadPost } from '../types/api-types';

interface LanguageSelectionModalStore {
  isOpen: boolean;
  files: FileToUploadPost[];
  onConfirm: (files: FileToUploadPost[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setFiles: (files: FileToUploadPost[]) => void;
  setOnConfirm: (callback: (files: FileToUploadPost[]) => void) => void;
  resetState: () => void;
}

export const useLanguageSelectionModalStore = create<LanguageSelectionModalStore>(set => ({
  isOpen: false,
  files: [],
  onConfirm: (files: FileToUploadPost[]) => {},
  setIsOpen: isOpen => {
    if (!isOpen) {
      // reset files when modal is closed
      set({ files: [], onConfirm: (files: FileToUploadPost[]) => {} });
    }
    set({ isOpen });
  },
  setFiles: files => set({ files }),
  setOnConfirm: callback => set({ onConfirm: callback }),
  resetState: () => set({ isOpen: false, files: [], onConfirm: (files: FileToUploadPost[]) => {} }),
}));
