'use client';
import React, { useEffect, useMemo } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useRouter } from 'next13-progressbar';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import { ConfirmModalEmoji } from '@/features/class/components/confirm-modal-emoji';
import { useCreateWorkspace } from '@/features/class/hooks/use-create-workspace';
import { useTourStore } from '@/features/onboarding/stores/tour-store';
import { useImportShare } from '@/hooks/use-import-share';
import toast from 'react-hot-toast';
import { Button } from '@/components/elements/button';
import { Flex, styled } from 'styled-system/jsx';
import { useProductTourStatus, useCompleteProductTour } from '@/hooks/use-product-tour';
import { useGetOnboardingSteps } from '@/features/onboarding/hooks/get-onboarding-v2-step';
import { usePaywallStore } from '@/stores/paywall-store';
import { EventName } from '@/providers/custom-tracking-provider';
import { usePathname } from 'next/navigation';
const SHARE_ID = 'cbefad65-1706-4aa2-8fca-1fc2998c1f7c';
export function ProductTour() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: createWorkspace, isLoading: isCreateClassLoading } = useCreateWorkspace();

  // Get product tour status
  const { data: productTourStatus, isLoading: isProductTourStatusLoading } = useProductTourStatus();
  const { mutate: completeProductTour } = useCompleteProductTour();
  const { is_onboarded } = useGetOnboardingSteps();
  const { isPaywallEnabled } = usePaywallStore();
  // Pull tour state directly from the zustand store
  const {
    isTourActive,
    stepIndex,
    workspaceId,
    classNameInput,
    setIsTourActive,
    setStepIndex,
    setWorkspaceId,
    setClassNameInput,
  } = useTourStore();

  //only start tour if we are in home page, so we check the pathname
  const pathname = usePathname();

  const shouldStartTour = useMemo(() => {
    if (pathname !== '/') {
      return false;
    }
    return (
      !isProductTourStatusLoading &&
      productTourStatus &&
      !productTourStatus.product_tour_completed &&
      !isTourActive &&
      is_onboarded &&
      !isPaywallEnabled
    );
  }, [isProductTourStatusLoading, productTourStatus, isTourActive, is_onboarded, isPaywallEnabled, pathname]);

  // Check product tour status and activate if needed
  useEffect(() => {
    if (shouldStartTour) {
      setIsTourActive(true);
      mixpanel.track(EventName.ProductTourStarted, {
        source: 'automatic_activation',
      });
    }
  }, [shouldStartTour, setIsTourActive]);

  // Control whether the "Create Class" modal is open
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = React.useState(false);
  const { mutate: importShare, isLoading: isImportShareLoading } = useImportShare(response => {
    if (!response) {
      toast.error(t('share.import.failure'));
      return;
    }

    toast.success(t('share.import.success'));
    router.push(`/c/${response.id}`);
    //add delay
    setStepIndex(7);
  });

  const isNextLoading = isImportShareLoading || isCreateClassLoading;

  const createStepElement = (
    content: string,
    options?: {
      showBack?: boolean;
      showSkip?: boolean;
      isLastStep?: boolean;
      loading?: boolean;
      isDisabled?: boolean;
      onNext?: () => void;
      onBack?: () => void;
      onSkip?: () => void;
    },
  ) => (
    <div>
      <styled.p p={0} mb={0} fontSize="md" fontWeight="medium" color="gray.700" lineHeight="1.5" letterSpacing="tight">
        {content}
      </styled.p>
      <Flex justify="flex-end" gap={1} mt={1}>
        <Button
          loading={options?.loading}
          onClick={options?.onNext ?? (() => setStepIndex(stepIndex + 1))}
          disabled={options?.isDisabled}>
          {options?.isLastStep ? t('common.finish') : t('common.next')}
        </Button>
        {options?.showSkip && (
          <Button
            variant="ghost"
            onClick={
              options.onSkip ??
              (() => {
                setIsTourActive(false);
                completeProductTour();
              })
            }>
            {t('common.skip')}
          </Button>
        )}
        {options?.showBack && (
          <Button variant="ghost" onClick={options.onBack}>
            {t('common.back')}
          </Button>
        )}
      </Flex>
    </div>
  );

  const steps: Step[] = [
    {
      target: '.create-new-class-button',
      content: createStepElement(t('onboarding.productTour.createClass.instruction'), {
        onNext: () => {
          setIsCreateClassModalOpen(true);
          setStepIndex(1);
        },
      }),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'auto',
      title: t('onboarding.productTour.createClass.title'),
      hideFooter: true,
    },
    {
      target: '.class-name-input',
      content: createStepElement(t('onboarding.productTour.namePrompt.instruction'), {
        loading: isNextLoading,
        onNext: () => {
          if (classNameInput.trim()) {
            handleCreateClass({ name: classNameInput.trim(), emoji: '📚' });
          }
        },
        isDisabled: !classNameInput.trim(),
      }),
      hideFooter: true,
      disableBeacon: true,
      spotlightClicks: true,
      title: t('onboarding.productTour.namePrompt.title'),
    },
    {
      placement: 'center',
      target: 'body',
      content: createStepElement(t('onboarding.productTour.quickActions.overview'), {
        loading: isNextLoading,
      }),
      title: t('onboarding.productTour.quickActions.title'),
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: '[data-quick-action="chat"]',
      content: createStepElement(t('onboarding.productTour.quickActions.chat'), {
        loading: isNextLoading,
      }),
      hideFooter: true,
      disableBeacon: true,
    },
    {
      target: '[data-quick-action="record"]',
      content: createStepElement(t('onboarding.productTour.quickActions.record'), {
        loading: isNextLoading,
      }),
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: '[data-quick-action="flashcards"]',
      content: createStepElement(t('onboarding.productTour.quickActions.flashcards'), {
        loading: isNextLoading,
      }),
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: '.file-manager',
      content: createStepElement(t('onboarding.productTour.fileManager.instruction'), {
        loading: isNextLoading,
      }),
      disableBeacon: true,
      hideFooter: true,
    },
    {
      placement: 'center',
      target: 'body',
      content: createStepElement(t('onboarding.productTour.sharedFile.instruction'), {
        loading: isNextLoading,
        onNext: () => {
          importShare({ share_id: SHARE_ID });
        },
      }),
      disableBeacon: true,
      hideFooter: true,
      title: t('onboarding.productTour.sharedFile.title'),
    },
    {
      target: '[data-suggestion="Summarize this"], [data-suggestion="Create a study note"]',
      content: createStepElement(t('onboarding.productTour.suggestedMessages.instruction'), {
        isLastStep: true,
        loading: isNextLoading,
      }),
      disableBeacon: true,
      hideFooter: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;
    console.log('step', step);
    console.log('status', status);
    console.log('type', type);
    if (status === STATUS.FINISHED) {
      setIsTourActive(false);
      completeProductTour();
      mixpanel.track(EventName.ProductTourCompleted, {
        status: status,
        workspace_id: workspaceId,
      });
      return;
    }
  };

  const handleCreateClass = ({ name, emoji }: { name: string; emoji: string }) => {
    const class_name = `${emoji} ${name}`;
    createWorkspace(
      { class_name, class_files: [] },
      {
        onSuccess: response => {
          setWorkspaceId(response.workspace_id);
          setIsCreateClassModalOpen(false);
          router.push(`/classes/${response.workspace_id}`);
          mixpanel.track(EventName.ProductTourClassCreated, {
            class_name: class_name,
            workspace_id: response.workspace_id,
          });
        },
      },
    );
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={isTourActive}
        stepIndex={stepIndex}
        continuous
        showSkipButton={false}
        disableCloseOnEsc
        disableOverlayClose
        hideBackButton
        hideCloseButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#6D56FA',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipContent: {
            padding: '5px',
          },
        }}
      />

      {isCreateClassModalOpen && (
        <ConfirmModalEmoji
          isOpen={isCreateClassModalOpen}
          setIsOpen={setIsCreateClassModalOpen}
          onConfirm={handleCreateClass}
          title={t('class.workspace.createNewClass')}
          confirmButtonText={t('common.create')}
          // Update class name in our zustand store
          onChange={(value: string) => setClassNameInput(value)}
        />
      )}
    </>
  );
}
