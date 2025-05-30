import { SelectedFileView } from '@/features/flashcard/selected-file-view';
import React from 'react';

interface Props {
  params: { file_id: string };
}

const Filepage = (props: Props) => {
  const fileId = props.params.file_id;

  return <SelectedFileView selectedFileId={fileId} />;
};

export default Filepage;
