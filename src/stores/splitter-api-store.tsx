import { create } from 'zustand';

interface SplitterState {
  chatSize: number;
  setChatSize: (size: number) => void;
}
export const DEFAULT_CHAT_VIEW_SIZE = 60;

export const useSplitterStore = create<SplitterState>(set => ({
  chatSize: DEFAULT_CHAT_VIEW_SIZE,
  setChatSize: (size: number) => set({ chatSize: size }),
}));
