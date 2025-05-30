import React, { useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Box, styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  startTime?: number;
  newTime?: number;
  onProgress?: (playedSeconds: number) => void;
}

const AudioPlayerSafari: React.FC<AudioPlayerProps> = ({ url, startTime, newTime, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<ReactAudioPlayer>(null);

  useEffect(() => {
    if (audioRef.current && startTime !== undefined) {
      audioRef.current.audioEl.current!.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [startTime]);

  useEffect(() => {
    if (audioRef.current && newTime !== undefined) {
      audioRef.current.audioEl.current!.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [newTime]);

  useEffect(() => {
    if (onProgress) {
      onProgress(currentTime);
    }
  }, [currentTime, onProgress]);

  const handleTogglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.audioEl.current!.pause();
      } else {
        audioRef.current.audioEl.current!.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.audioEl.current!.duration);
      setIsLoaded(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.audioEl.current!.currentTime);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <styled.div
      display="flex"
      flexDirection="column"
      alignItems="center"
      backgroundColor="white"
      gap={3}
      borderRadius="md"
      width="100%">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        px={2}
        gap={2}
        bg="#6D56FA1F"
        borderRadius="md"
        position="relative"
        width="100%">
        <IconButton
          variant="ghost"
          size="lg"
          rounded={'full'}
          bg="#6D56FA"
          onClick={handleTogglePlayPause}
          disabled={!isLoaded}>
          {isPlaying ? (
            <PauseIcon color="white" fill="white" />
          ) : (
            <PlayIcon color="white" fill="white" style={{ marginLeft: 2 }} />
          )}
        </IconButton>
        <Box flex={1}>
          {!isLoaded && (
            <Box p={3} color="#6D56FA">
              Loading audio, please wait...
            </Box>
          )}
          <Box display={isLoaded ? 'block' : 'none'}>
            <ReactAudioPlayer
              src={url}
              ref={audioRef}
              onLoadedMetadata={handleLoadedMetadata}
              onListen={handleTimeUpdate}
              listenInterval={100}
              style={{ width: '100%' }}
            />
          </Box>
        </Box>
        <Box py={1} rounded={'2xl'} px={2} bg="#6D56FA" color="white" fontSize={'sm'}>
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </Box>
      </Box>
    </styled.div>
  );
};

export default AudioPlayerSafari;
