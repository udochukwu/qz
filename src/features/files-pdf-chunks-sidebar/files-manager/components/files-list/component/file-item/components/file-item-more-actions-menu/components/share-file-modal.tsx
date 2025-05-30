'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { InputCopy } from '@/components/input-copy';
import { Stack, styled } from 'styled-system/jsx';
import { useShareFile } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-share-file';
import { Skeleton } from '@/components/elements/skeleton';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';

interface ShareFileModalProps {
  fileId: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
}
export const ShareFileModal = ({ fileId, setIsOpen, isOpen }: ShareFileModalProps) => {
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);
  const [shareId, setShareId] = useState('');
  const shareFileMutation = useShareFile(response => {
    setShareId(response.share_id);
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      shareFileMutation.mutate({ workspace_file_id: fileId });
    }
  }, [isOpen, fileId]);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => setIsOpen(e)}>
          <div>
            <Dialog.Title pt={'24px'} px={'35px'} fontSize={'22px'} fontWeight={500}>
              {t('files.list.item.share.title')}
            </Dialog.Title>
            <styled.hr />
            <Stack pb={'35px'} px={'18px'}>
              <Dialog.Description px={'18px'} pb={'25px'} fontSize={'lg'} color={'#868492'}>
                {t('files.list.item.share.description')}
              </Dialog.Description>
              <styled.div paddingX={'18px'}>
                {shareFileMutation.isLoading ? (
                  <Skeleton w={'560px'} height={'58px'} />
                ) : (
                  <InputCopy input={`unstuckstudy.com/share/${shareId}`} />
                )}
              </styled.div>
            </Stack>
          </div>
        </Modal>
      )}
    </>,
    document.body,
  );
};
