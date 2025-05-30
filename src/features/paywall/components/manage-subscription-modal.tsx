'use client';

import { Dialog } from '@/components/elements/dialog';
import { Portal } from '@ark-ui/react/portal';
import { useState } from 'react';
import { useManageSubscriptionModalStore } from '../stores/manage-subscription-modal';
import { SubscriptionCancelFormData } from '../types';
import { CancelConfirmation } from './manage-subscription/cancel-confirmation';
import { CancelReason } from './manage-subscription/cancel-reason';
import { CurrentPlan } from './manage-subscription/current-plan';
import { Feedback } from './manage-subscription/feedback';
import { Modal } from '@/components/modal/modal';

const stepComponents = {
  currentPlan: CurrentPlan,
  cancelConfirmation: CancelConfirmation,
  cancelReason: CancelReason,
  feedback: Feedback,
};

const stepOrder = ['currentPlan', 'cancelConfirmation', 'cancelReason', 'feedback'];

export const ManageSubscriptionModal = () => {
  const { isOpen, setIsOpen } = useManageSubscriptionModalStore();

  const [currentStep, setCurrentStep] = useState('currentPlan');
  const [formData, setFormData] = useState<SubscriptionCancelFormData>({ cancelReason: '', feedback: '' });

  const handleOpen = (open: boolean) => {
    setCurrentStep('currentPlan');
    setIsOpen(open);
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      setIsOpen(false);
      setCurrentStep('currentPlan');
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prevData => ({ ...prevData, ...data }));
  };

  // @ts-ignore
  const StepComponent = stepComponents[currentStep];

  return (
    <>
      <Modal isOpen={!!isOpen} onOpenChange={e => handleOpen(e)} lazyMount>
        <StepComponent
          onNext={handleNext}
          onBack={handleBack}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      </Modal>
    </>
  );
};
