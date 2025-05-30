'use client';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import React from 'react';

interface Props {
  error: Error;
  reset: VoidFunction;
}

const Error = ({ error, reset }: Props) => {
  return <ErrorRetry error={error} retry={reset} />;
};

export default Error;
