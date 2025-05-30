'use client';

import { useBoolean } from '@/hooks/use-boolean';
import { FrownIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { Divider, styled, VStack } from 'styled-system/jsx';

interface ResponsiveProps {
  children: React.ReactNode;
  minWidth?: number;
}

export const BlockUIFromMobile: React.FC<ResponsiveProps> = ({ children, minWidth = 768 }) => {
  const { t } = useTranslation();

  const initWidth = typeof window !== 'undefined' && window ? window?.innerWidth < minWidth : Infinity;

  const [isSmallScreen, setIsSmallScreen] = useState(initWidth);

  const isHydrated = useBoolean();

  useEffect(() => {
    isHydrated.setTrue();
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < minWidth);
      };

      handleResize();

      window?.addEventListener('resize', handleResize);
      return () => {
        window?.removeEventListener('resize', handleResize);
      };
    }
  }, [minWidth]);

  //TODO: Remove false from the below condition to enable the block UI for small screens
  return (
    <>
      {isSmallScreen && isHydrated.value && false ? (
        <styled.section h="100svh" display="flex" flexDir="column" justifyContent="center" alignItems="center" px={8}>
          <VStack maxW="4xl" textAlign="center" mx="auto" p={8} border="2px dashed #A294FA">
            <FrownIcon size={64} className={css({ fontSize: '64px', color: '#6D56FA' })} />
            <styled.h3 textStyle="2xl" fontWeight="normal">
              <styled.span fontWeight="medium">{t('common.sorry')}!</styled.span>
              <span>&nbsp;{t('user.blockUi.title')}</span>
            </styled.h3>
            <styled.p textStyle="lg" color="#4F4F4F">
              {t('user.blockUi.description')}
            </styled.p>
            <Divider w="100%" />
          </VStack>
        </styled.section>
      ) : (
        children
      )}
    </>
  );
};
