import { create } from 'zustand';

interface IntercomStore {
  newMessage: boolean;
  showNewMessage: () => void;
  resetNewMessage: () => void;
}

const useIntercomStore = create<IntercomStore>(set => ({
  newMessage: false,
  showNewMessage: () => set({ newMessage: true }),
  resetNewMessage: () => set({ newMessage: false }),
}));

export default useIntercomStore;
