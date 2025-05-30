// src/services/onboardingGuideService.ts
import { TooltipsProps } from '@/types';

export const OnboardingGuideService = {
  hasGuideBeanSeen: (guideId: string, tooltips: TooltipsProps | undefined): boolean => {
    const showTooltip = tooltips !== undefined && tooltips.tooltips[guideId] === true;
    // has been seen if showTooltip is false and vice versa
    return !showTooltip;
  },
};
