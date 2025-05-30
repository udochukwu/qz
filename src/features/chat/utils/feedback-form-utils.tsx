import { FeedbackData, FeedbackQuestionType, SubmitFeedbackParams } from '../types';

export const formatFeedbackResponse = (
  feedbackData: FeedbackData,
  response: string | string[],
): SubmitFeedbackParams => {
  let formattedResponse: string[];

  if (feedbackData.questions[0].type === FeedbackQuestionType.MULTIPLE_SELECT) {
    formattedResponse = Array.isArray(response) ? response : [response];
  } else {
    formattedResponse = [response as string];
  }

  return {
    feedback_form_id: feedbackData.id,
    response: formattedResponse,
  };
};
