import { Button } from '@/components/elements/button';
import { ListRestartIcon } from 'lucide-react';
import React from 'react';
import { ErrorIcon } from 'react-hot-toast';
import { HStack, VStack, VstackProps, styled } from 'styled-system/jsx';
import * as Sentry from '@sentry/nextjs';
import { useTranslation } from 'react-i18next';

interface Props {
  error: Error | string;
  shouldSentryCapture?: boolean;
  retry?: VoidFunction;
}

export const ErrorRetry = ({ error, retry, shouldSentryCapture = true, ...rest }: Props & VstackProps) => {
  const { t } = useTranslation();

  const message = typeof error === 'string' ? error : error.message;
  React.useEffect(() => {
    if (error && shouldSentryCapture) {
      //if error is just a string we throw a new error
      if (typeof error === 'string') {
        Sentry.captureException(new Error(error));
      } else {
        Sentry.captureException(error);
      }
    }
  }, [error, shouldSentryCapture]);
  return (
    <VStack w="100%" h="100%" alignItems="center" justify="center" {...rest}>
      <VStack gap={0} w="80%" h="80%" alignItems="center" justify="center">
        <VStack gap={0}>
          <HStack color="red.dark.10">
            <ErrorIcon />
            <styled.h1 textStyle="xl" mb={0} fontWeight="bold">
              {t('common.error.title')}
            </styled.h1>
          </HStack>
          <styled.h1 textStyle="lg" color="red.dark.10" pb={5}>
            {message}
          </styled.h1>
        </VStack>
        <Button colorScheme="revert" onClick={retry} bg="red.dark.9" _hover={{ bg: 'red.dark.11' }}>
          <ListRestartIcon />
          <span>{t('common.retry')}</span>
        </Button>
      </VStack>
    </VStack>
  );
};
