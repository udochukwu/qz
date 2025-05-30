import React from 'react';
import { HStack, styled } from 'styled-system/jsx';
import { circle } from 'styled-system/patterns';
import { Tooltip } from '@/components/elements/tooltip';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
interface Props {
  classnameWithEmoji: string[] | string;
  size?: string;
}
const EllipsisIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6d56fa"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};
export const ClassIcon: React.FC<Props> = ({ classnameWithEmoji, size = '2rem' }) => {
  const classes = Array.isArray(classnameWithEmoji) ? classnameWithEmoji : [classnameWithEmoji];
  const isMultipleClasses = classes.length > 1;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <styled.span className={circle({ size })} bgColor={'#f6f6ff'}>
          {isMultipleClasses ? <EllipsisIcon /> : React.createElement(getClassNameAndIcon(classes[0])[0], { size: 14 })}
        </styled.span>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          bgColor={'white'}
          border={'1.5px solid rgba(109, 86, 250, 0.2)'}
          borderRadius={isMultipleClasses ? 14 : 48}
          color={'#484846'}
          fontSize={'sm'}
          fontWeight={500}
          px={4}
          lineHeight={isMultipleClasses ? 1.5 : 1}>
          {classes.map((classname, index) => {
            const [ExtractEmoji, extractedClassname] = getClassNameAndIcon(classname);
            return (
              <HStack key={index}>
                {isMultipleClasses && <ExtractEmoji size={14} style={{ flexShrink: 0 }} />}
                <styled.span whiteSpace={'pre'} overflow="hidden" textOverflow="ellipsis">
                  {extractedClassname}
                </styled.span>
              </HStack>
            );
          })}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};
