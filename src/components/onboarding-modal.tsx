import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { HStack, styled, VStack } from 'styled-system/jsx';
import { IconButton } from './elements/icon-button';
import { OnboardingGuideService } from '@/utils/onboarding-guide-service';
import { useListTooltips, useSetTooltip } from '@/hooks/use-list-tooltips';

interface OnboardingInfoModalProps {
  title: string;
  children: React.ReactNode;
  guideId: string;
  [key: string]: any;
}

export default function OnboardingInfoModal({ title, children, guideId, ...rest }: OnboardingInfoModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { data: tooltips } = useListTooltips();
  const { mutate: setTooltip } = useSetTooltip(guideId, false);

  useEffect(() => {
    setIsVisible(!OnboardingGuideService.hasGuideBeanSeen(guideId, tooltips));
  }, [tooltips, guideId]);

  const handleClose = () => {
    setTooltip();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <VStack border="1px solid #DCDCDC8F" p={3} mt={3} rounded="12px" alignItems="start" {...rest}>
      <HStack justifyContent="space-between" w="100%">
        <styled.span fontSize={15} color="quizard.black" fontWeight="500">
          {title}
        </styled.span>
        <IconButton size="sm" py={0.5} px={1} variant="ghost" onClick={handleClose}>
          <XIcon color="#737080" />
        </IconButton>
      </HStack>
      <HStack alignItems="start" w="100%">
        {React.Children.map(children, (child, index) => (
          <styled.div key={index} flexShrink={index === 0 ? 0 : 1} flexGrow={index === 1 ? 1 : 0}>
            {child}
          </styled.div>
        ))}
      </HStack>
    </VStack>
  );
}
