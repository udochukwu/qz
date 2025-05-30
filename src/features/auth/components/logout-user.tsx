'use client';

import { signOut } from 'next-auth/react';
import { useMutation } from 'react-query';
import { AuthService } from '../services/auth-services';
import { useEffect } from 'react';
import { VStack } from 'styled-system/jsx';
import { SpinningIcon } from '@/components/spinning-icon';
import { useRouter } from 'next13-progressbar';
import { FailedLogout } from './failed-logout';

interface Props {
  isSession?: boolean;
}

export const LogoutUser = ({ isSession = false }: Props) => {
  const router = useRouter();
  const { mutate: logout, isError } = useMutation(AuthService.logout, {
    onSuccess: () => {
      signOut({ callbackUrl: '/auth/login', redirect: true });
    },
    onError: () => {
      router.push('/');
    },
  });

  useEffect(() => {
    if (isSession) {
      logout();
    }
  }, []);

  return (
    <section>
      <VStack h="100vh" w="100%" justify="center">
        {isError ? <FailedLogout logout={() => logout()} /> : <SpinningIcon />}
      </VStack>
    </section>
  );
};
