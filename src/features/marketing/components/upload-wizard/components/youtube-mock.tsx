'use client';

import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Link } from 'lucide-react';
import React from 'react';
import { css } from 'styled-system/css';
import { Stack, styled } from 'styled-system/jsx';
import { useFakeSubmit } from '../hooks/use-fake-submit';
import { useTranslation } from 'react-i18next';

export const YoutubeMock = () => {
  const { t } = useTranslation();

  const { query, setQuery, onSubmit } = useFakeSubmit();

  return (
    <Stack>
      <styled.div pos="relative">
        <styled.div
          h="100%"
          display="flex"
          flexDir="column"
          justifyContent="center"
          left={0}
          pl={4}
          pos="absolute"
          zIndex={1}>
          <Link size={24} className={css({ color: '#6D56FA' })} />
        </styled.div>
        <styled.div
          pos="absolute"
          right={0}
          zIndex={1}
          h="100%"
          display={{ sm: 'flex', base: 'none' }}
          flexDir="column"
          justifyContent="center"
          px={4}>
          <Button w="80px" py={2} onClick={() => onSubmit('youtube_upload')}>
            {t('common.upload')}
          </Button>
        </styled.div>
        <Input
          value={query}
          onKeyDown={e => {
            const key = e.key;

            if (key === 'Enter') {
              onSubmit('youtube_upload');
            }
          }}
          onChange={e => {
            const value = e.currentTarget.value;
            setQuery(value);
          }}
          borderRadius="2xl"
          height="70px"
          placeholder="https://www.youtube.com/watch?v=UF8uR6Z6KLc"
          pl="48px"
          pr={{ sm: '104px', base: 4 }}
          w="100%"
          bg="white"
          border="1px solid #6c56fa20"
        />
      </styled.div>
      <Button w="full" display={{ sm: 'none', base: 'block' }} onClick={() => onSubmit('youtube_upload')}>
        {t('common.upload')}
      </Button>
    </Stack>
  );
};
