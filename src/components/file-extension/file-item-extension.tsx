import { YoutubeIcon } from '@/features/files-pdf-chunks-sidebar/youtube-icon';
import React from 'react';
import { css } from 'styled-system/css';

interface Props {
  extension: string;
  iconSize?: number;
  fontSize?: string;
  height?: string;
  width?: string;
  style?: React.CSSProperties;
}

const RecordingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.3613 1.11665C12.3613 0.778779 12.0927 0.504883 11.7613 0.504883C11.4299 0.504883 11.1612 0.778779 11.1612 1.11665V6.91089C10.7968 6.7246 10.3811 6.62253 9.96109 6.62253C8.74257 6.62253 7.56086 7.48147 7.56086 8.76371C7.56086 10.0459 8.74257 10.9049 9.96109 10.9049C11.1796 10.9049 12.3613 10.0459 12.3613 8.76371V1.11665Z"
      fill="#6D56FA"
    />
    <path
      d="M0.961387 1.11665C0.629984 1.11665 0.361328 1.39054 0.361328 1.72841C0.361328 2.06628 0.629984 2.34018 0.961387 2.34018H8.76215C9.09355 2.34018 9.36221 2.06628 9.36221 1.72841C9.36221 1.39054 9.09355 1.11665 8.76215 1.11665H0.961387Z"
      fill="#6D56FA"
    />
    <path
      d="M0.961387 4.78724C0.629984 4.78724 0.361328 5.06113 0.361328 5.399C0.361328 5.73687 0.629984 6.01077 0.961387 6.01077H5.76186C6.09326 6.01077 6.36191 5.73687 6.36191 5.399C6.36191 5.06113 6.09326 4.78724 5.76186 4.78724H0.961387Z"
      fill="#6D56FA"
    />
    <path
      d="M0.961387 8.45782C0.629984 8.45782 0.361328 8.73172 0.361328 9.06959C0.361328 9.40746 0.629984 9.68135 0.961387 9.68135H4.56174C4.89314 9.68135 5.1618 9.40746 5.1618 9.06959C5.1618 8.73172 4.89314 8.45782 4.56174 8.45782H0.961387Z"
      fill="#6D56FA"
    />
  </svg>
);

export const FileItemExtension = ({ extension, iconSize, fontSize, height, width, style }: Props) => {
  let color;
  let content;
  extension = extension.toUpperCase();
  const spanStyles = css({
    fontWeight: 'medium',
    width: width || '27.5px',
    height: height || '27.5px',
    boxShadow: '0px 1.58px 0px 0px #E2E2E2',
    border: '0.4px solid #E2E2E2',
    borderRadius: '4.81px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    aspectRatio: '1/1',
    overflow: 'hidden',
    fontSize: '10px',
    backgroundColor: 'white',
  });

  switch (extension) {
    case 'PDF':
      color = '#FF0D0D';
      content = extension;
      break;
    case 'DOCX':
    case 'DOC':
      color = 'rgb(0, 0, 255)';
      content = 'DOC';
      break;
    case 'PPTX':
    case 'PPT':
      color = '#D04423';
      content = 'PPT';
      break;
    case 'WEBM':
      return (
        <span className={spanStyles}>
          <RecordingIcon />
        </span>
      );
    case 'YOUTUBE':
      return (
        <span className={spanStyles}>
          <YoutubeIcon size={iconSize} />
        </span>
      );
    default:
      color = '#6D56FA';
      content = extension;
  }

  return (
    <span
      className={spanStyles}
      style={{
        color: color,
        fontSize: fontSize,
        ...style,
      }}>
      {content}
    </span>
  );
};
