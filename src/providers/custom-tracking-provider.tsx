// mixpanel-provider.tsx
import { ReactNode, useEffect } from 'react';
import mixpanel, { Dict } from 'mixpanel-browser';
import { useUserStore } from '@/stores/user-store';

interface MixpanelProviderProps {
  children: ReactNode;
}

export const MixpanelProvider = ({ children }: MixpanelProviderProps) => {
  const { user_id, username, email } = useUserStore();

  useEffect(() => {
    // Initialize Mixpanel with different project ID based on environment
    const projectId =
      process.env.NODE_ENV === 'development' ? 'd413e82cabca48a38792daf45ae6b45f' : '9d23d45e31249fdf828a6c13cc060f11';

    mixpanel.init(projectId, {
      api_host: `https://mixpanel-tracking-proxy-qbksyi6jla-uc.a.run.app`,
      track_pageview: true,
    });

    // Set user identity if not guest
    if (user_id !== 'Guest') {
      mixpanel.identify(user_id);
      mixpanel.people.set({
        $email: email,
        $name: username,
        $distinct_id: user_id,
      });
    }
  }, [user_id, username, email]);

  return <>{children}</>;
};

export enum EventName {
  ExampleChatStarted = 'example_chat_started',
  MessageCopied = 'message_copied',
  MessageDownloaded = 'message_downloaded',
  QuickChatCreated = 'quick_chat_created',
  CheckoutSuccess = 'checkout_success',
  SuggestedMessageClicked = 'suggested_msg_clicked',
  SaveRecordedLecture = 'save_recorded_lecture',
  ChatOpened = 'chat_opened',
  ViewedUpgradePlan = 'viewed_upgrade_plan',
  CheckoutStarted = 'checkout_started',
  FileUnexpanded = 'file_unexpanded',
  FileExpanded = 'file_expanded',
  TextCopied = 'text_copied',
  ChunkUnexpanded = 'chunk_unexpanded',
  ChunkClicked = 'chunk_clicked',
  ChatStartedFromUploadToast = 'chat_started_from_upload_toast',
  FlashcardStarted = 'flashcard_started',
  FlashcardTabSelectedOnHome = 'flashcard_tab_selected_on_home',
  FlashcardPageViewed = 'flashcard_page_viewed',
  FlashcardReplaced = 'flashcard_replaced',
  FlashcardDeleted = 'flashcard_deleted',
  FlashcardStarred = 'flashcard_starred',
  FlashcardUnstarred = 'flashcard_unstarred',
  FlashcardAddMoreClicked = 'flashcard_add_more_clicked',
  NewChatClicked = 'new_chat_clicked',
  NewFlashCardClicked = 'new_flash_card_clicked',
  OnboardingQuestionsCompleted = 'onboarding_questions_completed',
  OnboardingStarted = 'onboarding_started',
  OnboardingQuestionSubmitted = 'onboarding_question_submitted',
  FeedbackProvided = 'feedback_provided',
  DownloadAppModalClosed = 'download_app_modal_closed',
  ProductTourStarted = 'product_tour_started',
  ProductTourCompleted = 'product_tour_completed',
  ProductTourClassCreated = 'product_tour_class_created',
  DiscountPageViewed = 'discount_page_viewed',
  MobileAppDownloadClicked = 'mobile_app_download_clicked',
  QuizModalOpened = 'quiz_modal_opened',
  QuizViewCustomizeStepTwoClicked = 'quiz_view_customize_step_two_clicked',
  QuizViewSettingsStepThreeClicked = 'quiz_view_settings_step_three_clicked',
  QuizCreated = 'quiz_created',
  QuizOpened = 'quiz_opened',
  QuizSessionCreatedOrStarted = 'quiz_session_created_or_started',
  QuizQuestionDeleted = 'quiz_question_deleted',
  QuizQuestionSubmitted = 'quiz_question_submitted',
  UnlimitedModeClicked = 'unlimited_mode_clicked',
  QuizFinished = 'quiz_finished',
  PlaylistImported = 'playlist_imported',
  VideoImported = 'video_imported',
  QuizQuestionSentiment = 'quiz_question_sentiment',
}
