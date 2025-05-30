import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SHOW_FEEDBACK_FORM } from '../consts/feedback';

interface FeedbackStore {
  showFeedbackForm: boolean;
  setShowFeedbackForm: (show: boolean) => void;
}

const useFeedbackStore = create<FeedbackStore>()(
  persist(
    set => ({
      showFeedbackForm: false,
      setShowFeedbackForm: (show: boolean) => set({ showFeedbackForm: show }),
    }),
    { name: SHOW_FEEDBACK_FORM, version: 1 },
  ),
);

export default useFeedbackStore;
