'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { Stack } from 'styled-system/jsx';
import { ModalProps } from './modal-types';
import { css } from 'styled-system/css';
import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export const Modal = ({
  children,
  isOpen,
  onOpenChange,
  title,
  description,
  contentProps,
  titleProps,
  descriptionProps,
  lazyMount,
  width,
  backgroundColor,
  backdropFilter,
  height,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <Dialog.Root open={isOpen} onOpenChange={e => onOpenChange(e.open)} lazyMount={lazyMount}>
            <motion.div
              style={{ position: 'fixed', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <Dialog.Backdrop
                className={css({
                  backgroundColor: backgroundColor ?? 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: backdropFilter ?? 'blur(0px)',
                  position: 'fixed',
                  inset: 0,
                })}
              />
            </motion.div>
            <Dialog.Positioner>
              <motion.div
                style={{ position: 'relative' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}>
                <Dialog.Content
                  onClick={e => e.stopPropagation()}
                  rounded="xl"
                  w={width}
                  maxW={width ?? '650px'}
                  h={height}
                  maxH={height}
                  overflowY="auto"
                  {...contentProps}>
                  <Stack gap="3">
                    {title && <Dialog.Title {...titleProps}>{title}</Dialog.Title>}
                    {description && <Dialog.Description {...descriptionProps}>{description}</Dialog.Description>}
                    {children}
                  </Stack>
                </Dialog.Content>
              </motion.div>
            </Dialog.Positioner>
          </Dialog.Root>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
