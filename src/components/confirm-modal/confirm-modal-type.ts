import React from 'react';
import { ReactNode } from 'react';
import { HTMLStyledProps, StackProps } from 'styled-system/jsx';

export interface ConfirmModalProps {
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  children?: ReactNode;
  onConfirm?: VoidFunction;
  confirmButtonText?: string;
  isLoading?: boolean;
  Icon?: React.ElementType;
  title?: string;
  desc?: string;
  titleProps?: HTMLStyledProps<'h2'>; // Assuming Dialog.Title renders an h2
  descProps?: HTMLStyledProps<'p'>; // Assuming Dialog.Description renders a p
  contentProps?: StackProps;
  withCancel?: boolean;
}
