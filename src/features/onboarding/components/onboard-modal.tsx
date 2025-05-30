'use client';

import { OnboardingStudyLevel } from '@/features/onboarding/components/onboarding-study-level';
import { useGetOnboardingSteps } from '@/features/onboarding/hooks/get-onboarding-v2-step';
import { OnboardingQuestions } from '@/features/onboarding/components/onboarding-questions';
import { useSearchParams } from 'next/navigation';
import { Dialog } from '@/components/elements/dialog';
import { Stack } from 'styled-system/jsx';
import { useState, useEffect } from 'react';
import { UpgradePlanContent } from '@/features/paywall/components/upgrade-plan-content';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';
import { Button } from '@/components/elements/button';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';
import { usePaywallStore } from '@/stores/paywall-store';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';

const MotionButton = motion(Button);
/**
 * Onboarding is built with the assumption that the study level question will always be at the beginning. Changing this would change the number logic.
 */
export function OnboardModal() {
  const { t } = useTranslation();
  const { experiments } = useUserStore();

  const { is_onboarded, study_level_step, questions, isLoading } = useGetOnboardingSteps();

  //If current tab in Record don't show the onboarding (for lecture.new )
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const { isPaywallEnabled, setIsPaywallEnabled } = usePaywallStore();
  //const { displayTutorial } = useTutorialStore();

  const { data: subscriptionStatus } = useSubscriptionStatus();

  const onFinishQuestions = () => {
    mixpanel.track(EventName.OnboardingQuestionsCompleted);
    if (!subscriptionStatus?.is_pro) {
      setIsPaywallEnabled(true);
    } else {
      //displayTutorial();
    }
  };

  const onContinuePaywall = () => {
    setIsPaywallEnabled(false);
    //displayTutorial();
  };

  const isModalOpen = !is_onboarded || isPaywallEnabled;

  const isOpen = currentTab !== 'Record' && !isLoading && isModalOpen;

  const questionsLength = questions?.length ?? 0;

  useEffect(() => {
    if (isOpen) {
      mixpanel.track(EventName.OnboardingStarted);
    }
  }, [isOpen]);
  const isDelayedSkipButtonExperiment = experiments && experiments['delayed-skip-button-experiment-v3'];
  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => {}}>
          <Dialog.Positioner>
            <Dialog.Content w={!isPaywallEnabled ? 'md' : 'auto'}>
              <Stack p={8} gap={4}>
                {!is_onboarded && study_level_step && !isPaywallEnabled && (
                  <OnboardingStudyLevel questionLength={questionsLength + 1} />
                )}
                {!is_onboarded && !study_level_step && !isPaywallEnabled && (
                  <OnboardingQuestions questions={questions} onFinishQuestions={onFinishQuestions} />
                )}
                {isPaywallEnabled && !subscriptionStatus?.is_pro && (
                  <Stack>
                    <UpgradePlanContent referrer="onboarding" />
                    <MotionButton
                      initial={{
                        opacity: isDelayedSkipButtonExperiment ? 0 : 1,
                        y: isDelayedSkipButtonExperiment ? 10 : 0,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: isDelayedSkipButtonExperiment ? 3 : 0,
                          type: isDelayedSkipButtonExperiment ? 'spring' : 'none',
                          bounce: isDelayedSkipButtonExperiment ? 0 : undefined,
                        },
                      }}
                      alignSelf="flex-end"
                      onClick={onContinuePaywall}>
                      {t('common.skip')}
                    </MotionButton>
                  </Stack>
                )}
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Modal>
      )}
    </>
  );
}
