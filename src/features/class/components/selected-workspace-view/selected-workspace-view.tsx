'use client';

import { useListClasses } from '@/hooks/use-list-classes';
import React, { useEffect, useState } from 'react';
import { WorkspaceView } from './components/workspace-view';
import { WorkspaceNotFound } from './components/workspace-not-found';
import { WorkspaceClass } from '@/types';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { LoadingScreen } from '@/features/user-feedback/loading-screen';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/nextjs';

interface Props {
  selectedWorkspaceId: string;
}

export const SelectedWorkspaceView = ({ selectedWorkspaceId }: Props) => {
  const { t } = useTranslation();
  const { data: workspaces, isLoading, isError, refetch } = useListClasses();

  const [autoRetried, setAutoRetried] = useState(false);

  const selectedWorkspace: WorkspaceClass | undefined = workspaces?.classes?.find(
    (workspace: WorkspaceClass) => workspace.workspace_id === selectedWorkspaceId,
  );

  useEffect(() => {
    if (!isLoading && !isError && !selectedWorkspace && !autoRetried) {
      setAutoRetried(true);
      const timer = setTimeout(() => {
        console.log('refetching');
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isError, selectedWorkspace, autoRetried, refetch]);

  if (isError) {
    return <ErrorRetry error={t('class.workspace.error', { count: 1 })} retry={refetch} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (selectedWorkspace == null) {
    const error = new Error(`Selected class not found classId: ${selectedWorkspaceId}`);
    Sentry.captureException(error, {
      tags: {
        component: 'SelectedWorkspaceView',
        context: 'classPage',
      },
      extra: {
        selectedWorkspaceId,
      },
    });
  }
  return (
    <styled.section w="100%" h="100vh" overflow="hidden">
      {selectedWorkspace != null ? <WorkspaceView workspace={selectedWorkspace} /> : <WorkspaceNotFound />}
    </styled.section>
  );
};
