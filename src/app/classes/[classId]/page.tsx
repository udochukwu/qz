import { SelectedWorkspaceView } from '@/features/class/components/selected-workspace-view/selected-workspace-view';
import React from 'react';
import { Box } from 'styled-system/jsx';

interface Props {
  params: { classId: string };
}

const ClassPage = (props: Props) => {
  const classId = props.params.classId;

  return <SelectedWorkspaceView selectedWorkspaceId={classId} />;
};

export default ClassPage;
