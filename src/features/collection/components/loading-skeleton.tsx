import { HStack, VStack } from 'styled-system/jsx';
import { Skeleton } from '@/components/elements/skeleton';

export const LoadingSkeleton = () => (
  <VStack w="100%" h={'100%'} gap={6}>
    <HStack w="100%">
      <Skeleton w="100%" h="40px" />
    </HStack>
    <VStack w="100%" height="100%" gap={6}>
      {[...Array(4)].map((_, index) => (
        <HStack key={index} w="100%" gap="4%">
          <Skeleton w="32%" h="100px" />
          <Skeleton w="32%" h="100px" />
          <Skeleton w="32%" h="100px" />
        </HStack>
      ))}
    </VStack>
  </VStack>
);
