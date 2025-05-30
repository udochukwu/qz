import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { CopilotAction, CopilotActionType } from '@/types';
import { Search } from 'lucide-react';
import { Box, HStack, styled } from 'styled-system/jsx';

const ActionItem = ({ action }: { action: CopilotAction }) => {
  //if action type is file we want to get the meta data ext from it
  const ext = action.type === CopilotActionType.FILE ? action.metadata.ext : '';

  return (
    <HStack
      pr={3}
      pl={1.5}
      py={1}
      gap={2}
      minH={10}
      fontSize="sm"
      alignItems={'center'}
      bg={'rgba(21, 17, 43, 0.03)'}
      border="1px solid rgba(21, 17, 43, 0.06)"
      borderRadius="md">
      {action.type === 'query' && (
        <Box>
          <Search size={17} color="#15112B80" />
        </Box>
      )}
      {action.type === CopilotActionType.FILE && ext && (FileItemExtension({ extension: ext }) as JSX.Element)}
      <Box
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}>
        {action.title}
      </Box>
    </HStack>
  );
};
export default ActionItem;
