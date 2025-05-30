import { Button } from '@/components/elements/button';
import { Divider, VStack, styled } from 'styled-system/jsx';
import { Fragment, ReactNode } from 'react';
import { Skeleton } from '@/components/elements/skeleton';
import { Box } from 'lucide-react';

interface Props<T> {
  items: T[];
  itemRenderer: (item: T) => ReactNode;
  onItemSelect: (item: T) => void;
  emptyState?: ReactNode;
  createAction: VoidFunction;
  createText: string;
  isLoading?: boolean;
}

export default function RecentClassesFilesList<T>({
  items,
  emptyState = 'None',
  createAction,
  onItemSelect,
  createText,
  itemRenderer,
  isLoading = false,
}: Props<T>) {
  if (isLoading) {
    return (
      <VStack h="calc(50vh - 50px)" pos="rel" overflow="clip" gap={0}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Fragment key={idx}>
            <styled.div w="100%" p={4}>
              <Skeleton h="50px" w="100%" />
            </styled.div>
            <Divider />
          </Fragment>
        ))}
      </VStack>
    );
  }

  if (items.length === 0) {
    return (
      <VStack h="calc(50vh - 50px)" justify="center">
        <styled.h3 textStyle="md" fontWeight="normal" color="#202020" textAlign="center" padding="0 30px">
          {emptyState}
        </styled.h3>
        <Button onClick={createAction} w="150px">
          {createText}
        </Button>
      </VStack>
    );
  }

  return (
    <>
      <VStack h="calc(50vh - 50px)" pos="rel" p={0} overflow="auto" gap={0}>
        {items.map((item, idx) => (
          <Fragment key={idx}>
            <styled.div w="100%">
              <Button
                variant={'ghost'}
                onClick={() => onItemSelect(item)}
                w="100%"
                display="flex"
                justifyContent="flex-start"
                borderRadius={0}
                height="70px"
                alignItems="center">
                <styled.h3 textStyle="md" truncate={true} mb={0} p={4} display="flex" gap={5}>
                  {itemRenderer(item)}
                </styled.h3>
              </Button>
            </styled.div>
            <Divider />
          </Fragment>
        ))}
      </VStack>
    </>
  );
}
