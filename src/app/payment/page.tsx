'use client';

import { FeedbackResult } from '@/features/payment/feedback-result';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VStack } from 'styled-system/jsx';

type SearchPageParams = {
  success?: string;
  failure?: string;
};

export default function Payment({ searchParams }: { searchParams: SearchPageParams }) {
  const { t } = useTranslation();

  const isCheckoutSuccessful = !!searchParams?.success;
  useEffect(() => {
    if (isCheckoutSuccessful) {
      mixpanel.track(EventName.CheckoutSuccess);
    }
  }, [isCheckoutSuccessful]);
  return (
    <>
      <VStack alignItems="center" justify="center" w="100%">
        <FeedbackResult
          desc={
            isCheckoutSuccessful ? t('payment.feedback.description.success') : t('payment.feedback.description.failure')
          }
          isSuccess={isCheckoutSuccessful}
          title={isCheckoutSuccessful ? t('payment.feedback.title.success') : t('payment.feedback.title.failure')}
        />
      </VStack>
    </>
  );
}
