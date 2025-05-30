import { Tooltip } from '@/components/elements/tooltip';
import React from 'react';
import { styled } from 'styled-system/jsx';

interface Props {
  fileName: string;
  variant?: 'reduced' | 'expanded' | 'sidebar';
  color?: string;
}

export const FileItemName = ({ fileName, variant, color }: Props) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger overflow="hidden">
        <styled.div
          textStyle="xs"
          display="flex"
          justifyContent="flex-start"
          textAlign="left"
          alignItems="center"
          overflow="hidden">
          <styled.span
            fontWeight="500"
            color={color || "#15112B"}
            pb={0}
            fontSize="13.74"
            flexGrow={1}
            flexShrink={1}
            maxWidth={variant === 'expanded' ? '100%' : '170px'}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis">
            {fileName}
          </styled.span>
        </styled.div>
      </Tooltip.Trigger>
      <Tooltip.Positioner zIndex="1000 !important">
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.Content maxW="100%">{fileName}</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};
