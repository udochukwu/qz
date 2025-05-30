import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { X, Volume2, VolumeX, RefreshCw, ThumbsUp, ThumbsDown, Pause, Play } from 'lucide-react';
import { VStack, HStack, styled, Box } from 'styled-system/jsx';
import * as Progress from '@/components/elements/styled/progress';
import { Button } from '@/components/elements/styled/button';
import mixpanel from 'mixpanel-browser';
import useOnboardingVideoStore from '../stores/use-onboarding-video-store';
import { useQueryClient } from 'react-query';
import { Quest } from '../types/quest-types';
import { useTranslation } from 'react-i18next';

const VideoOnboarding = () => {
  const { t } = useTranslation();

  const videoUrl = 'https://random-public-shit.s3.us-east-2.amazonaws.com/mike-create-class.mp4';
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const setIsVideoPlaying = useOnboardingVideoStore(state => state.setIsVideoPlaying);
  const [has80PercentTracked, setHas80PercentTracked] = useState(false);
  const queryClient = useQueryClient();

  const playerRef = useRef(null);

  useEffect(() => {
    setIsVideoPlaying(true);
    setTimeout(() => {
      mixpanel.track('Onboarding Video Shown');
      setIsMuted(false);
    }, 1000);
  }, []);

  const handleProgress = ({ played }: { played: number }) => {
    setProgress(Math.floor(played * 100));

    if (played >= 0.8 && !isVideoEnded && !has80PercentTracked) {
      setHas80PercentTracked(true);
      mixpanel.track('Onboarding Video 80% Complete');
    }

    if (played >= 0.99) {
      setIsVideoEnded(true);
      setIsPlaying(false);
    }
  };

  const handleRewatch = () => {
    setIsVideoEnded(false);
    setProgress(0);
    setIsPlaying(true);
    if (playerRef.current) {
      (playerRef.current as ReactPlayer).seekTo(0);
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    mixpanel.track('Onboarding Video Feedback', {
      feedback: isPositive ? 'positive' : 'negative',
      videoProgress: progress,
    });
    setFeedbackSubmitted(true);
  };

  const togglePlayPause = () => {
    if (!isVideoEnded) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleExit = () => {
    mixpanel.track('Onboarding Video Exit', {
      exitProgress: progress,
    });
    // Update the quest data to mark explainer video as completed
    queryClient.setQueryData<Quest>('quests', (oldData: Quest | undefined) => {
      if (!oldData) return {} as Quest;
      return {
        ...oldData,
        quest_data: {
          ...oldData.quest_data,
          explainer_video: true,
        },
      };
    });

    setIsVideoPlaying(false);
  };

  const handleLearnMore = () => {
    mixpanel.track('Onboarding Video Learn More Click');
    window.open('https://www.youtube.com/watch?v=JQTP6aunnrQ');
  };

  return (
    <Box
      position="fixed"
      top={'20%'}
      right={'27%'}
      zIndex={1000}
      rounded="md"
      overflow="hidden"
      width={'15%'}
      minW={'200px'}
      bg="#6D56FA">
      <Box position="relative" w="100%" h="100%" onClick={togglePlayPause} className="cursor-pointer">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          muted={isMuted}
          onProgress={handleProgress}
        />
        {/* Play/Pause Overlay Icon */}
        {!isVideoEnded && !isPlaying && (
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(0,0,0,0.3)"
            zIndex={1}>
            <Play color="white" />
          </Box>
        )}
        {/* Overlay Controls */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={2}
          p={3}
          w={'100%'}
          onClick={e => e.stopPropagation()} // Prevent play/pause when clicking controls
        >
          <HStack mx={-3} mt={-3}>
            <HStack w={'100%'} justifyContent="flex-end" gap={0}>
              <Button onClick={() => setIsMuted(!isMuted)} variant={'ghost'} color={'white'} size={'sm'}>
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
              <Button variant={'ghost'} color={'white'} size={'sm'} onClick={handleExit}>
                <X />
              </Button>
            </HStack>
          </HStack>
        </Box>
        {/* Progress Bar Overlay */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={2}
          p={3}
          onClick={e => e.stopPropagation()} // Prevent play/pause when clicking progress bar
        >
          <Progress.Root value={progress}>
            <Progress.Track bgColor="rgba(255,255,255,0.12)" h="0.3rem">
              <Progress.Range bgColor="#FFFFFF !important" />
            </Progress.Track>
          </Progress.Root>
        </Box>
        {/* Video End Overlay */}
        {isVideoEnded && (
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(0,0,0,0.5)"
            zIndex={2}
            onClick={e => e.stopPropagation()} // Prevent play/pause when clicking end overlay
          >
            <Box
              position={'absolute'}
              top={0}
              right={0}
              onClick={e => e.stopPropagation()} // Prevent play/pause when clicking end overlay
            >
              <Button variant={'ghost'} color={'white'} size={'sm'} onClick={handleExit}>
                <X />
              </Button>
            </Box>
            <VStack gap={3}>
              <Button
                onClick={handleLearnMore}
                className="px-4 py-2 bg-[#6D56FA] text-white rounded-md hover:bg-[#5842d8] transition-colors">
                {t('common.learnMore')}
              </Button>
              <Button onClick={handleRewatch} variant={'ghost'} color={'white'}>
                <HStack gap={2}>
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('chat.video.watchAgain')}</span>
                </HStack>
              </Button>
              {!feedbackSubmitted && (
                <VStack gap={2}>
                  <styled.span color="white" fontSize="sm">
                    {t('chat.video.helpfulTip')}
                  </styled.span>
                  <HStack gap={4}>
                    <Button
                      onClick={() => handleFeedback(true)}
                      variant={'ghost'}
                      color={'white'}
                      className="hover:bg-green-500/20">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleFeedback(false)}
                      variant={'ghost'}
                      color={'white'}
                      className="hover:bg-red-500/20">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideoOnboarding;
