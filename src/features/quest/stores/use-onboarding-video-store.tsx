import { create } from 'zustand';

interface onboardingVideoStore {
  showOnboardingVideo: boolean;
  setShowOnboardingVideo: (show: boolean) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (isPlaying: boolean) => void;
}

const useOnboardingVideoStore = create<onboardingVideoStore>(set => ({
  showOnboardingVideo: false,
  isVideoPlaying: false,
  setIsVideoPlaying: isPlaying => set({ isVideoPlaying: isPlaying }),
  setShowOnboardingVideo: show => set({ showOnboardingVideo: show }),
}));

export default useOnboardingVideoStore;
