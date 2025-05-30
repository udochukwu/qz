import React from 'react';
import { DragToUpload } from './drag-to-upload/drag-to-upload';
import { useNewChatWithPendingFiles } from '../chat/hooks/use-new-chat-with-pending-files';

export const DragToUploadNewChat = () => {
  const { uploadFiles } = useNewChatWithPendingFiles();
  return (
    <DragToUpload
      onDrop={files => {
        uploadFiles(files);
      }}
    />
  );
};
