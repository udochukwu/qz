import { useCallback } from 'react';
import { useCreateChat } from './use-create-chat';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import { useRouter } from 'next13-progressbar';

export const useNewFlashcardsWithPendingFiles = () => {
  const { onFilesChange } = useOnUploadFileController({ dontRedirect: true });
  const { mutate: createChat, isLoading } = useCreateChat(async data => {}, undefined, false);
  const router = useRouter();
  const uploadFiles = useCallback(
    async (files: File[], workspace_id?: string) => {
      return new Promise((resolve, reject) => {
        createChat(
          { workspace_id },
          {
            onSuccess: async (data: { chat_id: string }) => {
              try {
                const uploadResult = await onFilesChange({
                  acceptedFiles: files,
                  uploadFilePayload: { chat_id: data.chat_id },
                });
                resolve(uploadResult);
              } catch (error) {
                console.log('error', error);
                reject(error);
              }
            },
            onError: error => {
              reject(error);
            },
          },
        );
      });
    },
    [createChat, onFilesChange],
  );

  return { uploadFiles, isLoading };
};
