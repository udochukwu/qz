'use client';
import ReactPlayer from 'react-player';
import { useEffect, useRef, useState } from 'react';

interface Props {
  url: string;
  startTime?: number;
  newTime?: number;
  onProgress?: (playedSeconds: number) => void;
}

export function VideoPlayer({ url, startTime, newTime, onProgress }: Props) {
  const player = useRef<ReactPlayer>(null);
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    player.current?.seekTo(startTime || 0, 'seconds');
  }, [startTime, player]);

  useEffect(() => {
    setIsPlaying(false);
    player.current?.seekTo(newTime || 0, 'seconds');
    setIsPlaying(true);
  }, [newTime, player]);

  return (
    <ReactPlayer
      style={{
        overflow: 'hidden',
        borderRadius: '10px',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      ref={player}
      height="100%"
      width="100%"
      controls={true}
      url={url}
      playing={isPlaying}
      onStart={() => {
        player.current?.seekTo(startTime || 0, 'seconds');
        setStarted(true);
      }}
      onPlay={() => {
        setIsPlaying(true);
      }}
      onPause={() => {
        setIsPlaying(false);
      }}
      onProgress={state => {
        if (!started) {
          return;
        }
        if (state && onProgress) {
          onProgress(state.playedSeconds);
        }
      }}
    />
  );
}
