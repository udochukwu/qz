import { Box, HStack, VStack } from 'styled-system/jsx';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Table } from '@/components/elements/table';
import { extractFileName } from '../../../../util/extract-file-name';
import { getFileExtension } from '../../../../util/get-file-extension';
import { styled } from 'styled-system/jsx';
import { CRUDFilesPost, GetFilesResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { SwitchCheckedChangeDetails } from '@ark-ui/react';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { FileItemName } from './components/file-item-name';
import { formatTimeAgo } from '@/utils/formatting-utils';
import { css } from 'styled-system/css';
import { useRef } from 'react';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from 'lucide-react';
import { Select } from '@/components/elements/select';
import { languages } from '@/features/chat/components/new-chat-view/components/classes-files-browser/record/languages';
import { ChevronDownIcon } from 'lucide-react';
import { Checkbox } from '@/components/elements/checkbox';

interface Props {
  file: WorkspaceFile;
  crudPayload?: CRUDFilesPost;
  isFileViewToggleEnabled?: boolean;
  isMultiSelectEnabled?: boolean;
  isFilterableByClass?: boolean;
  expandFile: (file: WorkspaceFile) => void;
  expandOn?: 'click' | 'double-click';
  excludeFiles?: CRUDFilesPost;
  variant?: 'reduced' | 'expanded' | 'sidebar';
  showCreatedAt?: boolean;
  showTranscriptOption?: boolean;
  showMoreActionsMenu?: boolean;
  showLanguageSelector?: boolean;
  onLanguageSelectorChange?: (langcode: string) => void;
}

export const FileItemLangSelect = ({
  file,
  crudPayload,
  isMultiSelectEnabled = false,
  expandFile,
  excludeFiles,
  variant = 'expanded',
  expandOn = 'double-click',
  showLanguageSelector = false,
  onLanguageSelectorChange,
}: Props) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const fileName = extractFileName(file.filename);

  const fileExtension = getFileExtension(file.filename);

  const isMultiSelected = file.isSelected;

  const langsForSelect = languages.map(lang => ({
    label: `${lang.language} - ${lang.flag}`,
    value: `${lang.code}`,
  }));

  const onToggleMultiSelect = (details: SwitchCheckedChangeDetails) => {
    queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
      const prevFiles = prev?.files ?? [];
      return {
        files: prevFiles.map(traversedFile => {
          if (traversedFile.workspace_file_id === file.workspace_file_id) {
            return { ...file, isSelected: details.checked };
          }
          return traversedFile;
        }),
      };
    });
  };

  const sidebarRowStyle = css({
    border: 'none',
    backgroundColor: '#f5f5f6',
    height: '60px',
  });
  const leftCellRadius = css({
    borderTopLeftRadius: 'md',
    borderBottomLeftRadius: 'md',
  });

  const timeoutId = useRef<number | null>(null);

  const onClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('.stop-propagation')) {
      e.stopPropagation();
      return;
    }
    if (expandOn === 'click') {
      expandFile(file);
      return;
    }
    if (e.detail === 2) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      expandFile(file);
    } else if (e.detail === 1) {
      timeoutId.current = window.setTimeout(() => {
        onToggleMultiSelect({ checked: !isMultiSelected });
      }, 200);
    }
  };
  return (
    <>
      <Table.Row
        onClick={onClick}
        width={'100%'}
        className={variant === 'sidebar' ? sidebarRowStyle : undefined}
        px={4}
        py={3}
        verticalAlign="middle"
        borderColor="#E3E2E6">
        <Table.Cell
          width={'100%'}
          alignItems="center"
          verticalAlign={'middle'}
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={'row'}
          gap={2}
          className={variant === 'sidebar' ? leftCellRadius : undefined}>
          <HStack textStyle="xs" fontWeight="semibold" alignItems="center">
            {isMultiSelectEnabled && (
              <Box p={4} m={-4}>
                <Checkbox checked={isMultiSelected} borderColor="#D0D5DD" />
              </Box>
            )}
            <FileItemExtension extension={fileExtension} />
            {variant === 'expanded' || variant === 'sidebar' ? (
              <FileItemName fileName={fileName} variant={variant} />
            ) : (
              <VStack alignItems="flex-start" gap="0.5">
                <FileItemName fileName={fileName} variant={variant} />
                <styled.div textStyle="2xs" fontWeight="normal">
                  {formatTimeAgo(file.created_at, t)}
                </styled.div>
              </VStack>
            )}
          </HStack>
          {showLanguageSelector && (
            <div className="stop-propagation" style={{ marginLeft: 'auto' }}>
              <Select.Root
                width="100%"
                positioning={{ sameWidth: true }}
                onValueChange={({ value }) => {
                  onLanguageSelectorChange?.(value[0]);
                }}
                items={langsForSelect}
                autoFocus={false}>
                <Select.Control className={css({ '&:hover': { backgroundColor: '#ebebeb' } })}>
                  <Select.Trigger border="none">
                    <Select.ValueText placeholder={t('common.select.language')} />
                    <ChevronDownIcon size={16} />
                  </Select.Trigger>
                  <Select.Positioner bottom={'100%'} top={'auto'}>
                    <Select.Content maxH="300px" overflowY="auto" scrollbarColor={'rgba(0, 0, 0, 0.2) transparent'}>
                      <Select.ItemGroup id="language">
                        <Select.ItemGroupLabel>{t('common.select.language')}</Select.ItemGroupLabel>
                        {langsForSelect.map((item, index) => (
                          <Select.Item key={index} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Select.Control>
              </Select.Root>
            </div>
          )}
        </Table.Cell>
      </Table.Row>
      {variant === 'sidebar' && <Table.Row h={2} border={0} />}
    </>
  );
};
