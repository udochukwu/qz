'use client';

import { Button } from '@/components/elements/button';
import { Menu, XIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { css } from 'styled-system/css';
import { Divider, HStack, Stack, styled } from 'styled-system/jsx';
import { Dialog } from '@/components/elements/dialog';
import { IconButton } from '@/components/elements/icon-button';
import { UnstuckLogo } from '@/components/unstuck-logo';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <>
      <Dialog.Root>
        <Dialog.Backdrop bg="transparent" />
        <Dialog.Positioner justifyContent="flex-start" alignItems="flex-start" display="flex" flexDir="column">
          <Dialog.Content h="auto" w="100svw">
            <Stack gap="4" p="6" w="full">
              <Stack flexDir="row" justify="space-between" gap="1" w="full" alignItems="center">
                <Dialog.Title>
                  <Link href="/" className={css({ textStyle: 'md', color: 'black', fontWeight: 600 })}>
                    <UnstuckLogo />
                  </Link>
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <IconButton aria-label={t('common.closeDialog')} variant="ghost">
                    <XIcon />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Stack>
              <Divider />
              <Stack flexDir="column" gap="3" direction="col" width="full">
                <Link
                  href="/auth/signup?source_button=get_started"
                  className={css({ textStyle: 'md', color: 'black', fontWeight: 600, w: 'full' })}>
                  <Button variant="ghost" width="full">
                    {t('auth.common.getStarted')}
                  </Button>
                </Link>
                <Link
                  href="/auth/login?source_button=login_button"
                  className={css({ textStyle: 'md', color: 'black', fontWeight: 600, w: 'full' })}>
                  <Button width="full">{t('auth.common.login')}</Button>
                </Link>
              </Stack>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
        <styled.div pos="sticky" top={0} p={4} zIndex={100}>
          <styled.nav
            mx="auto"
            boxShadow="0px 0px 40px 0px #6D56FA26"
            p={4}
            borderRadius="2xl"
            maxW="5xl"
            border="1px solid #6c56fa20"
            bg="#ffffffe9f"
            display="flex"
            alignItems="center"
            backdropFilter="auto"
            backdropBlur="sm"
            justifyContent="space-between">
            <Link href="/" className={css({ textStyle: 'md', color: 'black', fontWeight: 600 })}>
              <UnstuckLogo />
            </Link>
            <Dialog.Trigger asChild>
              <IconButton display={{ sm: 'none', base: 'block' }} aria-label="Open menu" variant="ghost" size="sm">
                <Menu />
              </IconButton>
            </Dialog.Trigger>
            <HStack gap={8} display={{ sm: 'flex', base: 'none' }}>
              <Link
                href="/auth/login?source_button=login_button"
                className={css({ textStyle: 'md', color: 'black', fontWeight: 600 })}>
                {t('auth.common.login')}
              </Link>
              <Link
                href="/auth/signup?source_button=get_started"
                className={css({ textStyle: 'md', color: 'black', fontWeight: 600 })}>
                <Button>{t('auth.common.getStarted')}</Button>
              </Link>
            </HStack>
          </styled.nav>
        </styled.div>
      </Dialog.Root>
    </>
  );
};
