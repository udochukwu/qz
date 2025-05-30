import { XIcon } from 'lucide-react';
import { Box, Center, Stack, Wrap } from 'styled-system/jsx';
import { useState } from 'react';
import { Button } from '@/components/elements/button';
import { IconButton } from '@/components/elements/icon-button';
import { Card } from '@/components/elements/card';
import { Input } from '@/components/elements/input';
import { FeedbackData, FeedbackQuestionType } from '../types';
import { formatFeedbackResponse } from '../utils/feedback-form-utils';
import { useSubmitFeedback } from '../hooks/use-submit-feedback';
import useNewMessageStore from '../stores/new-message-stroe';
import { useTranslation } from 'react-i18next';

interface FeedbackCardProps {
  feedbackData: FeedbackData;
}

export const FeedbackCard = ({ feedbackData }: FeedbackCardProps) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | string[]>('');

  const setFeedbackData = useNewMessageStore.getState().setFeedbackData;
  const onClose = () => {
    setFeedbackData(null);
  };

  const { mutate: submitFeedback, isLoading } = useSubmitFeedback(
    () => {
      // Success callback
      onClose();
    },
    error => {
      // Error callback
      console.error('Failed to submit feedback:', error);
    },
  );

  const handleOptionToggle = (option: string) => {
    const question = feedbackData.questions[0];
    if (question.type === FeedbackQuestionType.SINGLE_SELECT) {
      setResponse(option);
    } else if (question.type === FeedbackQuestionType.MULTIPLE_SELECT) {
      setResponse(prev => {
        const currentResponses = Array.isArray(prev) ? prev : [];
        return currentResponses.includes(option)
          ? currentResponses.filter(item => item !== option)
          : [...currentResponses, option];
      });
    }
  };

  const handleOpenEndedResponse = (value: string) => {
    setResponse(value);
  };

  const handleSubmit = () => {
    const formattedFeedback = formatFeedbackResponse(feedbackData, response);
    submitFeedback(formattedFeedback, {
      onSuccess: () => {
        setFeedbackData(null);
      },
    });
  };

  const question = feedbackData.questions[0];

  return (
    <Center>
      <Card.Root width="90%">
        <Card.Header>
          <Card.Title>{t('chat.feedback.title')}</Card.Title>
          <Box position="absolute" top="2" right="2">
            <IconButton onClick={onClose} aria-label={t('chat.feedback.close')} variant="ghost" size="sm">
              <XIcon />
            </IconButton>
          </Box>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Box>
              <Box fontWeight="bold" mb="2">
                {question.question}
              </Box>
              {question.type === FeedbackQuestionType.OPEN_ENDED ? (
                <Input
                  value={response as string}
                  onChange={e => handleOpenEndedResponse(e.target.value)}
                  placeholder={t('chat.feedback.question.placeholder')}
                />
              ) : (
                <Wrap gap="2">
                  {question.options?.map(option => (
                    <Button
                      key={option}
                      size="sm"
                      variant={
                        question.type === FeedbackQuestionType.SINGLE_SELECT
                          ? response === option
                            ? 'solid'
                            : 'outline'
                          : (response as string[]).includes(option)
                            ? 'solid'
                            : 'outline'
                      }
                      onClick={() => handleOptionToggle(option)}>
                      {option}
                    </Button>
                  ))}
                </Wrap>
              )}
            </Box>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button onClick={handleSubmit} colorPalette={'blue'} width="full" disabled={isLoading}>
            {t('chat.feedback.submit')}
          </Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};
