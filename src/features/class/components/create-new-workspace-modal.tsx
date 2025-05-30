'use client';

import { useCreateWorkspace } from '../hooks/use-create-workspace';
import { useRouter } from 'next13-progressbar';

import { ConfirmModalEmoji } from './confirm-modal-emoji';
import { useTranslation } from 'react-i18next';

interface Props {
  selectOnCreate?: (workspaceId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateNewWorkspaceModal = ({ selectOnCreate, isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();

  const router = useRouter();
  const { mutate: createWorkspace, isLoading } = useCreateWorkspace();
  const onCreateWorkspace = ({ name, emoji }: { name: string; emoji: string }) => {
    const class_name = `${emoji} ${name}`;
    createWorkspace(
      { class_name: class_name, class_files: [] },
      {
        onSuccess: response => {
          setIsOpen(false);
          if (selectOnCreate) {
            selectOnCreate(response.workspace_id);
          } else {
            router.push(`/classes/${response.workspace_id}`);
          }
        },
      },
    );
  };

  return (
    <ConfirmModalEmoji
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoading={isLoading}
      onConfirm={onCreateWorkspace}
      title={t('class.workspace.createNewClass')}
      confirmButtonText={t('common.create')}
    />
  );
};
