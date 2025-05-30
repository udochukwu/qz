import { useMutation } from 'react-query';
import { IngestAudioPayload, IngestAudioResponse } from '../types';
import axiosClient from '@/lib/axios';
import { queryClient } from '@/providers/Providers';
import { useRouter } from 'next13-progressbar';
import { useSettledFilesStore } from '@/features/files-pdf-chunks-sidebar/stores/settled-files-store';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { DEFAULT_WORKSPACE_PROPERTIES } from '@/features/files-pdf-chunks-sidebar/consts/default-workspace-file';

const ingestAudio = async (IngestAudioPayload: IngestAudioPayload): Promise<IngestAudioResponse> => {
  const response = await axiosClient.post('/files/audio/done', IngestAudioPayload);
  return { ...response.data, ...IngestAudioPayload };
};

export const useIngestAudio = () => {
  const { addSettledFiles } = useSettledFilesStore();

  const router = useRouter();
  return useMutation(ingestAudio, {
    onSuccess: (r: IngestAudioResponse) => {
      queryClient.invalidateQueries('files');
      const settledFile: WorkspaceFile = {
        ...DEFAULT_WORKSPACE_PROPERTIES,
        workspace_file_id: r.workspace_file_id,
        filename: r.filename + '.webm',
        status: WorkspaceFileUploadStatus.PENDING,
      };
      addSettledFiles([settledFile]);
    },
    onSettled: () => {
      queryClient.invalidateQueries('unsavedRecordings');
    },
  });
};
