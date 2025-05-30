import { create } from 'zustand';

interface userStore {
  username: string;
  user_image: string;
  user_subheader: string;
  user_id: string;
  email: string;
  impersonated: boolean;
  langcode: string;
  experiments?: { [key: string]: any };
  setUserName: (username: string) => void;
  setUserImage: (user_image: string) => void;
  setUserSubheader: (user_subheader: string) => void;
  setUserId: (user_id: string) => void;
  setEmail: (email: string) => void;
  setImpersonated: (impersonated: boolean) => void;
  setExperiments: (experiments: { [key: string]: any }) => void;
  setLangcode: (langcode: string) => void;
}

export const useUserStore = create<userStore>(set => ({
  username: 'Guest',
  user_subheader: 'Hogwarts School',
  user_image: 'https://i.ibb.co/4V4fXSy/low-quality-pic-of-me.jpg',
  user_id: 'Guest',
  is_onboarded: false,
  email: '',
  impersonated: false,
  langcode: 'en',
  setUserName: username => set({ username }),
  setUserImage: user_image => set({ user_image }),
  setUserSubheader: user_subheader => set({ user_subheader }),
  setUserId: user_id => set({ user_id }),
  setEmail: email => set({ email }),
  setImpersonated: impersonated => set({ impersonated }),
  setExperiments: experiments => set({ experiments }),
  setLangcode: langcode => set({ langcode }),
}));
