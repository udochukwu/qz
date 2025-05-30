'use client';

import { useRenameWorkspace } from '../hooks/use-rename-workspace';
import { useRouter } from 'next13-progressbar';
import { useRenameWorkspaceModalStore } from '../stores/rename-workspace-modal';
import { ConfirmModalEmoji } from './confirm-modal-emoji';
import { getClassNameAndEmoji } from '@/features/class/util/get-class-name';
import { useTranslation } from 'react-i18next';

interface RenameWorkspaceModalProps {
  workspace_id: string;
  class_name: string;
}

export const RenameWorkspaceModal = ({ workspace_id, class_name }: RenameWorkspaceModalProps) => {
  const { t } = useTranslation();

  const { isOpen = false, setIsOpen } = useRenameWorkspaceModalStore();
  const router = useRouter();
  const { mutate: renameWorkspace, isLoading } = useRenameWorkspace();
  const [extractEmoji, extractedTitle] = getClassNameAndEmoji(class_name);
  const onRenameWorkspace = ({ name, emoji }: { name: string; emoji: string }) => {
    const new_class_name = `${emoji} ${name}`;
    renameWorkspace(
      { workspace_id, new_class_name },
      {
        onSuccess: response => {
          setIsOpen(false);
          /*router.push(`classes/${response.workspace_id}`);*/
        },
      },
    );
  };

  return (
    <ConfirmModalEmoji
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoading={isLoading}
      onConfirm={onRenameWorkspace}
      title={t('common.renameWithParameter', { name: t('common.class', { count: 1 }) })}
      confirmButtonText={t('common.rename')}
      initialName={extractedTitle}
      initialEmoji={extractEmoji}
    />
  );
};
