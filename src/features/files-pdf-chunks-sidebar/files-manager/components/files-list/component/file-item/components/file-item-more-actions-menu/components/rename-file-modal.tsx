import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import { Input } from '@/components/elements/input';
import { useFileRename } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-file-rename';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { VStack, styled } from 'styled-system/jsx';
import { useNameForm } from '@/hooks/use-name-form';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen?: boolean;
  fileId: string;
  crudPayload?: CRUDFilesPost;
  fileName: string;
  fileExt: string;
  setIsOpen: (val: boolean) => void;
  excludeFiles?: CRUDFilesPost;
}

export const RenameFileModal = ({
  isOpen = false,
  setIsOpen,
  crudPayload,
  fileId,
  fileName,
  fileExt,
  excludeFiles,
}: Props) => {
  const { t } = useTranslation();

  const renameFile = useFileRename({ crudPayload, excludeFiles });

  const { control, handleSubmit } = useNameForm(fileName);

  const onRenameFile = async ({ name }: { name: string }) => {
    await renameFile({ workspace_file_id: fileId, new_filename: `${name}.${fileExt}` });
    setIsOpen(false);
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onConfirm={handleSubmit(onRenameFile)}
      title={t('common.renameWithParameter', { name: fileName })}
      confirmButtonText={t('common.rename')}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value: name }, fieldState }) => (
          <VStack alignItems="flex-start" w="100%">
            <Input value={name} onChange={e => onChange(e.currentTarget.value)} />
            {fieldState.error && (
              <styled.p textStyle="xs" color="red">
                {fieldState.error?.message}
              </styled.p>
            )}
          </VStack>
        )}
      />
    </ConfirmModal>
  );
};
