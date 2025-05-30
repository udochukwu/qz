import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { QuestionType } from '@/features/quiz/types/quiz';
import MultipleChoiceQuestion from '@/features/quiz/components/question-types/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/features/quiz/components/question-types/TrueFalseQuestion';
import ShortAnswerQuestion from '@/features/quiz/components/question-types/ShortAnswerQuestion';
import FillInBlankQuestion from '@/features/quiz/components/question-types/FillInBlankQuestion';
import { motion } from 'framer-motion';
import { SpinningIcon } from '@/components/spinning-icon';

const StyledMotionDiv = motion(styled.div);

interface QuizQuestionProps {
  question: any; // TODO: Replace with proper type
  questionSessionEntry: any; // TODO: Replace with proper type
  questionNumber: number;
  isSubmitting: boolean;
  textInput: string;
  setTextInput: (value: string) => void;
  onSubmit: (answer: string | string[], skip_question?: boolean) => void;
}

export function QuizQuestion({
  question,
  questionSessionEntry,
  questionNumber,
  isSubmitting,
  textInput,
  setTextInput,
  onSubmit,
}: QuizQuestionProps) {
  const { t } = useTranslation();

  const renderQuestion = () => {
    if (!question)
      return (
        <StyledMotionDiv
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              delay: 1,
            },
          }}
          exit={{
            opacity: 0,
          }}>
          <styled.div display="flex" alignItems="center" justifyContent="center" gap={2}>
            <SpinningIcon />
            <styled.div>Loading Question</styled.div>
          </styled.div>
        </StyledMotionDiv>
      );

    switch (question.question_type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            questionSessionEntry={questionSessionEntry}
            onSubmit={onSubmit}
            question={question}
            questionNumber={questionNumber}
          />
        );
      case QuestionType.TRUE_FALSE:
        return (
          <TrueFalseQuestion
            questionSessionEntry={questionSessionEntry}
            onSubmit={onSubmit}
            question={question}
            questionNumber={questionNumber}
          />
        );
      case QuestionType.SHORT_ANSWER:
        return (
          <ShortAnswerQuestion
            questionSessionEntry={questionSessionEntry}
            textInput={textInput}
            setTextInput={setTextInput}
            question={question}
            questionNumber={questionNumber}
            onSubmit={onSubmit}
          />
        );
      case QuestionType.FILL_IN_BLANK:
        return (
          <FillInBlankQuestion
            questionSessionEntry={questionSessionEntry}
            textInput={textInput}
            setTextInput={setTextInput}
            question={question}
            questionNumber={questionNumber}
            onSubmit={onSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <styled.div mt={24} gap={10} display="flex" alignItems="center" flexDirection="column" justifyContent="center">
      {renderQuestion()}
    </styled.div>
  );
}
