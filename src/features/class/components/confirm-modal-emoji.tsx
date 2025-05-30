// confirm-modal-emoji.tsx
import React, { useState, useEffect } from 'react';
import { SelectClassEmoji } from './select-class-emoji';
import { Stack, VStack, styled } from 'styled-system/jsx';
import { Input } from '@/components/elements/input';
import { Controller, FieldValues } from 'react-hook-form';
import { DEFAULT_CLASS_EMOJI } from '@/features/chat/consts/class-name';
import { ConfirmModalProps } from '@/components/confirm-modal/confirm-modal-type';
import { useNameForm } from '@/hooks/use-name-form';
import OnboardingInfoModal from '@/components/onboarding-modal';
import { ClipboardIcon } from 'lucide-react';
import { emojis } from '@/lib/class-emojis';
import { Button } from '@/components/elements/button';
import { SpinningIcon } from '@/components/spinning-icon';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Dialog } from '@/components/elements/dialog';
import { css } from 'styled-system/css';
import { useTourStore } from '@/features/onboarding/stores/tour-store';

interface ConfirmModalEmojiProps extends Omit<ConfirmModalProps, 'onConfirm' | 'children'> {
  initialName?: string;
  initialEmoji?: string;
  onConfirm: (data: { name: string; emoji: string }) => void;
  onChange?: (value: string) => void;
}

export const ConfirmModalEmoji: React.FC<ConfirmModalEmojiProps> = ({
  isOpen,
  setIsOpen,
  isLoading,
  onConfirm,
  title,
  confirmButtonText,
  initialName = '',
  initialEmoji = DEFAULT_CLASS_EMOJI,
  onChange,
}) => {
  const { t } = useTranslation();
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialEmoji);
  const { control, handleSubmit, reset } = useNameForm();
  const { stepIndex } = useTourStore();
  const isTourActive = stepIndex === 1;
  useEffect(() => {
    if (isOpen) {
      setSelectedEmoji(initialEmoji);
      reset({ name: initialName });
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialEmoji, initialName, reset]);

  const onSubmit = (data: FieldValues) => {
    onConfirm({ name: data.name as string, emoji: selectedEmoji });
  };

  if (!isOpen) return null;

  // During product tour, render without Dialog wrapper to avoid overlay issues
  if (isTourActive) {
    return (
      <styled.div
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={999} // less than Joyride's z-index
        bg="white"
        borderRadius="22px"
        w="500px"
        maxW="90%"
        overflowY="auto">
        <styled.div padding={'35px'}>
          <styled.p fontSize={'2xl'} fontWeight={500} marginTop={'0px'} marginBottom={'0px'}>
            {title}
          </styled.p>
          <styled.p fontSize={'lg'} color={'#15112B80'} marginTop={'15px'}>
            {t('class.workspace.onboarding.titlePrimary')}
          </styled.p>
          <OnboardingInfoModal
            title={t('class.workspace.aboutClasses')}
            guideId="show_about_classes"
            mt={0}
            mb={'18px'}>
            <ClipboardIcon style={{ marginTop: 2, minWidth: '20px' }} color="#15112B80" />
            <styled.div fontSize={14} color="#15112B99">
              <styled.p>{t('class.workspace.onboarding.title')}</styled.p>
              <styled.p>{t('class.workspace.onboarding.description')}</styled.p>
            </styled.div>
          </OnboardingInfoModal>
          <Stack direction={'row'} gap={14} marginBottom={'10px'}>
            <styled.p fontSize={'sm'} color={'#15112B80'} marginBottom={'0px'}>
              {t('common.tag')}
            </styled.p>
            <styled.p fontSize={'sm'} color={'#15112B80'} marginBottom={'0px'}>
              {t('common.name')}
            </styled.p>
          </Stack>
          <Stack direction={'row'} gap={1}>
            <SelectClassEmoji onEmojiSelect={setSelectedEmoji} items={emojis} selectedEmoji={selectedEmoji} />
            <Controller
              control={control}
              name="name"
              rules={{ required: t('rules.required.name') }}
              render={({ field: { onChange: fieldOnChange, value }, fieldState }) => (
                <VStack alignItems="flex-start" w="100%">
                  <Input
                    value={value}
                    className="class-name-input"
                    onChange={e => {
                      fieldOnChange(e.currentTarget.value);
                      onChange?.(e.currentTarget.value);
                    }}
                    borderColor={'#CACACA'}
                    height={'56px'}
                    placeholder="Chemistry 102"
                    borderRadius={'10px'}
                  />
                  {fieldState.error && (
                    <styled.p textStyle="xs" color="red">
                      {fieldState.error?.message}
                    </styled.p>
                  )}
                </VStack>
              )}
            />
          </Stack>
          <Button
            width="full"
            marginTop={'35px'}
            fontSize={'md'}
            height={'53px'}
            background={'#6D56FA'}
            borderRadius={'8px'}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {!isLoading ? confirmButtonText : <SpinningIcon />}
          </Button>
        </styled.div>
      </styled.div>
    );
  }

  // Normal modal rendering with Dialog for non-tour cases
  return createPortal(
    <Dialog.Root open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
      <Dialog.Backdrop
        className={css({
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
        })}
      />
      <Dialog.Positioner>
        <Dialog.Content onClick={e => e.stopPropagation()} borderRadius="22px" w="500px" maxW="90%" overflowY="auto">
          <styled.div padding={'35px'}>
            <styled.p fontSize={'2xl'} fontWeight={500} marginTop={'0px'} marginBottom={'0px'}>
              {title}
            </styled.p>
            <styled.p fontSize={'lg'} color={'#15112B80'} marginTop={'15px'}>
              {t('class.workspace.onboarding.titlePrimary')}
            </styled.p>
            <OnboardingInfoModal
              title={t('class.workspace.aboutClasses')}
              guideId="show_about_classes"
              mt={0}
              mb={'18px'}>
              <ClipboardIcon style={{ marginTop: 2, minWidth: '20px' }} color="#15112B80" />
              <styled.div fontSize={14} color="#15112B99">
                <styled.p>{t('class.workspace.onboarding.title')}</styled.p>
                <styled.p>{t('class.workspace.onboarding.description')}</styled.p>
              </styled.div>
            </OnboardingInfoModal>
            <Stack direction={'row'} gap={14} marginBottom={'10px'}>
              <styled.p fontSize={'sm'} color={'#15112B80'} marginBottom={'0px'}>
                {t('common.tag')}
              </styled.p>
              <styled.p fontSize={'sm'} color={'#15112B80'} marginBottom={'0px'}>
                {t('common.name')}
              </styled.p>
            </Stack>
            <Stack direction={'row'} gap={1}>
              <SelectClassEmoji onEmojiSelect={setSelectedEmoji} items={emojis} selectedEmoji={selectedEmoji} />
              <Controller
                control={control}
                name="name"
                rules={{ required: t('rules.required.name') }}
                render={({ field: { onChange: fieldOnChange, value }, fieldState }) => (
                  <VStack alignItems="flex-start" w="100%">
                    <Input
                      value={value}
                      className="class-name-input"
                      onChange={e => {
                        fieldOnChange(e.currentTarget.value);
                        onChange?.(e.currentTarget.value);
                      }}
                      borderColor={'#CACACA'}
                      height={'56px'}
                      placeholder="Chemistry 102"
                      borderRadius={'10px'}
                    />
                    {fieldState.error && (
                      <styled.p textStyle="xs" color="red">
                        {fieldState.error?.message}
                      </styled.p>
                    )}
                  </VStack>
                )}
              />
            </Stack>
            <Button
              width="full"
              marginTop={'35px'}
              fontSize={'md'}
              height={'53px'}
              background={'#6D56FA'}
              borderRadius={'8px'}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}>
              {!isLoading ? confirmButtonText : <SpinningIcon />}
            </Button>
          </styled.div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>,
    document.body,
  );
};
