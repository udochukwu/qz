import { create } from 'zustand';

interface TourStore {
  isTourActive: boolean;
  stepIndex: number;
  workspaceId: string | null;
  classNameInput: string;
  setIsTourActive: (active: boolean) => void;
  setStepIndex: (index: number) => void;
  setWorkspaceId: (id: string | null) => void;
  setClassNameInput: (name: string) => void;
  resetTour: () => void;
}

export const useTourStore = create<TourStore>(set => ({
  isTourActive: false,
  stepIndex: 0,
  workspaceId: null,
  classNameInput: '',
  setIsTourActive: active => set({ isTourActive: active }),
  setStepIndex: index => set({ stepIndex: index }),
  setWorkspaceId: id => set({ workspaceId: id }),
  setClassNameInput: name => set({ classNameInput: name }),
  resetTour: () =>
    set({
      isTourActive: false,
      stepIndex: 0,
      workspaceId: null,
      classNameInput: '',
    }),
}));
