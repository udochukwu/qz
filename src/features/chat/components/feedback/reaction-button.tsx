import React from 'react';
import { Button } from '@/components/elements/button';
import { ButtonProps } from '@/components/elements/styled/button';

export default function ReactionComponent({ selected, children, onClick }: ButtonProps & { selected: boolean }) {
  return (
    <Button
      height="53px"
      width="54px"
      borderRadius="xl"
      paddingX={3}
      backgroundColor={selected ? '#6D56FA0F' : '#F8F8F9'}
      onClick={onClick}>
      {children}
    </Button>
  );
}
