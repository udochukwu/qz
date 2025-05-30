'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Box, Flex, styled, VStack } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import { SegmentGroup } from '@/components/elements/segment-group';
import LearnSvg from './assets/learn';
import { useSubscriptionList } from '../hooks/use-subscription-list';
import { useSubscribe } from '../hooks/use-subscribe';
import { SubscriptionTerm } from '../types';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { ReasonType } from '@/types';
import { useUserStore } from '@/stores/user-store';
import { useTranslation } from 'react-i18next';

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <Flex gap="16px">
    <CheckCircle color="#6D56FA" />
    <styled.span color="fg.muted">{children}</styled.span>
  </Flex>
);

export const UpgradePlanContent = ({ referrer }: { referrer: ReasonType }) => {
  const { experiments } = useUserStore();
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<SubscriptionTerm>(SubscriptionTerm.Yearly);
  const { data: subscriptionList, isLoading, isError } = useSubscriptionList();
  const subscribe = useSubscribe();

  useEffect(() => {
    if (referrer) {
      mixpanel.track(EventName.ViewedUpgradePlan, {
        referrer,
        current_url: window.location.href,
        experiments,
      });
    }
  }, [referrer]);
  const options = [
    { id: SubscriptionTerm.Monthly, label: t('newChatView.onboarding.upgradePlan.monthly'), disabled: false },
    { id: SubscriptionTerm.Yearly, label: t('newChatView.onboarding.upgradePlan.yearly'), disabled: false },
  ];

  const handleSubscribe = async () => {
    try {
      const response = await subscribe({ subscription_term: billingCycle });
      if (response.success) {
        mixpanel.track(EventName.CheckoutStarted, {
          referrer,
          subscription_term: billingCycle,
          total_price: getTotalPrice(),
          currency: subscriptionList?.subscriptions[0]?.currency,
          experiments,
        });
        window.location.href = response.checkout_page_url;
      } else {
        // Handle unsuccessful subscription attempt
        console.error('Subscription was not successful');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  const getPriceWithCurrencySymbol = (currency: string, price: number) => {
    return new Intl.NumberFormat('en-IN', { currency: currency, style: 'currency' }).format(price);
  };

  const getPrice = (billingCycle: SubscriptionTerm) => {
    if (isLoading || isError || !subscriptionList) return t('common.loading');
    const selectedPlan = subscriptionList.subscriptions.find(sub => sub.term === billingCycle);
    return selectedPlan ? getPriceWithCurrencySymbol(selectedPlan.currency, selectedPlan.per_month_price) : 'N/A';
  };

  const getTotalPrice = () => {
    if (isLoading || isError || !subscriptionList) return t('common.loading');
    const selectedPlan = subscriptionList.subscriptions.find(sub => sub.term === billingCycle);
    return selectedPlan ? getPriceWithCurrencySymbol(selectedPlan.currency, selectedPlan.total_price) : 'N/A';
  };

  const getSavingRate = () => {
    if (isLoading || isError || !subscriptionList) return null;
    const selectedPlan = subscriptionList.subscriptions.find(sub => sub.term === billingCycle);
    return selectedPlan?.saving_rate;
  };
  const getTitle = () => {
    switch (referrer) {
      case 'message-limit':
        return t('newChatView.onboarding.upgradePlan.limit.message');
      case 'flashcard-limit':
        return t('flashcards.limit.message');
      case 'recording-limit':
        return t('newChatView.onboarding.upgradePlan.limit.recording');
      case 'document-limit':
        return t('newChatView.onboarding.upgradePlan.limit.document');
      case 'youtube-limit':
        return t('newChatView.onboarding.upgradePlan.limit.youtube');
      case 'quiz-limit':
        return t('newChatView.onboarding.upgradePlan.limit.quiz');
      case 'quiz-unlimited-questions-reached':
        return t('newChatView.onboarding.upgradePlan.limit.quiz-unlimited-questions-reached');
      default:
        return t('newChatView.onboarding.upgradePlan.limit.base');
    }
  };

  return (
    <>
      <Flex gap={10} justifyContent={'space-between'}>
        <Flex flexDir={'column'}>
          <VStack gap="2px" alignItems={'start'}>
            <styled.span m={0} fontSize={28} fontWeight={'semibold'}>
              {getTitle()}
            </styled.span>
            <styled.p fontSize={17} color={'fg.muted'} mb={'0px !important'}>
              <span>{t('newChatView.onboarding.upgradePlan.description')}</span>
            </styled.p>
          </VStack>
          <styled.hr color="#E5E7EB" />
          <VStack alignItems={'start'} gap={18} mb={'auto'} fontSize={15}>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.chat')}</FeatureItem>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.fileUploads')}</FeatureItem>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.recordings')}</FeatureItem>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.youtubeUploads')}</FeatureItem>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.flashcards')}</FeatureItem>
            <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.numberOne')}</FeatureItem>
          </VStack>
          <styled.h3 fontSize={24} alignSelf="start">
            <span>{t('chat.upgrade.join')} </span>
            <styled.span
              display={'inline-block'}
              fontSize={26}
              color="white"
              bg={'#6D56FA'}
              borderRadius={5}
              px={'6px'}
              mr={'4px'}
              rotate={'-5.79deg'}>
              2M+
            </styled.span>
            <span>
              {t('common.students')} {t('chat.upgrade.trust')}
            </span>
          </styled.h3>
        </Flex>
        <Flex
          h={'436px'}
          w={'384px'}
          bg={'#6D56FA'}
          borderRadius={'12px'}
          p={'32px'}
          flexDir={'column'}
          justifyContent={'space-between'}>
          <SegmentGroup.Root
            defaultValue={billingCycle}
            value={billingCycle}
            onValueChange={details => {
              if (details.value === SubscriptionTerm.Monthly || details.value === SubscriptionTerm.Yearly) {
                setBillingCycle(details.value);
              }
            }}
            orientation="horizontal"
            zIndex={3}
            bg={'rgba(255, 255, 255, 0.12)'}
            alignSelf={'start'}>
            {options.map(option => (
              <SegmentGroup.Item key={option.id} value={option.id} disabled={option.disabled}>
                <SegmentGroup.ItemControl />
                <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
            <SegmentGroup.Indicator />
          </SegmentGroup.Root>
          <VStack alignItems={'start'} gap={8}>
            <Box top={'60px'} right={'30px'} position={'absolute'} zIndex={1}>
              <LearnSvg width={230} height={250} />
            </Box>
            <VStack alignItems={'start'} gap={0} color="white" fontSize={16}>
              <styled.span fontSize={24} fontWeight={'medium'}>
                {t('newChatView.onboarding.upgradePlan.premium')}
              </styled.span>
              <styled.span fontSize={48} fontWeight={'semibold'}>
                <span>{getPrice(billingCycle)}</span>{' '}
                <styled.span fontSize={16} fontWeight={'light'}>
                  <span>/</span>
                  <span>{'month'}</span>
                </styled.span>
              </styled.span>
              {billingCycle === SubscriptionTerm.Yearly && (
                <styled.span fontWeight={'light'}>
                  {getTotalPrice()} {t('newChatView.onboarding.upgradePlan.billed')} ({t('common.save')}{' '}
                  {getSavingRate()}%)
                </styled.span>
              )}
              <styled.span fontWeight={'light'}>{t('newChatView.onboarding.upgradePlan.cancel')}</styled.span>
            </VStack>
            <Button width="full" color="#6D56FA" bgColor="white" onClick={handleSubscribe}>
              {t('auth.common.getStarted')}
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};
