import { create } from 'zustand';

interface PaywallStore {
  isPaywallEnabled: boolean;
  setIsPaywallEnabled: (isPaywallEnabled: boolean) => void;
}

export const usePaywallStore = create<PaywallStore>(set => ({
  isPaywallEnabled: false,
  setIsPaywallEnabled: isPaywallEnabled => set({ isPaywallEnabled }),
}));
