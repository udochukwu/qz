'use client';

import React from 'react';
import { Flex, Box, HStack, Wrap, styled, Stack, Divider } from 'styled-system/jsx';
import { LockIcon, FileTextIcon, HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { UnstuckLogo } from '@/components/unstuck-logo';
import { css } from 'styled-system/css';
import { useTranslation } from 'react-i18next';

export const FooterView = () => {
  const { t } = useTranslation();

  return (
    <styled.div w="100%" px={8}>
      <Divider />
      <styled.footer display="flex" flexDir="column" maxW="5xl" py={8} mx="auto" gap={8}>
        <HStack
          w="100%"
          justify="space-between"
          h="100%"
          alignItems="flex-start"
          flexDir={{ md: 'row', base: 'column' }}>
          <Stack gap={4} maxW={{ base: '100%', md: '300px' }}>
            <Link href="/" className={css({ textStyle: 'md', color: 'black', fontWeight: 600 })}>
              <UnstuckLogo />
            </Link>
            <styled.p color="rgba(102, 109, 128, 1)" textStyle="xs">
              {t('landing.footer.title')}
            </styled.p>
            <styled.p color="rgba(102, 109, 128, 1)" textStyle="xs">
              {t('landing.footer.description')}
            </styled.p>
          </Stack>
          <HStack h="100%" alignItems="flex-start" gap={{ base: 8, md: 20 }} flexDir={{ md: 'row', base: 'column' }}>
            <Stack>
              <styled.h3 textStyle="lg" fontWeight="medium">
                {t('landing.footer.socials')}
              </styled.h3>
              <Link
                target="_blank"
                href="https://www.tiktok.com/@unstuck.study?_t=8og7SeZpUVD&_r=1"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',

                  alignItems: 'center',
                }}>
                TikTok
              </Link>
              <Link
                href="https://www.instagram.com/unstuck.study?igsh=cHJkeGp4YjZmYnV6"
                target="_blank"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                Instagram
              </Link>
              <Link
                href="https://x.com/quizardai"
                target="_blank"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                X (Twitter)
              </Link>
              <Link
                href="https://www.linkedin.com/company/quizard-ai/"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                LinkedIn
              </Link>
            </Stack>
            <Stack>
              <styled.h3 textStyle="lg" fontWeight="medium">
                {t('landing.footer.quickLinks')}
              </styled.h3>
              <Link
                target="_blank"
                href="/"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('common.home')}
              </Link>
              <Link
                href="/auth/signup"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('auth.common.signUp')}
              </Link>
              <Link
                href="/auth/login"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('auth.common.login')}
              </Link>
              <Link
                href="https://quizard.ai/about"
                target="_blank"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('landing.footer.meetTheTeam')}
              </Link>
            </Stack>
            <Stack>
              <styled.h3 textStyle="lg" fontWeight="medium">
                {t('landing.footer.legal')}
              </styled.h3>
              <Link
                target="_blank"
                href="https://lovely-vault-f15.notion.site/Privacy-Policy-4fe9e56db4a04d88af6e1b78f2874a7d"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('landing.footer.privacy')}
              </Link>
              <Link
                href="https://lovely-vault-f15.notion.site/Terms-of-Use-18a469738fd74c9bb7c919981de4bbcd"
                target="_blank"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('landing.footer.terms')}
              </Link>
              <Link
                href="https://quizard.ai/contact"
                target="_blank"
                className={css({ textStyle: 'sm' })}
                style={{
                  color: 'rgba(102, 109, 128, 1)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {t('landing.footer.contact')}
              </Link>
            </Stack>
          </HStack>
        </HStack>
        <HStack
          w="100%"
          justify="space-between"
          h="100%"
          alignItems="flex-start"
          flexDir={{ sm: 'row', base: 'column' }}>
          <HStack alignItems="center">
            <Link
              href="https://quizard.ai/"
              target="_blank"
              className={css({ textStyle: 'sm', color: 'rgba(102, 109, 128, 1)', fontWeight: 500 })}>
              Made with ❤️ by © 2024 Quizard AI, Inc
            </Link>
          </HStack>
          <HStack
            alignItems="flex-start"
            color="rgba(102, 109, 128, 1)"
            textStyle="sm"
            gap={{ sm: 16, base: 2 }}
            flexDir={{ sm: 'row', base: 'column' }}>
            <div>
              <styled.span fontWeight="medium">{t('common.email')}: </styled.span>
              <span>&nbsp;contact@unstuckstudy.com</span>
            </div>
            <div>
              <styled.span fontWeight="medium">{t('common.address')}: </styled.span>
              <span>550 W 54th Street New York, NY 10019</span>
            </div>
          </HStack>
        </HStack>
      </styled.footer>
    </styled.div>
  );
};
