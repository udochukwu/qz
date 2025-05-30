import { UseMutationResult, useMutation, useQuery } from 'react-query';
import axiosClient from '@/lib/axios';
import { DownloadFile } from '@/types';
import { sendErrorMessage } from '@/utils/send-error-message';
import { AxiosError } from 'axios';
import useGetChatId from '@/features/chat/hooks/use-chatId';

const fetchFile = async (fileId: string, chatID: string): Promise<DownloadFile> => {
  const { data } = await axiosClient.get(`/files/${fileId}`);
  return { ...data, workspace_file_id: fileId };
};

export const useFileDownload = (onSuccess: (data: DownloadFile) => void, onError?: (error: Error) => void) => {
  const chatID = useGetChatId();
  const { mutate, data, error, status }: UseMutationResult<DownloadFile, unknown, { fileId: string }> = useMutation(
    ({ fileId }) => fetchFile(fileId, chatID || ''),
    {
      onSuccess,
      onError: (e: AxiosError) => {
        onError?.(e);
        sendErrorMessage(e);
      },
    },
  );
  return { mutate, data, error, status };
};

export const useGetFileDetail = (fileId: string) => {
  return useQuery({
    queryKey: ['fileDetail', fileId],
    queryFn: () => fetchFile(fileId, ''),
    enabled: !!fileId,
    staleTime: 0,
  });
};
