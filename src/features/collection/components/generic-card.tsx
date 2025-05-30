import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { ReactNode } from 'react';

interface GenericCardProps {
  title: string;
  fileName?: string;
  countText: string;
  backgroundColor: string;
  iconColor: string;
  icon: ReactNode;
  onClick: () => void;
}

export const GenericCard = ({
  title,
  fileName,
  countText,
  backgroundColor,
  iconColor,
  icon,
  onClick,
}: GenericCardProps) => {
  const fileExtension = fileName ? getFileExtension(fileName) : null;

  return (
    <div
      role="button"
      className={css({
        border: '1px solid #EFEFF0',
        borderRadius: '16px',
        height: '80px',
        padding: '12px',
        cursor: 'pointer',
        background: '#FFFFFF',
      })}
      onClick={onClick}>
      <HStack gap="12px">
        <div
          className={css({
            width: '56px',
            height: '56px',
            borderRadius: '6px',
            padding: '16px',
            alignContent: 'center',
            margin: '0',
            flexShrink: 0,
          })}
          style={{ backgroundColor }}>
          {icon}
        </div>
        <VStack gap="6px" alignItems="flex-start" width="100%" overflow="hidden">
          <p
            className={css({
              fontWeight: '500',
              fontSize: '1rem',
              lineHeight: '1.25rem',
              color: '#3E3646',
              margin: '0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              cursor: 'pointer',
            })}>
            {title}
          </p>

          <HStack gap="6px" alignItems="flex-start" pb="2px">
            <div
              className={css({
                border: '0.67px solid #5F5F5F0F',
                borderRadius: '4px',
                height: '22px',
                px: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8F8F9',
                flexShrink: 0,
              })}>
              <p
                className={css({
                  fontWeight: '400',
                  fontSize: '0.7rem',
                  lineHeight: '0.875rem',
                  color: '#3E3646',
                  margin: '0',
                  whiteSpace: 'nowrap',
                })}>
                {countText}
              </p>
            </div>
            {fileExtension && <FileItemExtension width="22px" height="20px" fontSize="8px" extension={fileExtension} />}
          </HStack>
        </VStack>
      </HStack>
    </div>
  );
};
