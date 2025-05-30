import { create } from 'zustand';
import { FeedbackData } from '../types';

interface NewMessageStore {
  messageFromRedirect: string | null;
  isNewMessageLoading: boolean; //When streaming
  feedbackData: FeedbackData | null;
  setMessageFromRedirect: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setFeedbackData: (feedbackData: FeedbackData | null) => void;
}

const useNewMessageStore = create<NewMessageStore>(set => ({
  isNewMessageLoading: false,
  messageFromRedirect: null,
  feedbackData: null,
  setLoading: (isLoading: boolean) => set({ isNewMessageLoading: isLoading }),
  setMessageFromRedirect: (message: string | null) => set({ messageFromRedirect: message }),
  setFeedbackData: feedbackData => set({ feedbackData }),
}));

export default useNewMessageStore;
