import { forwardRef } from 'react';
import * as StyledCheckbox from './styled/checkbox';

export interface CheckboxProps extends StyledCheckbox.RootProps {
  iconColor?: string;
  iconBackground?: string;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => {
  const { children, iconColor = 'currentColor', iconBackground = 'transparent', ...rootProps } = props;

  return (
    <StyledCheckbox.Root ref={ref} {...rootProps}>
      <StyledCheckbox.Control borderColor={props.borderColor}>
        <StyledCheckbox.Indicator>
          <CheckIcon />
        </StyledCheckbox.Indicator>
        <StyledCheckbox.Indicator indeterminate>
          <MinusIcon />
        </StyledCheckbox.Indicator>
      </StyledCheckbox.Control>
      {children && <StyledCheckbox.Label>{children}</StyledCheckbox.Label>}
      <StyledCheckbox.HiddenInput />
    </StyledCheckbox.Root>
  );
});

Checkbox.displayName = 'Checkbox';

const CheckIcon = ({ color }: { color?: string }) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Check Icon</title>
    <path
      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = ({ color }: { color?: string }) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Minus Icon</title>
    <path
      d="M2.91675 7H11.0834"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
