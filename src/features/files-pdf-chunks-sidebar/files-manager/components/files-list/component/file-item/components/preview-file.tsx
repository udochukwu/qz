import React from 'react';
import { IconButton, IconButtonProps } from '@/components/elements/icon-button';
import { ExpandIcon } from 'lucide-react';
import { css } from 'styled-system/css';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { getPageName } from '@/utils/page-name-utils';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

interface Props extends IconButtonProps {
  file: WorkspaceFile;
  expandFile: (file: WorkspaceFile) => void;
}

export const PreviewFile = ({ file, expandFile, ...rest }: Props) => {
  const onExpandFile = () => {
    expandFile(file);
    mixpanel.track(EventName.FileExpanded, {
      fileId: file.workspace_file_id,
      page: getPageName(window.location.pathname),
      path: window.location.pathname,
    });
  };

  return (
    <IconButton onClick={onExpandFile} variant="ghost" {...rest}>
      <ExpandIcon className={css({ height: '1rem', width: '1rem', color: 'rgba(21,17,43,0.5)' })} />
    </IconButton>
  );
};
