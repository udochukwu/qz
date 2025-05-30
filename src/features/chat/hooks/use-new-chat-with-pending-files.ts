import { useCallback } from 'react';
import { useCreateChat } from './use-create-chat';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';

export const useNewChatWithPendingFiles = () => {
  const { onFilesChange } = useOnUploadFileController({});
  const { mutate: createChat, isLoading } = useCreateChat(async data => {}, undefined, false);
  const uploadFiles = useCallback(
    (files: File[], workspace_id?: string) => {
      createChat(
        { workspace_id },
        {
          onSuccess: async (data: { chat_id: string }) => {
            const result = await onFilesChange({
              acceptedFiles: files,
              uploadFilePayload: { chat_id: data.chat_id },
            });
          },
        },
      );
    },
    [createChat, onFilesChange],
  );

  return { uploadFiles, isLoading };
};
