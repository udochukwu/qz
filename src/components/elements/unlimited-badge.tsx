import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const UnlimitedBadge = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      style={{
        display: 'inline-block',
        background: 'conic-gradient(from 0deg, #6D56FA, #9747FF, #6D56FA)',
        padding: '4px 8px',
        borderRadius: '9999px',
        color: 'white',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
      animate={{
        background: [
          'conic-gradient(from 0deg, #6D56FA, #9747FF, #6D56FA)',
          'conic-gradient(from 360deg, #6D56FA, #9747FF, #6D56FA)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}>
      {t('quiz.quiz_preview.unlimited', 'unlimited')}
    </motion.div>
  );
};
