import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { styled } from 'styled-system/jsx';

interface Props {
  class_name: string;
  color: string;
  onClick: () => void;
  isSelected?: boolean;
}

export const ClassButton = ({ class_name, color, onClick, isSelected = false }: Props) => {
  const [ExtractEmoji, extractedClassname] = getClassNameAndIcon(class_name);
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        flexDir: 'column',
        flex: '1',
        py: '4',
        px: '2',
        backgroundColor: isSelected ? '#F5F3FF' : '#FFFFFF',
        _hover: {
          backgroundColor: 'rgba(26, 12, 108, 0.06)', // New background color on hover
        },
        border: isSelected ? '1px solid #A599FA' : '1px solid #5F5F5F0F',
        cursor: 'pointer',
        borderRadius: '12px',
        height: '56px',
      })}
      onClick={onClick}>
      <Flex justifyContent="flex-start" alignItems="center" width="100%" gap="3">
        <styled.div bg="#F8F8F9" padding="6px" borderRadius="4px">
          <ExtractEmoji color={color} />
        </styled.div>
        <div
          className={css({
            fontSize: '16px',
            lineHeight: 'sm',
            whiteSpace: 'nowrap',
            fontWeight: isSelected ? '500' : '400',
            color: isSelected ? '#6D56FA' : '#15112B',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}>
          {extractedClassname}
        </div>
      </Flex>
    </div>
  );
};
