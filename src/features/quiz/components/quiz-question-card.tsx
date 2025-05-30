'use client';

import { styled } from 'styled-system/jsx';
import { Eye, EyeOff, Trash } from 'lucide-react';
import MessageRendererV2 from '@/features/chat/components/message-rendererengine';
import { useTranslation } from 'react-i18next';
import { QuizQuestion } from '../types/quiz';
import SourceButton from './SourceButton';
interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  isAnswerRevealed: boolean;
  onToggleAnswer: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export default function QuizQuestionCard({
  question,
  index,
  isAnswerRevealed,
  onToggleAnswer,
  onDeleteQuestion,
}: QuizQuestionCardProps) {
  const { t } = useTranslation();

  const extractChunkIds = (text: string): string[] => {
    const chunkRegex = /<chunk>(.*?)<\/chunk>/g;
    const matches = text.match(chunkRegex) || [];
    return matches.map(match => match.replace(/<chunk>|<\/chunk>/g, ''));
  };

  const chunkIds = extractChunkIds(question.explanation);

  return (
    <styled.div
      key={question.question_id}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      bg="white"
      pb={6}
      boxShadow="sm">
      <styled.div
        borderBottomWidth="1px"
        borderColor="gray.200"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={2}
        px={5}
        mb={4}>
        <styled.span fontWeight="medium" fontSize="md">
          {index + 1}
        </styled.span>
        <styled.div display="flex" gap={2}>
          <styled.button
            width="150px"
            height="32px"
            bg="white"
            color="rgba(0, 0, 0, 0.8)"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ opacity: 0.7 }}
            transition="opacity 0.2s ease-in-out"
            cursor="pointer"
            onClick={() => onToggleAnswer(question.question_id)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}>
            {isAnswerRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
            <styled.span>{isAnswerRevealed ? t('quiz.quiz_view.hide') : t('quiz.quiz_view.show')}</styled.span>
          </styled.button>
          <styled.button
            height="32px"
            width="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            rounded="md"
            color="rgba(0, 0, 0, 0.8)"
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            transition="opacity 0.2s ease-in-out"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            onClick={() => onDeleteQuestion(question.question_id)}>
            <Trash size={18} />
          </styled.button>
        </styled.div>
      </styled.div>

      <styled.div px={5}>
        <styled.div display="flex" fontWeight={'medium'} mb={4}>
          <styled.div mb={'-1em'}>
            <MessageRendererV2
              message_id={question.question_id}
              message={
                question.question_type === 'fill_in_blank' && isAnswerRevealed && question.question_text.includes('_')
                  ? question.question_text.replace(
                      /_{2,}/g,
                      `<span style="color: #22C55E">${question.correct_answer}</span>`,
                    )
                  : question.question_text
              }
            />
          </styled.div>
        </styled.div>
        <styled.div>
          {question.options?.map((option, idx) => (
            <styled.div key={idx} display="flex" mb={2} alignItems="center">
              <styled.span
                mb={'-1em'}
                color={isAnswerRevealed && option === question.correct_answer ? '#22C55E' : 'inherit'}>
                <MessageRendererV2 message_id={question.question_id} message={option} />
              </styled.span>
            </styled.div>
          ))}
        </styled.div>

        {(question.question_type === 'short_answer' ||
          (question.question_type === 'fill_in_blank' && !question.question_text.includes('_'))) && (
          <styled.div
            mt={2}
            height="40px"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="md"
            display="flex"
            alignItems="center"
            px={3}
            color={isAnswerRevealed ? '#22C55E' : 'transparent'}>
            {isAnswerRevealed ? (
              <styled.div mb={'-1em'}>
                <MessageRendererV2 message_id={question.question_id} message={question.correct_answer} />
              </styled.div>
            ) : (
              '.'
            )}
          </styled.div>
        )}
        {chunkIds.length > 0 && (
          <styled.div display="flex" flexWrap="wrap" gap={2} mt={2}>
            {chunkIds.map(chunkId => (
              <SourceButton key={chunkId} chunkId={chunkId} />
            ))}
          </styled.div>
        )}
      </styled.div>
    </styled.div>
  );
}
