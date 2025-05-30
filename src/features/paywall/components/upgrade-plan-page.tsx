'use client';
import React, { useState } from 'react';
import { Flex, HStack, styled } from 'styled-system/jsx';
import { Button } from '@/components/elements/button';
import { useSubscriptionList } from '../hooks/use-subscription-list';
import { useSubscribe } from '../hooks/use-subscribe';
import { SubscriptionTerm } from '../types';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { ReasonType } from '@/types';
import { useUserStore } from '@/stores/user-store';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { css } from 'styled-system/css';
import Timeline from './time-line';
import { capitalizeFirstLetter } from '@/utils/helpers';
import ChatIcon from './assets/chat-icon';
import FileIcon from './assets/file-icon';
import VideoIcon from './assets/video-icon';
import WaveIcon from './assets/wave-icon';
import BrainIcon from './assets/brain-icon';
import FrequentlyAskedQuestions from './frequently-asked-question';
import JoinStudents from './join-students';

interface UpgradePlanProps {
  referrer: ReasonType;
}

export const UpgradePlan = ({ referrer }: UpgradePlanProps) => {
  const { experiments } = useUserStore();
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<SubscriptionTerm>(SubscriptionTerm.Yearly);
  const { data: subscriptionList, isLoading, isError } = useSubscriptionList();
  const subscribe = useSubscribe();
  const features = [
    {
      title: t('purchase.features.feat1'),
      icon: <ChatIcon width={23} height={23} />,
    },
    {
      title: t('purchase.features.feat2'),
      icon: <FileIcon width={20} height={26} />,
    },
    {
      title: t('purchase.features.feat3'),
      icon: <WaveIcon width={22} height={22} />,
    },
    {
      title: t('purchase.features.feat4'),
      icon: <VideoIcon width={26} height={18} />,
    },
    {
      title: t('purchase.features.feat5'),
      icon: <BrainIcon width={26} height={26} />,
    },
  ];

  const schools = [
    {
      src: '/images/Yale.svg',
      alt: t('landing.cover.imgAltText.yaleUniLogo'),
    },
    {
      src: '/images/westfield.svg',
      alt: t('landing.cover.imgAltText.westFieldUniLogo'),
    },
    {
      src: '/images/iup.svg',
      alt: t('landing.cover.imgAltText.uipLogo'),
    },
    {
      src: '/images/stanford.svg',
      alt: t('landing.cover.imgAltText.stanfordUniLogo'),
    },
    {
      src: '/images/miami-university.svg',
      alt: t('landing.cover.imgAltText.miamiUniLogo'),
    },
    {
      src: '/images/john-hopkins.svg',
      alt: t('landing.cover.imgAltText.johnHopkinsUniLogo'),
    },
  ];

  const handleSubscribe = async () => {
    try {
      const response = await subscribe({ subscription_term: billingCycle });
      if (response.success) {
        mixpanel.track(EventName.CheckoutStarted, {
          referrer,
          subscription_term: billingCycle,
          total_price: getTotalPrice(
            billingCycle,
            subscriptionList?.subscriptions[0]?.currency ?? '',
            subscriptionList?.subscriptions[0]?.total_price ?? 0,
          ),
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

  const getTotalPrice = (cycle: string, currency: string, price: number) => {
    if (isLoading || isError || !subscriptionList) return t('common.loading');
    const selectedPlan = subscriptionList.subscriptions.find(sub => sub.term === cycle);
    return selectedPlan ? getPriceWithCurrencySymbol(currency, price) : 'N/A';
  };
  const isTrialAvailable = subscriptionList?.eligible_for_trial;

  return (
    <styled.main display="flex" h="100%" overflow="hidden" flexDir={{ base: 'column', md: 'row' }}>
      {/* Left Column */}
      <styled.div
        overflowY="auto"
        overflowX="hidden"
        w={{ base: '100%', md: '60%' }}
        bg={'white'}
        pb={{ base: '100px', md: '0' }}
        css={{
          scrollbarWidth: 'none',
        }}>
        <styled.section paddingLeft={'5rem'} paddingRight={'3rem'} mt={'3rem'}>
          <h1
            className={css({
              fontSize: { lg: '2.5rem', xl: '3rem', '2xl': '3.6rem' },
              fontWeight: '700',
              color: '#3E3C46',
              lineHeight: '4.3rem',
              mb: '0px !important',
            })}>
            <span>{isTrialAvailable ? t('purchase.title1.part1') : t('purchase.title1_no_trial')}</span>
            {isTrialAvailable && (
              <>
                <styled.span
                  className={css({
                    color: 'white',
                    px: { base: '2', md: '3' },
                    py: { base: '0.5', md: '1' },
                    mx: '2px',
                    borderRadius: '8px',
                    position: 'relative',
                    display: 'inline-block',
                    zIndex: '1',
                    whiteSpace: { base: 'nowrap', md: 'normal' },
                    _after: {
                      bg: 'primary.9',
                      content: '""',
                      color: 'black',
                      zIndex: '-1',
                      inset: '0',
                      position: 'absolute',
                      transform: { base: 'rotate(1deg)', md: 'rotate(2deg)' },
                      borderRadius: 'inherit',
                    },
                  })}>
                  {t('purchase.title1.part2')}
                </styled.span>
                <span>{t('purchase.title1.part3')}</span>
              </>
            )}
          </h1>
          <p className={css({ color: '#3E3C46B2', fontSize: { lg: '1rem', xl: '1.3rem', '2xl': '1.6rem' }, mt: '0' })}>
            {isTrialAvailable ? t('purchase.subtitle1') : t('purchase.subtitle1_no_trial')}
          </p>

          <styled.div>
            {features.map((feature, ind) => (
              <FeatureItem key={ind} icon={feature.icon} text={feature.title} />
            ))}
          </styled.div>
        </styled.section>

        <JoinStudents />

        <styled.section mt="10" paddingLeft={'5rem'} paddingRight={'3rem'}>
          <h3
            className={css({
              fontSize: { lg: '1rem', xl: '1.3rem', '2xl': '1.6rem' },
              color: '#3E3C46',
              fontWeight: '500',
              mb: '6',
            })}>
            {t('purchase.subtitle2')}
          </h3>
          <HStack gap={2} flexWrap="wrap" width="100%" mt="5">
            {schools.map((school, ind) => (
              <Image
                src={school.src}
                alt={school.alt}
                key={ind}
                width={100}
                height={100}
                objectFit="contain"
                className={css({
                  mx: { base: ind == 0 ? '0' : '1', md: ind == 0 ? '0' : '3' },
                  mb: '2',
                })}
              />
            ))}
          </HStack>
        </styled.section>
        <FrequentlyAskedQuestions />
      </styled.div>

      {/* Divider - hide on mobile */}
      <styled.div
        bg="#6D56FA99"
        w={{ base: '100%', md: '1px' }}
        h={{ base: '1px', md: 'auto' }}
        mx="0"
        display={{ base: 'none', md: 'block' }}
      />

      {/* Right Column - Fixed Button Container */}
      <styled.div
        overflowY="hidden"
        w={{ base: '100%', md: '40%' }}
        bg="#FBFAFF"
        display={'flex'}
        alignItems="center"
        position={{ base: 'fixed', md: 'static' }}
        bottom={{ base: 0, md: 'auto' }}
        left={0}
        p={{ base: 4, md: 0 }}
        borderTopWidth={{ base: '1px', md: 0 }}
        borderTopColor="gray.200"
        boxShadow={{ base: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)', md: 'none' }}
        zIndex={2}>
        <styled.div w="100%" px={{ base: '1rem', md: '4rem' }}>
          {/* Hide trial info and timeline on mobile */}
          {isTrialAvailable && (
            <styled.div display={{ base: 'none', md: 'block' }}>
              <p
                className={css({
                  fontSize: { md: '1.5rem', lg: '2.5rem', xl: '3rem', '2xl': '3.5rem' },
                  fontWeight: '700',
                  mt: '2rem',
                  lineHeight: '1',
                  mb: { lg: '5', '2xl': '7' },
                  color: '#3E3C46',
                })}>
                {t('purchase.title4')}
              </p>
              <Timeline />
            </styled.div>
          )}

          <styled.div w="100%">
            {/* Hide plan selection on mobile */}
            <styled.div display={{ base: 'none', md: 'block' }}>
              <h3
                className={css({
                  fontSize: { md: '0.8rem', lg: '1rem', '2xl': '1.4rem' },
                  fontWeight: '600',
                  color: '#3E3C46',
                })}>
                {t('purchase.subtitle4')}
              </h3>
              <Flex mb="2rem" gap={4}>
                {subscriptionList?.subscriptions
                  ?.map((sub, index) => {
                    return (
                      <PlanCard
                        onClick={() => {
                          setBillingCycle(sub.term as SubscriptionTerm);
                        }}
                        key={index}
                        type={sub.term}
                        isSelected={sub.term === billingCycle}
                        pricePerMonth={getPrice(sub.term as SubscriptionTerm)}
                        trialPrice={subscriptionList.subscriptions[index].per_month_price.toString()}
                        isBestDeal={sub.term === SubscriptionTerm.Yearly}
                        totalPrice={
                          sub.term === SubscriptionTerm.Yearly
                            ? getTotalPrice(sub.term, sub.currency, sub.total_price)
                            : ''
                        }
                      />
                    );
                  })
                  .reverse()}
              </Flex>
            </styled.div>

            {/* Show only button on mobile */}
            <Button
              onClick={handleSubscribe}
              className={css({
                w: 'full',
                bg: 'primary.500',
                fontSize: { base: '1rem', lg: '1rem', '2xl': '1.4rem' },
                paddingY: { base: '16px', lg: '24px', '2xl': '28px' },
                marginBottom: { base: '3rem', md: '0rem' },
                borderRadius: '12px',
                _hover: { bg: 'primary.600' },
              })}>
              <styled.div marginY={{ base: '12px', md: '24px' }}>
                {isTrialAvailable ? t('purchase.start-free-trial') : t('purchase.upgrade-now')}
              </styled.div>
            </Button>
          </styled.div>
        </styled.div>
      </styled.div>
    </styled.main>
  );
};

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <styled.div className={css({ display: 'flex', alignItems: 'center', my: '4.5' })}>
      <styled.div w="10">{icon}</styled.div>
      <styled.p fontSize={{ lg: '1rem', xl: '1.3rem', '2xl': '1.6rem' }} mt="0" mb="0" color="#3E3C46" fontWeight="500">
        {text}
      </styled.p>
    </styled.div>
  );
}

function PlanCard({
  type,
  pricePerMonth,
  trialPrice,
  isBestDeal,
  isSelected,
  totalPrice,
  onClick,
}: {
  type: string;
  pricePerMonth: string;
  trialPrice: string;
  isBestDeal?: boolean;
  totalPrice?: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <styled.div
      onClick={onClick}
      className={css({
        p: { md: '2', lg: '2.5', '2xl': '3' },
        cursor: 'pointer',
        mt: '4',
        display: 'flex',
        position: 'relative',
        background: isBestDeal ? 'white' : 'transparent',
        justifyContent: 'space-between',
        flexDir: 'column',
        borderRadius: 'lg',
        h: { lg: '135px', '2xl': '160px' },
        width: '100%',
        borderWidth: '2px',
        borderColor: isSelected ? 'primary.9' : 'white',
      })}>
      {isBestDeal && (
        <styled.div
          top="-3"
          right="-2"
          pos="absolute"
          bg="primary.9"
          py="4px"
          px={'7px'}
          transform="rotate(10deg)"
          borderRadius="7px">
          <p
            className={css({
              m: '0 !important',
              color: 'white',
              fontSize: { md: '0.6rem', lg: '0.6rem', '2xl': '1rem' },
            })}>
            {t('purchase.best-deal')}
          </p>
        </styled.div>
      )}
      <styled.div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
        <span className={css({ fontWeight: '600', fontSize: { md: '0.8rem', lg: '1rem', '2xl': '1.5rem' } })}>
          {capitalizeFirstLetter(type)}
        </span>
      </styled.div>
      <styled.div>
        <styled.div m="0">
          <styled.span
            className={css({
              fontSize: { md: '1rem', lg: '1.2rem', '2xl': '1.6rem' },
              fontWeight: '500',
              color: '#3E3C46',
              m: '0',
            })}>
            ${trialPrice}
          </styled.span>
          <styled.span fontWeight="500" fontSize={{ md: '0.5rem', lg: '0.5rem', '2xl': '0.8rem' }} color="#3E3C46">
            {t('purchase.mo')}
          </styled.span>
          {type === SubscriptionTerm.Yearly && (
            <styled.span
              className={css({
                color: '#8B8A90',
                fontWeight: '500',
                ml: '2',
                fontSize: { md: '0.7rem', lg: '0.7rem', '2xl': '1.2rem' },
                position: 'relative',
                display: 'inline-block',
                textDecoration: 'none',
                _after: {
                  content: '""',
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '50%',
                  height: '1.5px',
                  backgroundColor: '#8B8A90',
                  transform: 'rotate(-10deg) translateY(-50%)',
                },
              })}>
              {pricePerMonth}
            </styled.span>
          )}
        </styled.div>
        <styled.div>
          {type === SubscriptionTerm.Yearly && (
            <p
              className={css({
                fontWeight: '500',
                m: '0',
                fontSize: { md: '0.6rem', lg: '0.6rem', '2xl': '0.8rem' },
                color: '#3E3C4699',
              })}>
              {`${totalPrice} ${t('newChatView.onboarding.upgradePlan.billed')} (${t('common.save')}
          ${42}%)`}
            </p>
          )}
          <p
            className={css({
              fontWeight: '500',
              m: '0',
              fontSize: { md: '0.6rem', lg: '0.6rem', '2xl': '0.8rem' },
              color: '#3E3C4699',
            })}>
            {t('purchase.cancel-anytime')}
          </p>
        </styled.div>
      </styled.div>
    </styled.div>
  );
}
