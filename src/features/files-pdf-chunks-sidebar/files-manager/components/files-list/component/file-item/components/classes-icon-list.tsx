import { HStack, styled } from 'styled-system/jsx';
import { ClassIcon } from './class-icon';
import { Tooltip } from '@/components/elements/tooltip';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';

interface Props {
  classNames: string[];
}

export const ClassesIconList = ({ classNames }: Props) => {
  if (classNames.length === 0) {
    return <span> </span>;
  }
  if (classNames.length === 1) {
    const [ExtractEmoji, extractedClassname] = getClassNameAndIcon(classNames[0]);
    return (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <HStack
            gap={1}
            height="27.74px"
            borderRadius="44.74px"
            border={'1px solid rgba(0, 0, 0, 0.1)'}
            background="rgba(21, 17, 43, 0.03)"
            px={3}
            w={'fit-content'}
            maxW="100px"
            mt={1}>
            <ExtractEmoji color={'#484846'} size={14} style={{ flexShrink: 0 }} />
            <styled.h3
              fontWeight={500}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              textStyle={'xs'}
              color={'#15112B'}>
              {extractedClassname}
            </styled.h3>
          </HStack>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          <Tooltip.Content
            bgColor={'white'}
            border={'1.5px solid rgba(109, 86, 250, 0.2)'}
            borderRadius={48}
            color={'#484846'}
            fontSize={'sm'}
            fontWeight={500}
            px={4}
            whiteSpace={'pre-line'}
            lineHeight={1}>
            {extractedClassname}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    );
  }

  return (
    <HStack gap={0}>
      {classNames.map((className, index) => {
        if (index < 2) {
          return (
            <styled.div key={index} marginRight={index + 1 === classNames.length ? '0px' : '-8px'} zIndex={'auto'}>
              <ClassIcon classnameWithEmoji={className} />
            </styled.div>
          );
        } else if (index === 2) {
          return (
            <styled.div key={index} zIndex={'auto'}>
              <ClassIcon classnameWithEmoji={classNames.slice(2)} />
            </styled.div>
          );
        }
        return null;
      })}
    </HStack>
  );
};
