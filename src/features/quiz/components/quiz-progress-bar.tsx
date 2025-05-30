import { motion } from 'framer-motion';
import { styled } from 'styled-system/jsx';

interface QuizProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
}

export const QuizProgressBar = ({ currentIndex, totalQuestions }: QuizProgressBarProps) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <styled.div w="full">
      <styled.div
        style={{
          height: '4px',
          backgroundColor: '#6D56FA1F',
          borderRadius: '2px',
          width: '100%',
          position: 'relative',
        }}>
        <motion.div
          layoutId="quiz-progress-bar"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
          style={{
            height: '100%',
            backgroundColor: '#6D56FA',
            borderRadius: '2px',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </styled.div>
    </styled.div>
  );
};
