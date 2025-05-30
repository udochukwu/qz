import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { VStack } from 'styled-system/jsx';
import GeneratedSuggestedButton from './generated-suggestion-button';
import { CompactFileSuggestion, CompactSuggestion, MessageSuggestion } from '../../types';
import useOnboardingVideoStore from '@/features/quest/stores/use-onboarding-video-store';
import { useTourStore } from '@/features/onboarding/stores/tour-store';

interface AnimatedSuggestedTextProps {
  suggestedMessages: MessageSuggestion[];
  sendFromGeneratedSuggestion: (
    message: string,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => Promise<void>;
}

export function AnimatedSuggestedText({ suggestedMessages, sendFromGeneratedSuggestion }: AnimatedSuggestedTextProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  // console.log('suggestedMessages', suggestedMessages);
  const setStepIndex = useTourStore(state => state.setStepIndex);
  const stepIndex = useTourStore(state => state.stepIndex);
  useEffect(() => {
    if (stepIndex === 7) {
      setStepIndex(8);
    }
  }, [stepIndex]);
  const setShowOnboardingVideo = useOnboardingVideoStore(state => state.setShowOnboardingVideo);
  const handleOnclik = (text: string) => {
    setShowOnboardingVideo(true);
    sendFromGeneratedSuggestion(text);
  };
  return (
    <VStack gap={2} mb={2} overflow={'hidden'} alignItems="flex-start" w="100%">
      {suggestedMessages.length > 0 &&
        suggestedMessages.map((suggestion: MessageSuggestion, index: number) => (
          <motion.div initial="hidden" animate="visible" custom={index} variants={itemVariants} key={index}>
            <GeneratedSuggestedButton
              key={index}
              suggestion={suggestion}
              onClick={async () => handleOnclik(suggestion.message)}
            />
          </motion.div>
        ))}
    </VStack>
  );
}
