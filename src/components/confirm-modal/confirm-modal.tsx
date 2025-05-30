'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/elements/button';
import { Stack, styled } from 'styled-system/jsx';
import { Dialog } from '@/components/elements/dialog';
import { ConfirmModalProps } from './confirm-modal-type';
import { SpinningIcon } from '../spinning-icon';
import { Modal } from '../modal/modal';
import { useTranslation } from 'react-i18next';

export const ConfirmModal = ({
  confirmButtonText = 'Confirm',
  setIsOpen,
  isOpen,
  Icon,
  title,
  desc,
  titleProps,
  descProps,
  contentProps,
  children,
  onConfirm,
  isLoading = false,
  withCancel = true,
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => setIsOpen(e)}>
          <div>
            <Stack gap="3" p="35px" {...contentProps}>
              {Icon && <Icon size="3em" color="rgb(140,140,140,0.8)" />}
              <Stack gap="1">
                {title && (
                  <styled.span fontSize={'22px'} fontWeight={500}>
                    {title}
                  </styled.span>
                )}
                {desc && (
                  <Dialog.Description pb={'25px'} fontSize={'lg'} color={'#868492'} {...descProps} mt={'16px'}>
                    {desc}
                  </Dialog.Description>
                )}
              </Stack>
              {children}
              <Stack gap="3" direction="row" justifyContent="center" alignItems="stretch" width={'100%'}>
                <Dialog.CloseTrigger asChild display={!withCancel ? 'none' : undefined}>
                  <Button width="full" color="colorPalette.9" bg={'colorPalette.4'} borderWidth={0} flex={1}>
                    {t('common.cancel')}
                  </Button>
                </Dialog.CloseTrigger>
                <Button
                  width="full"
                  onClick={() => onConfirm?.()}
                  disabled={isLoading}
                  borderColor={'#0000001A'}
                  flex={1}>
                  {!isLoading ? confirmButtonText : <SpinningIcon />}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Modal>
      )}
    </>,
    document.body,
  );
};
