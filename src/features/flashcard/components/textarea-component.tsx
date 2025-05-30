import { Textarea } from '@/components/elements/textarea';
import { useRef, useEffect, useMemo } from 'react';
import { css } from 'styled-system/css';

interface TextareaComponentProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  customStyles?: Record<string, any>;
  isEditing: boolean;
}

const TextareaComponent = ({ value, onChange, isEditing, customStyles = {} }: TextareaComponentProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  // Memoize the set of keys that should stop propagation
  const keysToStopPropagation = useMemo(
    () => new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter', 'Tab', ' ']),
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isEditing) {
      // Stop propagation if it's a key in our set, a printable character, or has modifiers
      if (keysToStopPropagation.has(e.key) || e.key.length === 1 || e.ctrlKey || e.metaKey || e.altKey) {
        e.stopPropagation();
      }

      // Keep the improved Tab key handling
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default focus change
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const newValue = value.substring(0, start) + '\t' + value.substring(end);
        onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        });
      }
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={css({
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.375rem',
        textAlign: 'left',
        color: '#3E3C46',
        backgroundColor: '#4141410A',
        width: '100%',
        minHeight: '100px',
        overflow: 'hidden',
        resize: 'none',
        whiteSpace: 'pre-wrap',
        ...customStyles,
      })}
    />
  );
};

export default TextareaComponent;
