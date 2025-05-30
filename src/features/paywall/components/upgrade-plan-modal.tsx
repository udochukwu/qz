'use client';
import { Dialog } from '@/components/elements/dialog';
import { useUpgradePlanModalStore } from '../stores/upgrade-plan-modal';
import { UpgradePlanContent } from './upgrade-plan-content';
import { Portal } from '@ark-ui/react/portal';
export const UpgradePlanModal = () => {
  const { isOpen, setIsOpen, referrer, closeCallback } = useUpgradePlanModalStore();

  const handleOnChange = (e: { open: boolean }) => {
    setIsOpen(e.open);
    if (!e.open) {
      closeCallback?.();
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={handleOnChange} lazyMount>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={'30px'}>
                <UpgradePlanContent referrer={referrer} />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </>
  );
};
