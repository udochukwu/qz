import { ReasonType } from '@/types';
import { create } from 'zustand';

interface Store {
  isOpen?: boolean;
  referrer: ReasonType;
  closeCallback?: () => void;
  setIsOpen: (val: boolean) => void;
  setReferrer: (val: ReasonType) => void;
  setCloseCallback: (val: () => void) => void;
}

export const useUpgradePlanModalStore = create<Store>(set => ({
  isOpen: false,
  referrer: 'message-limit',
  closeCallback: undefined,
  setIsOpen: isOpen => set({ isOpen }),
  setReferrer: referrer => set({ referrer }),
  setCloseCallback: closeCallback => set({ closeCallback }),
}));
