'use client';

import { ErrorRetry } from '@/features/user-feedback/error-retry';
import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorRetry error={error.digest ?? t('common.error.server')} retry={reset} shouldSentryCapture={false} />
      </body>
    </html>
  );
}
