import React from 'react';
import { Box, Flex, styled } from 'styled-system/jsx';
import { CheckCircle2, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/elements/button';
import { SubscriptionTerm } from '../types';
import { useTranslation } from 'react-i18next';

type PriceDetails = {
  monthly: {
    price: string;
    savings?: string;
  };
  annual: {
    price: string;
    yearlyPrice: string;
    savingsRate: number | null;
  };
};

const PriceOption = ({
  label,
  price,
  isSelected,
  onClick,
  savings,
}: {
  label: string;
  price: string;
  isSelected: boolean;
  onClick: () => void;
  savings?: string;
}) => {
  return (
    <Button onClick={onClick} variant={'outline'} borderColor={isSelected ? '#6e56cf' : 'gray.200'}>
      <Flex w={'full'} justifyContent="space-between" alignItems="center" fontWeight={'normal'}>
        <Flex w={'full'}>
          <styled.span>{label}</styled.span>
          {savings && (
            <styled.span
              ml={2}
              fontSize={12}
              px={2.5}
              py={0.25}
              rounded={'md'}
              color="rgb(22, 101, 53)"
              bg={'rgb(220, 252, 232)'}>
              {savings}
            </styled.span>
          )}
        </Flex>
        <styled.span>
          {price}
          <styled.span pl={'2px'} color="rgba(0,0,0,.45)" fontSize={12}>
            /
          </styled.span>
          <styled.span color="rgba(0,0,0,.45)" fontSize={12}>
            {label === 'Annual' ? 'year' : 'month'}
          </styled.span>
        </styled.span>
      </Flex>
    </Button>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <Flex gap="2" alignItems="center" className="mb-2">
    <CheckCircle2 color="green" width={20} />
    <styled.span className="text-gray-600">{children}</styled.span>
  </Flex>
);

export const MinimalUpgradePlan = ({
  title,
  onSubscribe,
  priceDetails,
  billingCycle,
  setBillingCycle,
}: {
  title?: string;
  onSubscribe: (plan: 'monthly' | 'annual') => void;
  priceDetails: PriceDetails;
  billingCycle: SubscriptionTerm;
  setBillingCycle: (term: SubscriptionTerm) => void;
}) => {
  const { t } = useTranslation();

  const selectedPlan = billingCycle === SubscriptionTerm.Monthly ? 'monthly' : 'annual';

  const handlePlanChange = (plan: 'monthly' | 'annual') => {
    setBillingCycle(plan === 'monthly' ? SubscriptionTerm.Monthly : SubscriptionTerm.Yearly);
  };

  // Always show savings for annual plan regardless of selection
  const annualSavings = priceDetails.annual.savingsRate ? `Save ${priceDetails.annual.savingsRate}%` : undefined;

  return (
    <Flex gap={4} flexDirection={'column'}>
      <Box w={'100%'} gap={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <SparklesIcon size={20} color="#6D56FA" />
        <styled.h2 mb={0}>{t('newChatView.paywall.upgradePro')}</styled.h2>
      </Box>
      {title !== t('newChatView.upgradePlan.limit.base') && (
        <Box
          bg={'#6D56FA1F'}
          color={'#6D56FA'}
          border={'1px solid #6D56FA'}
          rounded={'md'}
          p={2}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}>
          <styled.span fontSize={14} color="gray.600">
            {title}
          </styled.span>
        </Box>
      )}
      <Box>
        <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.chat')}</FeatureItem>
        <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.fileUploads')}</FeatureItem>
        <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.recordings')}</FeatureItem>
        <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.unlimited.youtubeUploads')}</FeatureItem>
        <FeatureItem>{t('newChatView.onboarding.upgradePlan.features.numberOne')}</FeatureItem>
      </Box>
      <Flex flexDir={'column'} gap={2}>
        <PriceOption
          label={t('newChatView.onboarding.upgradePlan.annual')}
          price={priceDetails.annual.yearlyPrice}
          savings={annualSavings}
          isSelected={selectedPlan === 'annual'}
          onClick={() => handlePlanChange('annual')}
        />
        <PriceOption
          label={t('newChatView.onboarding.upgradePlan.monthly')}
          price={priceDetails.monthly.price}
          savings={priceDetails.monthly.savings}
          isSelected={selectedPlan === 'monthly'}
          onClick={() => handlePlanChange('monthly')}
        />
      </Flex>
      <Button onClick={() => onSubscribe(selectedPlan)}>{t('newChatView.paywall.upgradeNow')}</Button>
    </Flex>
  );
};

export default MinimalUpgradePlan;
