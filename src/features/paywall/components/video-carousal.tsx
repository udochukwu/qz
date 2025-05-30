import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { css } from 'styled-system/css';
import React, { useRef, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { PauseIcon, PlayIcon } from 'lucide-react';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';

const videos = [
  {
    id: '1',
    videoUrl: '/images/addVid1.mp4',
  },
  {
    id: '2',
    videoUrl: '/images/addVid2.mp4',
  },
  {
    id: '3',
    videoUrl: '/images/addVid3.mp4',
  },
  {
    id: '4',
    videoUrl: '/images/addVid1.mp4',
  },
  {
    id: '5',
    videoUrl: '/images/addVid2.mp4',
  },
  {
    id: '6',
    videoUrl: '/images/addVid3.mp4',
  },
];

const VideoCarousal = () => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const swiperRef = useRef<SwiperCore | null>(null);

  const handlePlay = (id: string, index: number) => {
    const currentVideo = videoRefs.current[id];
    if (!currentVideo) return;

    if (playingVideoId === id) {
      currentVideo.pause();
      setPlayingVideoId(null);
      swiperRef.current?.autoplay.start();
    } else {
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      currentVideo.play();
      setPlayingVideoId(id);
      swiperRef.current?.slideToLoop(index);
      swiperRef.current?.autoplay.stop();
    }
  };

  return (
    <styled.div position={'relative'}>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={3}
        spaceBetween={20}
        slidesPerGroup={1}
        centeredSlides
        loop
        loopAddBlankSlides
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        onSlideChange={swiper => {
          setActiveSlideIndex(swiper.realIndex);
        }}>
        {videos.map((vid, index) => (
          <SwiperSlide key={vid.id}>
            <styled.div
              key={vid.id}
              flex="0 0 32%"
              minWidth="0"
              borderRadius="29px"
              transition="all 0.3s ease-in-out"
              pos="relative"
              transform={activeSlideIndex === index ? 'scale(1)' : 'scale(0.9)'}
              onMouseEnter={() => setHoveredVideoId(vid.id)}
              onMouseLeave={() => setHoveredVideoId(null)}>
              {(playingVideoId !== vid.id || hoveredVideoId === vid.id) && (
                <styled.div
                  pos="absolute"
                  top="45%"
                  left="45%"
                  translate="(-50%, -50%)"
                  bg="white"
                  w={{ base: '10' }}
                  h={{ base: '10' }}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <IconButton
                    onClick={() => handlePlay(vid.id, index)}
                    variant="ghost"
                    h="16px"
                    w="16px"
                    className={css({
                      _hover: {
                        background: 'transparent',
                      },
                    })}
                    cursor="pointer"
                    zIndex="1">
                    {playingVideoId !== vid.id ? (
                      <PlayIcon
                        style={{ marginLeft: '2px', color: 'var(--colors-primary-9)', fill: 'var(--colors-primary-9)' }}
                      />
                    ) : (
                      <PauseIcon style={{ color: 'var(--colors-primary-9)', fill: 'var(--colors-primary-9)' }} />
                    )}
                  </IconButton>
                </styled.div>
              )}
              <styled.div
                w="100%"
                h="100%"
                borderRadius="29px"
                pos="absolute"
                inset="0"
                zIndex="0"
                boxShadow="inset 0 0 0 5px rgba(255, 255, 255, 0.3)"></styled.div>
              <styled.video
                ref={el => {
                  videoRefs.current[vid.id] = el;
                }}
                loop
                w="100%"
                h="100%"
                borderRadius="29px">
                <source src={vid.videoUrl} type="video/mp4" />
                <span>Your browser does not support the video tag.</span>
              </styled.video>
            </styled.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <styled.div
        pos="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex={100}
        bg="linear-gradient(to right, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 100%)"
        pointerEvents="none"
      />
    </styled.div>
  );
};

export default VideoCarousal;
