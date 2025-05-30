import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, styled } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import Step from './components/copilot-step-item';
import Lottie from 'lottie-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotData } from '@/types';
import { useTranslation } from 'react-i18next';

interface CopilotViewProps {
  data: CopilotData;
}

const CopilotView = ({ data }: CopilotViewProps) => {
  const { t } = useTranslation();

  const isCompleted = data.state === 'completed';
  const [isExpanded, setIsExpanded] = useState(!isCompleted);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [prevIsCompleted, setPrevIsCompleted] = useState(isCompleted);

  useEffect(() => {
    if (!isCompleted) {
      setExpandedSteps(data.steps.map((_, index) => index));
    }
  }, [isCompleted, data.steps]);

  useEffect(() => {
    if (isCompleted && !prevIsCompleted) {
      setIsExpanded(false);
      setExpandedSteps([]);
    }
    setPrevIsCompleted(isCompleted);
  }, [isCompleted, prevIsCompleted]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setExpandedSteps(isExpanded ? [] : data.steps.map((_, index) => index));
  };

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        marginBottom: '-10px',
        padding: '15px',
        background: 'white',
        borderTopLeftRadius: '18px',
        borderTopRightRadius: '18px',
      }}>
      <Box width="100%">
        <motion.div
          style={{
            background: 'rgba(109, 86, 250, 0.02)',
            border: '1px solid rgba(109, 86, 250, 0.08)',
            padding: '8px',
            width: '100%',
            color: 'quizard.black',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '60px' }}
          transition={{ duration: 0.3 }}>
          <HStack justify="space-between" m={'auto'} mt="3px">
            <HStack gap={1}>
              <Lottie
                animationData={
                  isCompleted ? require('@assets/lottie/search.json') : require('@assets/lottie/logo.json')
                }
                loop={isCompleted ? false : true}
                autoplay={true}
                style={{ width: 25, height: 25 }}
              />
              <styled.span fontWeight="500" color="quizard.black">
                {isCompleted ? t('chat.copilot.search.completed') : t('chat.copilot.search.inProgress')}
              </styled.span>
            </HStack>
            <Button variant="ghost" size="sm" fontWeight="500" color="quizard.black" onClick={toggleExpand}>
              <span>{isExpanded ? t('chat.copilot.collapse') : t('chat.copilot.expand')}</span>
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </Button>
          </HStack>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <VStack justify="start" alignItems={'flex-start'} p={4}>
                  {data.steps.map((step, index) => (
                    <Step
                      key={index}
                      step={step}
                      index={index}
                      isExpanded={expandedSteps.includes(index)}
                      toggleStep={toggleStep}
                      isLastStep={index === data.steps.length - 1}
                    />
                  ))}
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default CopilotView;
