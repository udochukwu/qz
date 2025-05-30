import { styled } from 'styled-system/jsx';

interface StepperItemProps {
  number: number;
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

/**
 * A component that renders a single step in the quiz creation process.
 * Shows a numbered circle and label, with active and disabled states.
 */
export const StepperItem = ({ number, label, isActive = false, isDisabled = false, onClick }: StepperItemProps) => {
  return (
    <styled.div
      backgroundColor={isActive ? 'rgba(109, 86, 250, 0.1)' : 'transparent'}
      px={2}
      py={1}
      rounded={'lg'}
      display={'flex'}
      alignItems={'center'}
      gap={2}
      cursor={isDisabled ? 'default' : 'pointer'}
      onClick={isDisabled ? undefined : onClick}
      opacity={isDisabled ? 0.5 : 1}>
      <styled.div
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        mt={'1px'}
        w="16px"
        h="16px"
        fontWeight={'medium'}
        borderRadius={'full'}
        fontSize={'9px'}
        border={isActive ? '1px solid #6d56fa' : '1px solid #00000095'}>
        <styled.span color={isActive ? '#6d56fa' : 'inherit'}>{number}</styled.span>
      </styled.div>
      <styled.span fontSize={'sm'} fontWeight={'medium'} color={isActive ? '#6d56fa' : '#00000095'}>
        {label}
      </styled.span>
    </styled.div>
  );
};
