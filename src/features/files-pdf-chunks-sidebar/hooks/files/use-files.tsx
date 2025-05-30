import { useQuery, UseQueryResult } from 'react-query';
import axiosClient from '@/lib/axios';
import { CRUDFilesPost, GetFilesResponse } from '../../types/api-types';
import { AxiosError } from 'axios';
import { getFilesQueryKey } from '../../utils/get-files-query-key';

const fetchFilesForWorkspace = async (
  payload?: CRUDFilesPost,
  excludeFiles?: CRUDFilesPost,
): Promise<GetFilesResponse> => {
  if (excludeFiles) {
    const { data } = await axiosClient.get<GetFilesResponse>('/files', {
      params: { exclude_workspace_id: excludeFiles.workspace_id, exclude_chat_id: excludeFiles.chat_id },
    });
    return data;
  } else if (payload) {
    const { data } = await axiosClient.get<GetFilesResponse>('/files', {
      params: payload,
    });
    return data;
  }
  const { data } = await axiosClient.get<GetFilesResponse>('/files');
  return data;
};

interface Props {
  crudPayload?: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
}

export const useFiles = (props?: Props): UseQueryResult<GetFilesResponse, AxiosError<{ detail: string }>> => {
  const queryKey = getFilesQueryKey(props?.crudPayload, props?.excludeFiles);
  return useQuery(queryKey, () => fetchFilesForWorkspace(props?.crudPayload, props?.excludeFiles), {
    refetchOnWindowFocus: false,
  });
};
