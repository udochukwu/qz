'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { HStack, styled, Box, Flex, VStack } from 'styled-system/jsx';
import Image from 'next/image';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';

const AppBanner = () => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsVisible(isIOS);
  }, []);

  if (!isVisible) return null;

  const handleDownloadApp = () => {
    mixpanel.track('Download App Banner Clicked');
  };

  return (
    <Flex width="100%" backgroundColor="quizard.black" px={4} py={3} justifyContent="space-between" alignItems="center">
      <HStack gap={3} alignItems="center">
        <Box position="relative" flexShrink={0}>
          <Image
            src="/images/app-Icon.png"
            width={40}
            height={40}
            alt="Unstuck App Icon"
            style={{ borderRadius: '10px' }}
          />
        </Box>
        <VStack gap={0} alignItems="flex-start" justifyContent="center">
          <styled.span fontSize="md" fontWeight={500} color="white" lineHeight="normal">
            {t('user.appBanner.title')}
          </styled.span>
          <styled.span fontSize="sm" color="rgba(255, 255, 255, 0.8)" lineHeight="normal">
            {t('user.appBanner.description')}
          </styled.span>
        </VStack>
      </HStack>

      <HStack gap={3}>
        <styled.a
          href="https://apps.apple.com/us/app/unstuck-ai-notes-transcribe/id6714484560"
          target="_blank"
          rel="noopener noreferrer"
          backgroundColor="white"
          color="rgba(109, 86, 250, 1)"
          px={4}
          py={2}
          borderRadius="lg"
          onClick={handleDownloadApp}
          fontSize="sm"
          fontWeight={500}
          _hover={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}>
          {t('common.download')}
        </styled.a>
        <styled.button
          onClick={() => setIsVisible(false)}
          color="white"
          _hover={{
            color: 'rgba(255, 255, 255, 0.8)',
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          aria-label={t('user.appBanner.close')}>
          <X size={20} />
        </styled.button>
      </HStack>
    </Flex>
  );
};

export default AppBanner;
