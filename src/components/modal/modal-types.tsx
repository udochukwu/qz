import { ReactNode } from 'react';

export interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  withCancel?: boolean;
  Icon?: React.ComponentType<{ size?: string; color?: string }>;
  contentProps?: object;
  titleProps?: object;
  descriptionProps?: object;
  lazyMount?: boolean;
  width?: string;
  backgroundColor?: string;
  backdropFilter?: string;
  height?: string;
  zIndex?: number;
}
