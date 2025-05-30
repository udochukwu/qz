import { SpinningIcon } from '@/components/spinning-icon';
import React from 'react';
import { VStack, VstackProps } from 'styled-system/jsx';

export const LoadingScreen = (props: VstackProps) => {
  return (
    <VStack h="100vh" w="100%" justify="center" alignItems="center" {...props}>
      <SpinningIcon />
    </VStack>
  );
};
