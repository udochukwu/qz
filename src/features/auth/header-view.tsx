'use client';
import React from 'react';
import { Flex, HStack, styled } from 'styled-system/jsx';
import { UnstuckLogo } from '@/components/unstuck-logo';
import { useRouter } from 'next13-progressbar';
export const HeaderView = () => {
  const router = useRouter();
  const handleLogoClick = () => {
    router.push('/');
  };
  return (
    <HStack padding={5}>
      <Flex alignItems="center">
        <styled.div onClick={handleLogoClick} _hover={{ cursor: 'pointer' }}>
          <UnstuckLogo />
        </styled.div>
      </Flex>
    </HStack>
  );
};
