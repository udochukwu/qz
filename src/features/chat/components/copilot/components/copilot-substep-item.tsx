import { Box, HStack, styled } from 'styled-system/jsx';
import ActionItem from './copilot-action-item';
import { CopilotSubStep } from '@/types';

const Substep = ({ substep }: { substep: CopilotSubStep }) => (
  <Box alignItems="center">
    <styled.span
      fontSize="sm"
      color="rgba(21, 17, 43, 0.5)"
      style={{
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}>
      {substep.title}
    </styled.span>
    <HStack flexWrap="wrap" gap={2} mt={2} p={0.75}>
      {substep.actions.map((action, actionIndex) => (
        <ActionItem key={actionIndex} action={action} />
      ))}
    </HStack>
  </Box>
);

export default Substep;
