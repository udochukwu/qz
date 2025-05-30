'use client';
import { WorkspaceList } from '@/features/class/components/workspace-list';
import React from 'react';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import { ClipboardIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useTranslation } from 'react-i18next';
const Classes = () => {
  const { t } = useTranslation();

  return (
    <main
      className={css({
        display: 'flex',
        marginX: 'auto',
        flexDir: 'column',
        px: '6%',
        py: '5',
        w: '100%',
        h: '100vh',
        overflow: 'auto',
      })}>
      <PageHeader
        pageName={t('class.pageHeader.title')}
        pageDescription={t('class.pageHeader.description')}
        PageIcon={ClipboardIcon}
      />
      <styled.div mb={10} />
      <WorkspaceList />
    </main>
  );
};

export default Classes;
