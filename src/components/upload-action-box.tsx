import React, { ReactNode } from 'react';
import { styled, VStack, HStack } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';

interface UploadActionBoxProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  onClick?: () => void;
  titleHighlightColor?: string;
  children?: ReactNode;
  additionalContent?: ReactNode;
  customButton?: ReactNode;
}

export default function UploadActionBox({
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon,
  onClick,
  titleHighlightColor = '#6d56fa',
  children,
  additionalContent,
  customButton,
}: UploadActionBoxProps) {
  // Split the title by | to get highlighted and normal parts
  const [highlightedPart, normalPart] = title.includes('|') ? title.split('|') : [title, ''];

  return (
    <styled.div
      minH="264px"
      display="flex"
      justifyContent="center"
      py={12}
      borderWidth={2}
      borderStyle="dashed"
      borderRadius={12}
      borderColor="gray.5"
      backgroundRepeat="no-repeat"
      backgroundSize="100% 100%">
      <VStack gap="14px" width="70%" textAlign="center" justifyContent="center">
        {additionalContent}
        <VStack gap="5px" mb={5}>
          <styled.span fontSize={18} textAlign="center">
            <styled.span color={titleHighlightColor} fontWeight="600" fontSize="19.77px">
              {highlightedPart}
            </styled.span>{' '}
            {normalPart && (
              <styled.span color="#15112B80" fontWeight="400" fontSize="19.77">
                {normalPart}
              </styled.span>
            )}
          </styled.span>

          {subtitle && (
            <styled.span color="#15112B80" fontWeight="400" fontSize="15.38px">
              {subtitle}
            </styled.span>
          )}

          {description && (
            <styled.span color="#15112B80" fontWeight="400" fontSize="15.38px">
              {description}
            </styled.span>
          )}
        </VStack>

        {customButton ||
          (buttonText && buttonIcon && onClick && (
            <IconButton
              borderRadius="12px"
              variant="solid"
              height="43px"
              backgroundColor="white"
              py="12px"
              px="10px"
              onClick={onClick}
              border="1px solid #4141410D"
              color="black"
              _hover={{ color: '#6D56FA', backgroundColor: '#6D56FA1F' }}
              shadow="md">
              {buttonIcon}
              <styled.span fontWeight="500" fontSize="15.38px">
                {buttonText}
              </styled.span>
            </IconButton>
          ))}

        {children}
      </VStack>
    </styled.div>
  );
}
