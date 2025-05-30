import React, { useState, useEffect, useRef, TextareaHTMLAttributes, forwardRef } from 'react';
import { css } from 'styled-system/css';

const CHAT_INPUT_MIN_HEIGHT = 24; // Minimum height of the textarea

interface ResizableTextAreaProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
  resizable?: boolean;
  placeholderColor?: string;
}

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  ResizableTextAreaProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(
  (
    {
      id,
      value,
      onChange,
      placeholder,
      isDisabled = false,
      resizable = true,
      onKeyDown,
      style,
      placeholderColor,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const textAreaRef = (ref || innerRef) as React.RefObject<HTMLTextAreaElement>;

    useEffect(() => {
      // Adjust textarea height dynamically
      if (textAreaRef.current && resizable) {
        textAreaRef.current.style.height = '0px'; // Reset height to shrink as needed
        const scrollHeight = textAreaRef.current.scrollHeight; // Get the scroll height for current content
        textAreaRef.current.style.height = `${Math.max(scrollHeight, CHAT_INPUT_MIN_HEIGHT)}px`; // Adjust height based on content
      }
    }, [value, resizable, textAreaRef]);

    return (
      <textarea
        id={id}
        value={value}
        ref={textAreaRef}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        disabled={isDisabled}
        {...rest}
        className={css({
          flex: 1,
          _focus: { outline: 'none' },
          resize: 'none',
          height: `${CHAT_INPUT_MIN_HEIGHT}px`,
          marginTop: '7px',
          background: 'inherit',
          opacity: isDisabled ? '50%' : '100%',
          '&::placeholder': {
            color: placeholderColor || 'none',
          },
        })}
        style={{
          ...style,
        }}
      />
    );
  },
);

TextArea.displayName = 'TextArea';
