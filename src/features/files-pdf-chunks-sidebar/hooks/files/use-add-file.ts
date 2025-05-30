import axiosClient from '@/lib/axios';
import { useMutation, useQueryClient } from 'react-query';
import { AddFilePost, AddFileResponse, CRUDFilesPost, GetFilesResponse } from '../../types/api-types';
import { SuccessfulResponse } from '@/types/api-types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { WorkspaceFile } from '../../types/types';
import { getFilesQueryKey } from '../../utils/get-files-query-key';
import { sendErrorMessage } from '@/utils/send-error-message';

const addFilePost = async (payload: AddFilePost) => {
  return axiosClient.post<AddFilePost, SuccessfulResponse<AddFileResponse>>('/files/add', payload);
};

export const useAddFile = () => {
  const queryClient = useQueryClient();

  async function addAllFilesPost(params: { files: WorkspaceFile[]; crudPayload?: CRUDFilesPost }) {
    const addFilePayload = getAddFilePayload(params.crudPayload);
    const addFileImported: AddFilePost[] = params.files.map(file => {
      return {
        ...addFilePayload,
        workspace_file_id: file.workspace_file_id,
        filename: file.filename,
      } as AddFilePost;
    });
    const allFileImportPromises = addFileImported.map(postPayload => addFilePost(postPayload));
    const results = await Promise.all(allFileImportPromises);
    return { results, crudPayload: params.crudPayload };
  }

  const {
    mutate: addAllFiles,
    isError,
    isLoading,
  } = useMutation(addAllFilesPost, {
    onMutate: async ({ files, crudPayload }) => {
      const destinationFilesQueryKey = getFilesQueryKey(crudPayload);
      await queryClient.cancelQueries({
        queryKey: destinationFilesQueryKey,
      });

      const previousDestinationGetFileSnapshot: GetFilesResponse | undefined =
        queryClient.getQueryData(destinationFilesQueryKey);

      queryClient.setQueryData<GetFilesResponse>(destinationFilesQueryKey, prev => {
        const prevFiles = prev?.files ?? [];
        return { files: [...prevFiles, ...files] };
      });

      return previousDestinationGetFileSnapshot;
    },
    onSuccess: async ({ results, crudPayload }) => {
      toast.success(`Successfully imported ${results.length} files`);
      queryClient.invalidateQueries(['chatSuggestion', crudPayload?.chat_id]);
    },
    onSettled: data => {
      if (data) {
        queryClient.invalidateQueries('files');
      }
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });

  return { addAllFiles, isError, isLoading };
};

function getAddFilePayload(crudPayload?: CRUDFilesPost) {
  let addFilePayload: Partial<AddFilePost> = {};
  if (crudPayload?.chat_id) {
    addFilePayload.destination_chat_id = crudPayload.chat_id;
  }
  if (crudPayload?.workspace_id) {
    addFilePayload.destination_workspace_id = crudPayload.workspace_id;
  }
  return addFilePayload;
}
