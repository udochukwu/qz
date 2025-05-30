import { create } from 'zustand';

interface Store {
  isOpen?: boolean;
  setIsOpen: (val: boolean) => void;
}

export const useManageSubscriptionModalStore = create<Store>(set => ({
  isOpen: false,
  setIsOpen: isOpen => set({ isOpen }),
}));
