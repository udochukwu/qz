import { YouTubeUrlInfo } from '../types';

const YOUTUBE_PATTERNS = {
  VIDEO: /(?:youtube\.com\/(?:[^\/?&]+\/)?([\w-]{11})|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/,
  PLAYLIST: /[?&]list=(PL[a-zA-Z0-9_-]+)/
};

export function getYouTubeUrl(url: string): YouTubeUrlInfo {
  let videoId = null;
  let match = url.match(/(?:youtube\.com\/(?:[^\/?&]+\/)?([\w-]{11}))/);
  if (match) {
    videoId = match[1];
  } else {
    videoId = url.match(YOUTUBE_PATTERNS.VIDEO)?.[1] || url.match(YOUTUBE_PATTERNS.VIDEO)?.[2];
  }
  
  // Check if it's a personal playlist (WL or LL) and ignore it
  const isPersonalPlaylist = /[?&]list=(WL|LL)/.test(url);
  const playlistId = isPersonalPlaylist ? undefined : url.match(YOUTUBE_PATTERNS.PLAYLIST)?.[1];
  
  return {
    videoId,
    playlistId,
    isYouTubeUrl: !!(videoId || playlistId)
  };
} 