import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const ClassesFilesErrorWrapper = ({
  children,
  retry,
  isError,
}: {
  children: ReactNode;
  retry: VoidFunction;
  isError?: boolean;
}) => {
  const { t } = useTranslation();

  return <>{isError ? <ErrorRetry error={t('newChatView.classesFileBrowser.error')} retry={retry} /> : children}</>;
};
