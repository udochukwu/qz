import { styled } from 'styled-system/jsx';
import { QuizQuestion, QuizSessionQuestion } from '../../types/quiz';
import MessageRendererV2 from '@/features/chat/components/message-rendererengine';
import { useTranslation } from 'react-i18next';
import useChunksStore from '@/features/chat/stores/chunks-strore';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { useHandleChunkClick } from '@/hooks/use-handle-chunk-click';
import { ArrowUpRight, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';
import SourceButton from '../SourceButton';
import { useState } from 'react';
import { motion } from 'framer-motion';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { Modal } from '@/components/modal/modal';
import toast from 'react-hot-toast';

const StyledMotionDiv = motion(styled.div);
interface BaseQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  onSubmit: (answer: string) => void;
  children: React.ReactNode;
  questionSessionEntry?: QuizSessionQuestion | null;
}

export default function BaseQuestion({ question, questionNumber, children, questionSessionEntry }: BaseQuestionProps) {
  const { t } = useTranslation();

  const chunksFromExplanation = question.explanation
    .match(/<chunk>(.*?)<\/chunk>/g)
    ?.map(chunk => chunk.replace(/<chunk>|<\/chunk>/g, ''));

  const [sentiment, setSentiment] = useState<'positive' | 'negative' | null>(null);
  const [isNegativeFeedbackModalOpen, setIsNegativeFeedbackModalOpen] = useState(false);

  const handleSentiment = (sentimentNow: 'positive' | 'negative') => {
    if (sentimentNow === sentiment) {
      return;
    }
    setSentiment(sentimentNow);
    if (sentimentNow === 'positive') {
      mixpanel.track(EventName.QuizQuestionSentiment, {
        question_id: question.question_id,
        sentiment: 'positive',
      });
      toast.success(t('quiz.feedback.success'));
    } else {
      setIsNegativeFeedbackModalOpen(true);
    }
  };

  const handleNegativeFeedback = (reason: string) => {
    mixpanel.track(EventName.QuizQuestionSentiment, {
      question_id: question.question_id,
      sentiment: 'negative',
      reason: reason,
    });
    toast.success(t('quiz.feedback.success'));
    setIsNegativeFeedbackModalOpen(false);
  };

  return (
    <StyledMotionDiv
      display="flex"
      flexDirection="column"
      gap={6}
      width="full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <Modal isOpen={isNegativeFeedbackModalOpen} onOpenChange={setIsNegativeFeedbackModalOpen} width="400px">
        <styled.div mt={-4} p={6} display="flex" flexDirection="column" gap={3}>
          <styled.h2 fontSize="lg" textAlign="center" fontWeight="semibold" m={0}>
            {t('quiz.feedback.title')}
          </styled.h2>
          <styled.div display="flex" flexDirection="column" gap={2}>
            {[
              t('quiz.feedback.reasons.wrong_answer'),
              t('quiz.feedback.reasons.too_easy'),
              t('quiz.feedback.reasons.unclear_explanation'),
              t('quiz.feedback.reasons.unclear_question'),
              t('quiz.feedback.reasons.too_difficult'),
            ].map(reason => (
              <styled.button
                key={reason}
                py={2}
                px={4}
                borderRadius="lg"
                borderWidth={1}
                borderColor="rgba(0, 0, 0, 0.2)"
                shadow="sm"
                color="black"
                fontWeight="medium"
                fontSize="sm"
                cursor="pointer"
                _hover={{ bg: '#00000005' }}
                onClick={() => handleNegativeFeedback(reason)}>
                {reason}
              </styled.button>
            ))}
          </styled.div>
        </styled.div>
      </Modal>

      <styled.div>
        <styled.p my={0} fontWeight="medium" fontSize="sm" color="#6D56FA">
          {t('quiz.question')} {questionNumber}
        </styled.p>
        <styled.p my={2} fontSize="2xl" fontWeight="semibold">
          <styled.div mb={'-1em'}>
            <MessageRendererV2 message_id={question.question_id} message={question.question_text} />
          </styled.div>
        </styled.p>
      </styled.div>

      <styled.div>
        <styled.div>{children}</styled.div>
      </styled.div>
      {questionSessionEntry?.skipped && (
        <styled.div mt={6}>
          <styled.p color="black" w="fit-content" fontWeight="medium" fontSize="sm">
            {t('quiz.question_page.you_skipped_this_question')}
          </styled.p>
        </styled.div>
      )}
      {questionSessionEntry && questionSessionEntry.skipped !== true && (
        <styled.div mt={6} data-explanation>
          <styled.p fontWeight="medium" fontSize="sm" opacity={0.7}>
            {t('quiz.explanation')}
          </styled.p>
          <styled.div mb={'-1em'}>
            <MessageRendererV2
              message_id={questionSessionEntry.question_id}
              message={questionSessionEntry.custom_ai_explanation || question.explanation}
            />
          </styled.div>
          {chunksFromExplanation && chunksFromExplanation?.length > 0 && (
            <styled.div mt={14}>
              <styled.p fontWeight="medium" fontSize="sm" opacity={0.5}>
                {t('quiz.quiz_view.source')}
                {chunksFromExplanation.length > 1 ? 's' : ''}
              </styled.p>
              <styled.div display="flex" flexWrap="wrap" gap={2}>
                {chunksFromExplanation?.map(chunkId => <SourceButton key={chunkId} chunkId={chunkId} />)}
              </styled.div>
            </styled.div>
          )}
          <styled.div mt={4} display="flex" alignItems="center" gap={0}>
            <styled.button
              cursor="pointer"
              aspectRatio={1}
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              rounded="full"
              bg="rgba(0,0,0,0.0)"
              transition="background-color 0.2s ease-in-out, scale 0.2s ease-in-out"
              _active={{ scale: 0.95 }}
              _hover={{ bg: 'rgba(0,0,0,0.05)' }}
              onClick={() => handleSentiment('positive')}>
              <ThumbsUpIcon size={20} color={sentiment === 'positive' ? '#36AF6F' : 'rgba(0,0,0,0.8)'} />
            </styled.button>
            <styled.button
              cursor="pointer"
              aspectRatio={1}
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              rounded="full"
              bg="rgba(0,0,0,0.0)"
              transition="background-color 0.2s ease-in-out, scale 0.2s ease-in-out"
              _active={{ scale: 0.95 }}
              _hover={{ bg: 'rgba(0,0,0,0.05)' }}
              onClick={() => handleSentiment('negative')}>
              <ThumbsDownIcon size={20} color={sentiment === 'negative' ? '#FD2D3F' : 'rgba(0,0,0,0.8)'} />
            </styled.button>
          </styled.div>
        </styled.div>
      )}
    </StyledMotionDiv>
  );
}
