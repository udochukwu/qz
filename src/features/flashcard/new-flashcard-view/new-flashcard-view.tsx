import React from 'react';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import FilesSection from './components/files-section';
import { css } from 'styled-system/css';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';

interface NewFlashcardProps {
  crudPayload?: CRUDFilesPost;
}

export function NewFlashcardView({ crudPayload }: NewFlashcardProps) {
  const { t } = useTranslation();

  return (
    <styled.div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        mx: 'auto',
        bg: 'white',
      })}>
      <FilesSection
        fileListContainerStyles={{ maxHeight: 'fit-content' }}
        extensions={{
          isFileUploadEnabled: true,
          isFilterableByClass: true,
          isYoutubeUploadEnabled: true,
        }}
        crudPayload={crudPayload}
      />
    </styled.div>
  );
}
