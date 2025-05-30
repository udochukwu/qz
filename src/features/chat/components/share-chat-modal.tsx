'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { RadioGroup } from '@/components/elements/radio-group';
import { InputCopy } from '@/components/input-copy';
import { styled, Stack } from 'styled-system/jsx';
import { useShareChat } from '@/features/chat/hooks/use-share-chat';
import { Skeleton } from '@/components/elements/skeleton';
import { Modal } from '@/components/modal/modal';
import { useTranslation } from 'react-i18next';

interface ShareChatModalProps {
  chat_id: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
}
export const ShareChatModal = ({ chat_id, setIsOpen, isOpen }: ShareChatModalProps) => {
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);
  const [includeMessages, setIncludeMessages] = useState(false);
  const [shareId, setShareId] = useState('');

  const shareChatMutation = useShareChat(response => {
    setShareId(response.share_id);
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    setIncludeMessages(false);
    if (isOpen) {
      setShareId('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      shareChatMutation.mutate({ chat_id, include_messages: includeMessages });
    }
  }, [isOpen, includeMessages]);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={e => setIsOpen(e)}>
          <div>
            <Dialog.Title pt={'24px'} px={'35px'} fontSize={'22px'} fontWeight={500}>
              {t('chat.share.title')}
            </Dialog.Title>
            <styled.hr />
            <Stack gap={4} pb={'35px'} px={'18px'}>
              <Dialog.Description w={'100%'} px={'18px'} fontSize={'lg'} color={'#868492'}>
                <span>{t('chat.share.description.instructions')}&nbsp;</span>
              </Dialog.Description>
              <RadioGroup.Root
                mb={'16px'}
                mt={'2px'}
                px={'18px'}
                w={'100%'}
                size={'sm'}
                gap={3}
                defaultValue={'false'}
                onValueChange={e => setIncludeMessages(e.value == 'true')}>
                <RadioGroup.Item key={0} value={'false'}>
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText fontSize={'lg'}>{t('chat.share.copy.without')}</RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                </RadioGroup.Item>
                <RadioGroup.Item key={1} value={'true'}>
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText fontSize={'lg'}>{t('chat.share.copy.with')}</RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                </RadioGroup.Item>
              </RadioGroup.Root>
              <styled.div paddingX="18px">
                {shareChatMutation.isLoading ? (
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
