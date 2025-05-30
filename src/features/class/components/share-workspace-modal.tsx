'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { InputCopy } from '@/components/input-copy';
import { Stack, styled } from 'styled-system/jsx';
import { useShareWorkspace } from '../hooks/use-share-workspace';
import { Skeleton } from '@/components/elements/skeleton';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';

interface ShareWorkspaceModalProps {
  workspace_id: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
}
export const ShareWorkspaceModal = ({ workspace_id, setIsOpen, isOpen }: ShareWorkspaceModalProps) => {
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);
  const [shareId, setShareId] = useState('');
  const shareWorkspaceMutation = useShareWorkspace(response => {
    setShareId(response.share_id);
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      shareWorkspaceMutation.mutate({ workspace_id });
    }
  }, [isOpen, workspace_id]);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => setIsOpen(e)}>
          <div>
            <Dialog.Title pt={'24px'} px={10} fontSize={'22px'} fontWeight={500}>
              {t('class.workspace.header.share.title')}
            </Dialog.Title>
            <styled.hr />
            <Stack pb={'35px'} px={6}>
              <Dialog.Description px={'19px'} pb={'25px'} fontSize={'lg'} color={'#868492'}>
                <styled.p>
                  <span>{t('class.workspace.header.share.description')}&nbsp;</span>
                  <span style={{ textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}>
                    {t('common.learnMore')}
                  </span>
                </styled.p>
              </Dialog.Description>
              <styled.div paddingX={'19px'}>
                {shareWorkspaceMutation.isLoading ? (
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
