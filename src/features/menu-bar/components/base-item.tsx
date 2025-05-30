import { ReactNode } from 'react';
import { Box, Flex, HStack, styled } from 'styled-system/jsx';

interface BaseItemProps {
  active: boolean;
  activeColor: string;
  icon: ReactNode;
  title: string;
  onClick: () => void;
  rightContent?: ReactNode;
  hoverBg?: string;
  baseBg?: string;
}

export function BaseItem({
  active,
  activeColor,
  icon,
  title,
  onClick,
  rightContent,
  hoverBg = '#F0F0F1',
  baseBg = '#F8F8F9',
}: BaseItemProps) {
  return (
    <HStack
      onClick={onClick}
      justifyContent="space-between"
      w="full"
      flex="1"
      alignItems="center"
      rounded="md"
      bg={active ? hoverBg : baseBg}
      color="#868492"
      _hover={{ bgColor: '#6D56FA1F', borderColor: '#6D56FA29', borderLeftColor: '##6D56FA29', color: '#6D56FA' }}
      cursor="pointer"
      border="1px solid rgba(95, 95, 95, 0.06)"
      p="2"
      style={{
        borderLeftColor: active ? activeColor : 'rgba(95, 95, 95, 0.06)',
        borderLeftWidth: active ? '3px' : '1px',
        transition:
          'border-left-width 0.2s ease-in-out, border-left-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
      }}>
      <Flex alignItems="center" gap="2" minW="0" flex="1">
        <Box flexShrink="0">{icon}</Box>
        <styled.span
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          flex="1"
          fontSize={'sm'}
          fontWeight={'medium'}
          style={{ color: '#3E3C46' }}>
          {title}
        </styled.span>
      </Flex>

      {rightContent}
    </HStack>
  );
}
