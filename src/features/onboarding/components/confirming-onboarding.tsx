import { SpinningIcon } from '@/components/spinning-icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VStack, styled } from 'styled-system/jsx';

export const ConfirmingOnboarding = () => {
  const { t } = useTranslation();

  return (
    <VStack h="100vh" justify="center">
      <styled.h1 color="#5C5C5C" fontWeight={'600'} textStyle="lg" textAlign={'center'}>
        {t('onboarding.confirm.title')}
      </styled.h1>
      <SpinningIcon />
    </VStack>
  );
};
