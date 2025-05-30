import React from 'react';
import { HStack, styled, Box, Flex, VStack } from 'styled-system/jsx';

interface PageHeaderProps {
  pageName: string;
  pageDescription: string;
  PageIcon: React.ElementType;
  actionButton?: React.ReactNode;
}

export const PageHeader = ({ pageName, pageDescription, PageIcon, actionButton }: PageHeaderProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" mt={5} width="100%">
      <VStack alignItems="flex-start">
        <HStack>
          <PageIcon size="1.5em" color="rgba(109, 86, 250, 1)" />
          <styled.span
            fontSize={'2xl'}
            lineHeight={'3xl'}
            fontWeight={500}
            color={'rgba(21, 17, 43, 1)'}
            display="block">
            {pageName}
          </styled.span>
        </HStack>
        <styled.span color={'rgba(21, 17, 43, 0.7)'} fontSize={16}>
          {pageDescription}
        </styled.span>
      </VStack>
      {actionButton && <Box>{actionButton}</Box>}
    </Flex>
  );
};
