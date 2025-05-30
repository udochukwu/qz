import React from 'react';
import { Box, HStack, VStack, styled } from 'styled-system/jsx';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Substep from './copilot-substep-item';
import Lottie from 'lottie-react';
import { CopilotStep } from '@/types';

interface StepProps {
  step: CopilotStep;
  index: number;
  isExpanded: boolean;
  toggleStep: (index: number) => void;
  isLastStep: boolean;
}

const Step = ({ step, index, isExpanded, toggleStep, isLastStep }: StepProps) => {
  const hasSubsteps = step.substeps.length > 0;

  return (
    <Box mt={3} width="100%" position="relative">
      <HStack
        mb={2}
        onClick={() => hasSubsteps && toggleStep(index)}
        cursor={hasSubsteps ? 'pointer' : 'default'}
        alignItems="start">
        <styled.div>
          <Box width="25px" height="25px" mt={0} className="lottie-container">
            <Lottie
              animationData={
                step.isCompleted ? require('@assets/lottie/checkmark.json') : require('@assets/lottie/loading.json')
              }
              loop={!step.isCompleted}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
          {!isLastStep && (
            <Box
              position="absolute"
              left="12px"
              top="25px"
              bottom={0}
              width="1px"
              height={'98%'}
              backgroundColor={'rgba(0, 0, 0, 0.2)'}
            />
          )}
        </styled.div>

        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <styled.span
            fontWeight="medium"
            flex={1}
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}>
            {step.title}
          </styled.span>
          {hasSubsteps && (isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </Box>
      </HStack>

      {isExpanded && hasSubsteps && (
        <VStack alignItems="flex-start" ml={7}>
          {step.substeps.map((substep, subIndex) => (
            <Substep key={subIndex} substep={substep} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Step;
