import { Search } from '@/components/search';
import React from 'react';
import { HStack, VStack } from 'styled-system/jsx';
import { FilterByType } from './filter-by-type';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { IconButton } from '@/components/elements/icon-button';
import { Trash2Icon } from 'lucide-react';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { useTranslation } from 'react-i18next';

interface Props {
  files: WorkspaceFile[];
  search: string;
  setSearch: (search: string) => void;
  extensionList: string[];
  classList: string[];
  crudPayload?: CRUDFilesPost;
  onFilterByFileTypeChange: (types: string[]) => void;
  onFilterByClassTypeChange: (types: string[]) => void;
  isFilterablebyFileType?: boolean;
  isFilterableByClass?: boolean;
  isMultiSelectEnabled?: boolean;
  excludeFiles?: CRUDFilesPost;
  variant?: 'default' | 'sidebar';
}

export const FileListHeader = ({
  crudPayload,
  files,
  search,
  setSearch,
  extensionList,
  onFilterByClassTypeChange,
  classList,
  onFilterByFileTypeChange,
  isFilterableByClass = false,
  isFilterablebyFileType = false,
  isMultiSelectEnabled = false,
  excludeFiles,
  variant = 'default',
}: Props) => {
  const { t } = useTranslation();

  const isMultiDeleteModalOpen = useBoolean();

  const selectedFiles = files.filter(file => file.isSelected);

  const isMultiDeleteEnabled = isMultiSelectEnabled && selectedFiles.length > 0;

  const {
    deleteAllFilesMutation: { mutateAsync: deleteAllFiles },
  } = useFileDelete({ crudPayload, excludeFiles });

  const onDeleteMultipleFiles = async () => {
    const deletedFiles = [...selectedFiles];
    await deleteAllFiles(deletedFiles);
    isMultiDeleteModalOpen.setFalse();
  };

  return (
    <>
      <ConfirmModal
        setIsOpen={isMultiDeleteModalOpen.setValue}
        isOpen={isMultiDeleteModalOpen.value}
        title={t('files.list.header.confirm.title', { count: selectedFiles.length })}
        onConfirm={onDeleteMultipleFiles}
        confirmButtonText={t('common.delete')}
      />
      <VStack
        w="100%"
        gap={4}
        px={variant === 'default' ? '43px' : 0}
        borderTopRadius={12}
        bgColor={'#FFFFFF'}
        py={3}
        border={variant === 'default' ? '1.1px solid rgba(21, 17, 43, 0.1)' : '0'}
        borderBottom={0}>
        {variant === 'default' && (
          <HStack w="100%" fontSize={'lg'} fontWeight={500} justify="space-between">
            {t('common.files')}
          </HStack>
        )}
        <HStack justify="flex-end" w="100%">
          {files.length > 0 && (
            <Search
              search={search}
              onSearchChange={setSearch}
              top={0}
              position="sticky"
              borderRadius={'12px'}
              py={'4'}
              fontSize={'16px'}
              fontWeight={400}
            />
          )}
          {isFilterableByClass && files.length > 0 && (
            <FilterByType
              placeholderValue={t('common.class', { count: 1 })}
              types={classList}
              onFilterChange={onFilterByClassTypeChange}
            />
          )}
          {isFilterablebyFileType && files.length > 0 && (
            <FilterByType
              placeholderValue={t('common.type')}
              types={extensionList}
              onFilterChange={onFilterByFileTypeChange}
            />
          )}
          {isMultiDeleteEnabled && (
            <IconButton onClick={isMultiDeleteModalOpen.setTrue} variant="ghost">
              <Trash2Icon />
            </IconButton>
          )}
        </HStack>
      </VStack>
    </>
  );
};
