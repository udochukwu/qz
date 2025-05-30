import axiosClient from '@/lib/axios';
import { useQuery } from 'react-query';
import { PlaylistVideo } from '../types';

interface UsePlaylistFetchProps {
  playlistId: string | null;
  onError?: (error: Error) => void;
}

const fetchPlaylist = async (playlistId: string): Promise<PlaylistVideo[]> => {
  const session = axiosClient.getSessionToken();
  const response = await axiosClient.get<{ videos: PlaylistVideo[] }>(
    `/youtube/playlist/${playlistId}`,
  );
  return response.data.videos;
};

export const usePlaylistFetch = ({ playlistId, onError }: UsePlaylistFetchProps) => {
  const {
    data: videos = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PlaylistVideo[], Error>(
    ['playlist', playlistId],
    () => fetchPlaylist(playlistId!),
    {
      enabled: !!playlistId,
      onError,
    }
  );

  return {
    videos,
    isLoading,
    isError,
    refetch,
  };
}; 