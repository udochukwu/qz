import React, { useEffect, useState } from 'react';
import { Box, styled } from 'styled-system/jsx';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import { IconButton } from '@/components/elements/icon-button';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
  url: string;
  startTime?: number;
  newTime?: number;
  onProgress?: (playedSeconds: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, startTime, newTime, onProgress }) => {
  const { t } = useTranslation();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const recorderControls = useVoiceVisualizer();
  const {
    audioRef,
    isPausedRecordedAudio,
    isAvailableRecordedAudio,
    togglePauseResume,
    duration,
    currentAudioTime,
    setCurrentAudioTime,
    isPreloadedBlob,
    setPreloadedAudioBlob,
  } = recorderControls;

  useEffect(() => {
    const audioElement = new Audio(url);
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [url]);

  useEffect(() => {
    if (audio && !isPreloadedBlob) {
      audio.addEventListener('loadedmetadata', async () => {
        const audioBlob = await fetch(url).then(r => r.blob());
        setPreloadedAudioBlob(audioBlob);
      });
    }
  }, [audio, isPreloadedBlob, setPreloadedAudioBlob, url]);

  useEffect(() => {
    if (audio && startTime) {
      audio.currentTime = startTime;
    }
    if (audioRef.current && startTime) {
      setCurrentAudioTime(startTime);
      //if not playing playing we togglePauseResume
      if (isPausedRecordedAudio) togglePauseResume();
      audioRef.current.currentTime = startTime;
    }
  }, [audio, startTime]);

  useEffect(() => {
    if (audio && newTime !== undefined) {
      audio.currentTime = newTime;
    }
    if (audioRef.current && newTime !== undefined) {
      setCurrentAudioTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  }, [audio, newTime]);

  useEffect(() => {
    if (audio && onProgress && currentAudioTime) {
      onProgress(currentAudioTime);
    }
  }, [audio, currentAudioTime, onProgress]);
  useEffect(() => {
    //when video finished processing we play the audio
    if (isAvailableRecordedAudio) {
      //after 100ms we play the audio
      setTimeout(() => {
        handleTogglePlayPause();
      }, 1000);
    }
  }, [isAvailableRecordedAudio]);

  const handleTogglePlayPause = () => {
    if (audio) {
      togglePauseResume();
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
          disabled={!isAvailableRecordedAudio}>
          {!isPausedRecordedAudio ? (
            <PauseIcon color="white" fill="white" />
          ) : (
            <PlayIcon color="white" fill="white" style={{ marginLeft: 2 }} />
          )}
        </IconButton>
        <Box flex={1}>
          {!isAvailableRecordedAudio && (
            <Box p={3} color="#6D56FA">
              {t('files.pdf.audio.downloading')}
            </Box>
          )}
          <Box display={isAvailableRecordedAudio ? 'block' : 'none'}>
            <VoiceVisualizer
              height={100}
              width={'100%'}
              barWidth={5}
              gap={1}
              mainBarColor="#6D56FA"
              secondaryBarColor="#6D56FA80"
              defaultAudioWaveIconColor="#6D56FA"
              isProgressIndicatorShown={true}
              isProgressIndicatorTimeShown={false}
              isProgressIndicatorTimeOnHoverShown={false}
              controls={recorderControls}
              isControlPanelShown={false}
              isDownloadAudioButtonShown={false}
            />
          </Box>
        </Box>
        <Box py={1} rounded={'2xl'} px={2} bg="#6D56FA" color="white" fontSize={'sm'}>
          {currentAudioTime ? formatDuration(currentAudioTime) : formatDuration(duration)}
        </Box>
      </Box>
    </styled.div>
  );
};

export default AudioPlayer;
