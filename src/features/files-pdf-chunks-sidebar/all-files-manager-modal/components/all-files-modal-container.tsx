'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Dialog } from '@/components/elements/dialog';
import ReactDOM from 'react-dom';

interface Props {
  isOpen?: boolean;
  setIsOpen: (val: boolean) => void;
  children: ReactNode;
}

export const AllFilesModalContainer = ({ isOpen, setIsOpen, children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }
  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content h="700px" w="800px" overflow="clip">
              {children}
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </>,
    document.body,
  );
};
