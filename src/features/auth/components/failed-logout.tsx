import { Button } from '@/components/elements/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VStack, styled } from 'styled-system/jsx';

interface Props {
  logout: VoidFunction;
}

export const FailedLogout = ({ logout }: Props) => {
  const { t } = useTranslation();

  return (
    <VStack gap={0}>
      <styled.p color="red.5">{t('auth.failedLogout.title')}</styled.p>
      <Button onClick={logout}>{t('auth.failedLogout.submit')}</Button>
    </VStack>
  );
};
