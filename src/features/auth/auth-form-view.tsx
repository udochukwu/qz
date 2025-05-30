'use client';
import React from 'react';
import { UnstuckLogo } from '@/components/unstuck-logo';
import { GTWalsheim } from '@/fonts/GTWalsheim';
import { styled, Flex } from 'styled-system/jsx';
import { useRouter } from 'next13-progressbar';
import SignInButtons from './components/sign-in-button';
import { useTranslation } from 'react-i18next';

interface AuthFormViewProps {
  title: string | string[];
}

export const AuthFormView = ({ title }: AuthFormViewProps) => {
  const { t } = useTranslation();

  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'#ffffff'}
      height={'50vh'}
      border={'1.5px solid rgba(21, 17, 43, 0.1)'}
      width={{ base: '80%', md: '40%' }}
      margin={'auto'}
      padding={'20px'}
      borderRadius={'20px'}>
      <styled.div onClick={handleLogoClick} _hover={{ cursor: 'pointer' }}>
        <UnstuckLogo />
      </styled.div>
      <styled.h1 marginBottom={0} fontWeight={500} fontSize={[16, 24]} color={'rgba(13, 13, 18, 1)'}>
        {typeof title === 'string' ? t(title) : title.map(ti => t(ti)).join(' ')}
      </styled.h1>
      <styled.span color={'rgba(13, 13, 18, 0.6)'} fontSize={[14, 18]} fontWeight={500} marginBottom={19}>
        {t('auth.subtitle')}
      </styled.span>
      <SignInButtons />
    </Flex>
  );
};
