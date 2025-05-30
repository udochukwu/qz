'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { InputCopy } from '@/components/input-copy';
import { styled, Stack } from 'styled-system/jsx';
import { Skeleton } from '@/components/elements/skeleton';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';
import { useShareFlashcard } from '../hooks/use-share-flashcard';

interface ShareFlashcardModalProps {
  flashcard_set_id: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
}
export const ShareFlashcardModal = ({ flashcard_set_id, setIsOpen, isOpen }: ShareFlashcardModalProps) => {
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);
  const [shareId, setShareId] = useState('');

  const shareFlashcardMutation = useShareFlashcard();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShareId('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      shareFlashcardMutation.mutate(
        { flashcard_set_id: flashcard_set_id },
        {
          onSuccess(data) {
            setShareId(data.share_id);
          },
        },
      );
    }
  }, [isOpen, flashcard_set_id]);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => setIsOpen(e)}>
          <div>
            <Dialog.Title pt={'24px'} px={'35px'} fontSize={'22px'} fontWeight={500}>
              {t('flashcards.shareFlashcardSet.title')}
            </Dialog.Title>
            <styled.hr />
            <Stack gap={4} pb={'35px'} px={'18px'}>
              <Dialog.Description px={'19px'} pb={'25px'} fontSize={'lg'} color={'#868492'}>
                <styled.p>
                  <span>{t('flashcards.shareFlashcardSet.description')}&nbsp;</span>
                </styled.p>
              </Dialog.Description>

              <styled.div paddingX="18px">
                {shareFlashcardMutation.isLoading ? (
                  <Skeleton w={'560px'} height={'58px'} paddingX={'18x'} />
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
