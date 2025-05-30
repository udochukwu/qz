'use client';

import { Button } from '@/components/elements/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Stack, styled } from 'styled-system/jsx';
import { input } from 'styled-system/recipes';
import { useFakeSubmit } from '../hooks/use-fake-submit';
import { useTranslation } from 'react-i18next';

export const AskQuestionMock = () => {
  const { t } = useTranslation();

  const { query, setQuery, onSubmit } = useFakeSubmit();
  return (
    <Stack>
      <styled.div pos="relative">
        <styled.textarea
          borderRadius="2xl"
          value={query}
          onKeyDown={e => {
            const key = e.key;

            if (key === 'Enter') {
              onSubmit('ask_question');
            }
          }}
          onChange={e => {
            const value = e.currentTarget.value;
            setQuery(value);
          }}
          placeholder={t('landing.uploadWizard.askQuestion.placeholder')}
          w="100%"
          height="200px"
          className={input()}
          bg="white"
          textStyle="md"
          py={4}
          px={4}
          border="1px solid #6c56fa20"
          resize="none"
        />
        <Button
          w="40px"
          display={{ sm: 'flex', base: 'none' }}
          h="40px"
          mx={4}
          mb={6}
          justifyContent="center"
          alignItems="center"
          aria-label={t('common.sendMessage')}
          pos="absolute"
          onClick={() => onSubmit('ask_question')}
          p={0}
          right={0}
          bottom={0}>
          <ArrowRight size={16} />
        </Button>
      </styled.div>
      <Button
        display={{ sm: 'none', base: 'block' }}
        justifyContent="center"
        alignItems="center"
        onClick={() => onSubmit('ask_question')}
        w="full">
        <span>{t('common.askQuestion')}&nbsp;</span>
        <ArrowRight size={16} />
      </Button>
    </Stack>
  );
};
