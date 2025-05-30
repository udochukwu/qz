import { Button, ButtonProps } from '@/components/elements/button';
import { Menu } from '@/components/elements/menu';
import { Children } from 'react';
import IconButton from './icon-button';

interface MultipleButtonsProps extends ButtonProps {
  icon: React.ReactNode;
  triggerProps?: ButtonProps;
}

export const MultipleButtons = ({ icon, triggerProps, children }: MultipleButtonsProps) => {
  return (
    <>
      <Menu.Root positioning={{ placement: 'right' }}>
        <Menu.Trigger asChild>
          <IconButton icon={icon} borderRadius={'full'} {...triggerProps} />
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            {Children.toArray(children).map((child, index) => (
              <Menu.Item all="unset" id={index.toString()} key={index} value={index.toString()}>
                {child}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </>
  );
};
