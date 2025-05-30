import { ReactNode } from 'react';
import { Tooltip } from './elements/tooltip';

interface TooltipWrapperProps {
  trigger: ReactNode;
  content: ReactNode;
}
export const TooltipWrappper = (props: TooltipWrapperProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{props.trigger}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.Content>{props.content}</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};
