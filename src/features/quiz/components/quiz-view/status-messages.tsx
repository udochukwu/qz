import React, { useEffect, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const MotionStyledP = motion(styled.p);
const MotionDiv = motion(styled.div);
const MotionCheck = motion(Check);

interface StatusMessage {
  id: string;
  message: string;
  type: 'intro' | 'material' | 'topic' | 'final' | 'success';
}

interface VisibleMessage {
  message: StatusMessage;
  position: number;
  isNextUpMaterial?: boolean;
}

interface StatusMessagesProps {
  messages: StatusMessage[];
  activeMessageIndex: number;
  previousActiveMessage: StatusMessage | null;
}

const getIntervalForMessageType = (type: string) => {
  switch (type) {
    case 'material':
      return 7000;
    case 'topic':
      return 3000;
    case 'intro':
      return 6000;
    case 'final':
      return 6000;
    case 'success':
      return 5000;
    default:
      return 3000;
  }
};

export const StatusMessages: React.FC<StatusMessagesProps> = ({
  messages,
  activeMessageIndex,
  previousActiveMessage,
}) => {
  // Generate the messages to display based on the active index
  const visibleMessages = React.useMemo<VisibleMessage[]>(() => {
    if (!messages.length) return [];

    // If we've reached the end of the messages, show the last message
    if (activeMessageIndex >= messages.length) {
      return [];
    }

    // If this is the last message, just show it without any upcoming messages
    const isLastMessage = activeMessageIndex === messages.length - 1;
    if (isLastMessage) {
      return [
        {
          message: messages[activeMessageIndex],
          position: 0,
          isNextUpMaterial: false,
        },
      ];
    }

    // Create an array of messages to display
    const result: VisibleMessage[] = [];

    // Start from the active message and include up to 8 messages
    for (let i = 0; i < 8; i++) {
      const index = activeMessageIndex + i;
      // Stop if we've reached the end of the messages
      if (index >= messages.length) break;

      // For the next message (position 1), check if it's a material message and the current message is also material
      const currentMessage = messages[activeMessageIndex];
      const nextMessage = messages[index];
      const isNextUpMaterial = i === 1 && nextMessage?.type === 'material' && currentMessage?.type === 'material';

      result.push({
        message: messages[index],
        position: i,
        isNextUpMaterial: isNextUpMaterial,
      });
    }

    return result;
  }, [messages, activeMessageIndex]);

  return (
    <styled.div
      minHeight={'550px'}
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      pt={48}
      alignItems={'center'}>
      <styled.div
        position="relative"
        height={'240px'}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden">
        {/* Add invisible placeholders above the main container for exit animations */}
        <styled.div position="absolute" top="-100px" width="100%" overflow="hidden" pointerEvents="none">
          <AnimatePresence>
            {previousActiveMessage && (
              <MotionStyledP
                key={`exiting-${previousActiveMessage.id}`}
                layoutId={`exiting-${previousActiveMessage.id}`}
                initial={{ opacity: 0, y: 60 }}
                animate={{
                  opacity: 0.3,
                  y: -60,
                  filter: 'blur(3px)',
                  scale: 0.85,
                }}
                exit={{
                  opacity: 0,
                  y: -120,
                  filter: 'blur(6px)',
                  transition: {
                    opacity: { duration: 0.6 },
                    filter: { duration: 0.4 },
                  },
                }}
                fontSize={'lg'}
                fontWeight={'medium'}
                position="absolute"
                width="100%"
                textAlign="center"
                top="0"
                py={0}
                my={0}>
                {previousActiveMessage.message}
              </MotionStyledP>
            )}
          </AnimatePresence>
        </styled.div>

        <AnimatePresence>
          {visibleMessages.map(({ message, position, isNextUpMaterial = false }) => {
            const messageId = message.id;
            const messageType = message.type;

            // Different animation behavior based on position
            return (
              <MotionStyledP
                key={messageId}
                layoutId={messageId}
                fontSize={position === 0 ? '3xl' : isNextUpMaterial ? 'xl' : 'lg'}
                fontWeight={'medium'}
                position="absolute"
                top={position === 0 ? '0' : `${position * (180 / 5)}px`} // Increase spacing between items
                my={0}
                mb={position === 0 ? 2 : 0}
                py={0}
                zIndex={5 - position} // Simplified z-index based on 5 visible items
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 1,
                }}
                initial={
                  position === 0
                    ? { y: 50, opacity: 0, filter: 'none', scale: 0.92 }
                    : {
                        y: 0,
                        opacity: isNextUpMaterial
                          ? 0.7 // Higher opacity for next material message
                          : Math.max(0, 1 - position * 0.3), // Increase opacity falloff
                        filter: isNextUpMaterial
                          ? `blur(1px)` // Less blur for next material message
                          : `blur(${Math.min(position * 2, 6)}px)`, // Progressive blur
                        color: isNextUpMaterial
                          ? `rgba(0,0,0,0.8)` // Darker color for next material message
                          : `rgba(0,0,0,${0.8 - position * 0.12})`,
                      }
                }
                animate={
                  position === 0
                    ? {
                        y: -10,
                        opacity: 1,
                        filter: 'none',
                        scale: 1,
                        transition: {
                          type: 'spring',
                          bounce: 0.2,
                          duration: 1,
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.5, type: 'spring', bounce: 0.3 },
                        },
                      }
                    : {
                        y: 0,
                        opacity: isNextUpMaterial
                          ? 0.7 // Higher opacity for next material message
                          : Math.max(0, 1 - position * 0.3), // Increase opacity falloff
                        top: `${position * (180 / 5)}px`, // Increased spacing
                        filter: isNextUpMaterial
                          ? `blur(1px)` // Less blur for next material message
                          : `blur(${Math.min(position * 2, 6)}px)`, // Progressive blur
                        color: isNextUpMaterial
                          ? `rgba(0,0,0,0.8)` // Darker color for next material message
                          : `rgba(0,0,0,${0.8 - position * 0.12})`,
                      }
                }
                exit={
                  position === 0
                    ? {
                        y: -60,
                        opacity: 0.3,
                        scale: 0.85,
                        filter: 'blur(5px)',
                        transition: {
                          duration: 0.5,
                          y: { type: 'spring', bounce: 0, duration: 1 },
                          filter: { duration: 0.4 },
                          opacity: { duration: 0.6 },
                        },
                      }
                    : {
                        opacity: 0,
                        y: -40,
                        filter: 'blur(3px)',
                        transition: {
                          opacity: { duration: 0.4 },
                          filter: { duration: 0.3 },
                        },
                      }
                }>
                {position === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <MotionDiv
                      background={
                        messageType === 'intro'
                          ? 'linear-gradient(90deg, #6d56fa, #9b8cfa, #6d56fa, #4a32fa, #6d56fa)'
                          : messageType === 'material'
                            ? 'linear-gradient(90deg, #56B4FA, #56DAEF, #56B4FA, #3E94D1, #56B4FA)'
                            : messageType === 'topic'
                              ? 'linear-gradient(90deg, #FA7856, #FABD56, #FA7856, #D15B3E, #FA7856)'
                              : messageType === 'success'
                                ? 'linear-gradient(90deg, #4CAF50, #8BC34A, #4CAF50, #2E7D32, #4CAF50)'
                                : 'linear-gradient(90deg, #6d56fa, #9b8cfa, #6d56fa, #4a32fa, #6d56fa)'
                      }
                      backgroundSize="300% auto"
                      color="transparent"
                      backgroundClip="text"
                      style={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                      }}
                      initial={{
                        backgroundPosition: '0% center',
                        filter: 'brightness(0.2) contrast(0.8)',
                      }}
                      animate={{
                        backgroundPosition: ['0% center', '300% center'],
                        filter: ['brightness(0.2) contrast(0.8)', 'brightness(1) contrast(1)'],
                      }}
                      exit={{
                        backgroundPosition: '0% center',
                        filter: 'brightness(0.2) contrast(0.8)',
                      }}
                      transition={{
                        backgroundPosition: {
                          repeat: Infinity,
                          duration:
                            messageType === 'topic'
                              ? 2
                              : messageType === 'material'
                                ? 5
                                : messageType === 'success'
                                  ? 7
                                  : 4,
                          ease: 'linear',
                        },
                        filter: {
                          duration: messageType === 'topic' ? 0.5 : messageType === 'success' ? 2 : 1.5,
                          ease: 'easeOut',
                        },
                      }}>
                      {message.message}
                    </MotionDiv>
                  </motion.div>
                ) : (
                  message.message
                )}
              </MotionStyledP>
            );
          })}
        </AnimatePresence>
      </styled.div>
    </styled.div>
  );
};

export type { StatusMessage };
export { getIntervalForMessageType };
