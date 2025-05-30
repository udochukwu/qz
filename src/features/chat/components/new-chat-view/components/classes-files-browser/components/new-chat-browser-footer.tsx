import { Button } from '@/components/elements/button';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { css } from 'styled-system/css';
import { Divider, HStack, styled } from 'styled-system/jsx';

interface Props {
  createText?: string;
  browseText?: string;
  onCreate: VoidFunction;
  onBrowse: VoidFunction;
}

export const NewChatBrowserFooter = ({ onCreate, onBrowse, createText = 'Create', browseText = 'Browse' }: Props) => {
  return (
    <styled.div pos="absolute" bottom={0} w="100%" bg="white">
      <Divider />
      <HStack h="50px" justify="space-between" pt={2} px={4}>
        <Button variant="ghost" onClick={onBrowse}>
          {browseText}
        </Button>
        <Button variant="ghost" onClick={onCreate}>
          <PlusIcon size="md" />
          {createText}
        </Button>
      </HStack>
    </styled.div>
  );
};
