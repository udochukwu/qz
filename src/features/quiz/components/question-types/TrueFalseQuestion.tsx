import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { QuizQuestion, QuizSessionQuestion } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StyledButton = styled('button', {
  base: {
    backgroundColor: 'white',
    color: 'inherit',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderRadius: '12px',
    padding: '12px 16px',
    textAlign: 'left',
    transition: 'all 0.2s, opacity 0.2s',
    display: 'flex',
    width: '100%',
    fontWeight: 500,
    opacity: 1,
    '&:hover': {
      opacity: 0.7,
    },
    '&:active': {
      scale: 0.995,
    },
  },
});

interface TrueFalseQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  onSubmit: (answer: string) => void;
  questionSessionEntry?: QuizSessionQuestion | null;
}

export default function TrueFalseQuestion({
  question,
  questionNumber,
  onSubmit,
  questionSessionEntry,
}: TrueFalseQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(questionSessionEntry?.submitted_answer || null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(!!questionSessionEntry?.submitted_answer);
  const { t } = useTranslation();
  return (
    <BaseQuestion
      question={question}
      questionNumber={questionNumber}
      onSubmit={onSubmit}
      questionSessionEntry={questionSessionEntry}>
      <styled.div display="flex" gap={4}>
        {question.options?.map((option, index) => {
          // Determine styles based on state
          let style: React.CSSProperties = {
            cursor: hasSubmitted ? 'default' : 'pointer',
          };

          if (!hasSubmitted) {
            // Before submission
            if (selectedOption === option) {
              style = {
                ...style,
                backgroundColor: '#F0EEFF',
                color: '#6d56fa',
                borderColor: '#6d56fa',
              };
            }
          } else {
            // After submission
            if (option === question.correct_answer) {
              style = {
                ...style,
                backgroundColor: '#E3F8EC',
                color: '#36AF6F',
                borderColor: '#36AF6F',
                ...(selectedOption === option ? { boxShadow: '0 0 0 2px #36AF6F' } : {}),
              };
            } else if (selectedOption === option) {
              style = {
                ...style,
                backgroundColor: '#FBE2E4',
                color: '#FD2D3F',
                borderColor: '#FD2D3F',
                boxShadow: '0 0 0 2px #FD2D3F',
              };
            } else {
              style = {
                ...style,
                color: 'rgba(0,0,0,0.5)',
              };
            }
          }

          return (
            <StyledButton
              key={index}
              style={style}
              onClick={() => {
                if (!hasSubmitted) {
                  setSelectedOption(option);
                  setHasSubmitted(true);
                  onSubmit(option);
                }
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>{option}</span>
                {hasSubmitted && option === question.correct_answer && <Check size={16} color="#36AF6F" />}
                {hasSubmitted && selectedOption === option && option !== question.correct_answer && (
                  <X size={16} color="#FD2D3F" />
                )}
              </div>
            </StyledButton>
          );
        })}
      </styled.div>
    </BaseQuestion>
  );
}
