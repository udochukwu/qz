import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/elements/button';
import { Tooltip } from '@/components/elements/tooltip';
import { css } from 'styled-system/css';

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  text?: string;
}

export default function IconButton({ icon, text, ...buttonProps }: IconButtonProps) {
  return (
    <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 5 } }} disabled={text === undefined}>
      <Tooltip.Trigger asChild>
        <Button
          justifyContent={'center'}
          minHeight={'44px'}
          minWidth={'44px'}
          w={'44px'}
          h={'44px'}
          size={'lg'}
          px={2}
          outline={'none'}
          fontWeight={500}
          color={'rgb(21, 17, 43)'}
          cursor={'pointer'}
          variant={'ghost'}
          bgColor={'#F3F3F3'}
          _hover={{ color: '#6D56FA', backgroundColor: '#6D56FA26' }}
          {...buttonProps}>
          {icon}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          bgColor={'white'}
          borderRadius={'sm'}
          color={'#484846'}
          fontSize={'sm'}
          fontWeight={600}
          px={4}
          whiteSpace={'pre-line'}
          textWrap={'nowrap'}
          overflow={'hidden'}
          textOverflow={'ellipsis'}
          lineHeight={1}
          boxShadow={
            '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03),-14px 0px 6px -2px rgba(16, 24, 40, 0.03)'
          }>
          <Tooltip.Arrow
            className={css({
              '--arrow-size': '8px',
              '--arrow-background': 'white',
            })}>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {text}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}
