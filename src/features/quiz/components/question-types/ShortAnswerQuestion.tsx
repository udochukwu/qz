import { useState, FormEvent, useEffect } from 'react';
import { styled } from 'styled-system/jsx';
import { QuizQuestion, QuizSessionQuestion } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { useTranslation } from 'react-i18next';
interface ShortAnswerQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  onSubmit: (answer: string) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  questionSessionEntry?: QuizSessionQuestion | null;
}

export default function ShortAnswerQuestion({
  question,
  questionNumber,
  onSubmit,
  textInput,
  setTextInput,
  questionSessionEntry,
}: ShortAnswerQuestionProps) {
  const { t } = useTranslation();
  const submittedAnswer = questionSessionEntry?.submitted_answer;
  const isCorrect = questionSessionEntry?.is_correct;
  useEffect(() => {
    if (submittedAnswer) {
      setTextInput(submittedAnswer);
    }
  }, [submittedAnswer, setTextInput]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(textInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit(textInput);
    }
  };

  return (
    <BaseQuestion
      question={question}
      questionNumber={questionNumber}
      onSubmit={onSubmit}
      questionSessionEntry={questionSessionEntry}>
      <styled.form onSubmit={handleSubmit} display="flex" flexDirection="column" gap={4}>
        <styled.textarea
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('quiz.while_in_question.type_answer')}
          w="full"
          minH="120px"
          p={4}
          borderRadius="xl"
          backgroundColor={submittedAnswer ? '#F5F5F5' : 'white'}
          _focus={{
            backgroundColor: submittedAnswer ? '#F5F5F5' : 'gray.50',
          }}
          _hover={{
            backgroundColor: submittedAnswer ? '#F5F5F5' : 'gray.50',
          }}
          resize="vertical"
          fontWeight="medium"
          outline="none"
          borderColor={submittedAnswer ? (isCorrect ? '#36AF6F' : '#FD2D3F') : 'rgba(0,0,0,0.1)'}
          readOnly={!!submittedAnswer}
          cursor={submittedAnswer ? 'not-allowed' : 'text'}
        />
        {submittedAnswer && (
          <styled.div
            p={4}
            borderRadius="xl"
            backgroundColor={isCorrect ? '#E3F8EC' : '#FBE2E4'}
            color={isCorrect ? '#36AF6F' : '#FD2D3F'}
            fontSize="sm"
            fontWeight="medium">
            {isCorrect ? t('quiz.while_in_question.correct') : t('quiz.while_in_question.incorrect')}
          </styled.div>
        )}
      </styled.form>
    </BaseQuestion>
  );
}
