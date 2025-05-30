import create from 'zustand';

interface UploadProgressState {
  fileProgressMap: Record<string, number>;
  setProgress: (sha256: string, progress: number) => void;
  getProgress: (sha256: string) => number | undefined;
  resetProgress: (sha256?: string) => void;
}

const useUploadProgressStore = create<UploadProgressState>((set, get) => ({
  fileProgressMap: {},

  setProgress: (sha256, progress) => {
    const scaledProgress = Math.min(Math.floor(progress / 10), 9); // Scale progress to < 10
    set(state => ({
      fileProgressMap: {
        ...state.fileProgressMap,
        [sha256]: scaledProgress,
      },
    }));
  },

  getProgress: sha256 => {
    const state = get();
    return state.fileProgressMap[sha256];
  },

  resetProgress: sha256 => {
    if (sha256) {
      set(state => {
        const { [sha256]: _, ...rest } = state.fileProgressMap;
        return { fileProgressMap: rest };
      });
    } else {
      set({ fileProgressMap: {} });
    }
  },
}));

export default useUploadProgressStore;
