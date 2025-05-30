import { Flex, styled } from 'styled-system/jsx';
import * as Progress from '@/components/elements/styled/progress';
import { StatusLimit } from '../types';

interface Props {
  type: string;
  limit?: StatusLimit;
  usage: number;
}

export const UsageProgress = ({ type, limit, usage }: Props) => {
  if (!limit || !limit.limit || !limit.period) {
    return null;
  }

  let percentage = parseFloat(((usage / limit.limit) * 100).toFixed(2));
  if (percentage > 100) {
    percentage = 100;
  }

  return (
    <Flex w="full" px={2} py={0} direction="column" gap={'3px'}>
      <Flex justifyContent="space-between">
        <styled.span fontSize="12px" color={'#15112B'} fontWeight={'semibold'}>
          {type}/{limit.period}
        </styled.span>
        <styled.span fontSize="12px" color={'#15112B'} fontWeight={'semibold'}>
          {usage}/{limit.limit}
        </styled.span>
      </Flex>
      <Progress.Root value={percentage}>
        <Progress.Track bgColor="#6D56FA1F" h={'3px'}>
          <Progress.Range bgColor="#6D56FA !important" />
        </Progress.Track>
      </Progress.Root>
    </Flex>
  );
};
