'use client';
import { Button } from '@/components/elements/button';
import { AuthService } from '@/features/auth/services/auth-services';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { VStack, styled } from 'styled-system/jsx';
import { FailedLogout } from './failed-logout';
import { useTranslation } from 'react-i18next';

interface Props {
  isSession?: boolean;
}

export const ExpireUser = ({ isSession = false }: Props) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const { mutate: logout, isError } = useMutation(AuthService.logout, {
    onSuccess: () => {
      signOut({ redirect: false });
    },
  });

  useEffect(() => {
    if (isSession) {
      logout();
    }
  }, []);

  return (
    <VStack h="100vh" w="100%" justify="center">
      <VStack gap={0}>
        <styled.h1>{t('auth.expiredSession.title')}</styled.h1>
        <styled.h1>{t('auth.expiredSession.subtitle')}</styled.h1>
      </VStack>
      {!isError && status === 'unauthenticated' && (
        <Link href="/auth/login">
          <Button>{t('auth.expiredSession.submit')}</Button>
        </Link>
      )}
      {isError && <FailedLogout logout={() => logout()} />}
    </VStack>
  );
};
