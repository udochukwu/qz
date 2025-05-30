import React, { useRef, useEffect, useState } from 'react';
import { VStack, HStack, Box, Divider } from 'styled-system/jsx';
import { secondsIntoHHMMSS } from '../../utils/convert-seconds';
interface Props {
  subtitles: { index: number; start: number; end: number; content: string }[];
  playingTime: number;
  setCurrentTime: (time: number) => void;
  totalDuration: number;
}

const TranscriptDisplay = ({ subtitles, playingTime, setCurrentTime, totalDuration }: Props) => {
  const target = useRef<HTMLDivElement>(null);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    if (target.current && playingTime) {
      const timeDiff = Math.abs(playingTime - lastScrollTime);
      if (timeDiff >= 1) {
        target.current.scrollIntoView({ behavior: 'smooth' });
        setLastScrollTime(playingTime);
      }
    }
  }, [target, playingTime, lastScrollTime]);

  return (
    <>
      <Divider />
      <VStack
        w="100%"
        h="100%"
        overflowY="scroll"
        gap={2}
        alignItems="flex-start"
        scrollbarColor="rgba(0, 0, 0, 0.2) transparent">
        {subtitles.map(subtitle => (
          <HStack
            ref={playingTime >= subtitle.start && playingTime <= subtitle.end ? target : undefined}
            onClick={() => setCurrentTime(subtitle.start)}
            cursor="pointer"
            _hover={{ backgroundColor: 'purple.light.2' }}
            gap={5}
            key={subtitle.index}
            p={3}
            width="calc(100% - 16px)"
            rounded="lg"
            backgroundColor={playingTime >= subtitle.start && playingTime < subtitle.end ? '#F1EFFC' : undefined}>
            <Box
              backgroundColor={
                playingTime >= subtitle.start && playingTime < subtitle.end ? 'colorPalette.default' : '#ededed'
              }
              color={playingTime >= subtitle.start && playingTime < subtitle.end ? 'white' : '#5C5C5C'}
              textStyle="sm"
              borderRadius="lg"
              padding="5px"
              alignSelf="self-start">
              {secondsIntoHHMMSS(subtitle.start, totalDuration >= 3600)}
            </Box>
            <Box textStyle="sm">{subtitle.content}</Box>
          </HStack>
        ))}
      </VStack>
    </>
  );
};

export default TranscriptDisplay;
