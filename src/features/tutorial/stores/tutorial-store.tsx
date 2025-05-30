import { create } from 'zustand';

interface TutorialStore {
  showTutorial: boolean;
  tutorialIndex: number;
  setTutorialIndex: (index: number) => void;
  displayTutorial: () => void;
  closeTutorial: () => void;
}

const useTutorialStore = create<TutorialStore>(set => ({
  showTutorial: false,
  tutorialIndex: 0,
  setTutorialIndex: index => set({ tutorialIndex: index }),
  displayTutorial: () => set({ showTutorial: true, tutorialIndex: 0 }),
  closeTutorial: () => set({ showTutorial: false }),
}));

export default useTutorialStore;
