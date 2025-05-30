'use client';
import { MENU_TAB } from '@/features/menu-bar/types';
import { create } from 'zustand';

interface ViewTypeState {
  currentView: MENU_TAB;
  switchView: (view: MENU_TAB) => void;
}

export const useViewTypeStore = create<ViewTypeState>(set => ({
  currentView: MENU_TAB.CHATS,
  switchView: (view: MENU_TAB) => set({ currentView: view }),
}));
