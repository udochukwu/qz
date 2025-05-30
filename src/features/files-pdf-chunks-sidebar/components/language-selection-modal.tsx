'use client';
import React from 'react';
import { useLanguageSelectionModalStore } from '../stores/language-selection-modal-store';
import { Dialog } from '@/components/elements/dialog';
import { Portal } from '@ark-ui/react/portal';
import { FileItemLangSelect } from '../files-manager/components/files-list/component/file-item/file-item-lang-select';
import { NoFiles } from '../files-manager/components/no-files';
import { Box, Flex, VStack } from 'styled-system/jsx';
import { Table } from '@/components/elements/table';
import { FileToUploadPost } from '../types/api-types';
import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';

export function LanguageSelectionModal() {
  const { t } = useTranslation();
  const { isOpen, files, onConfirm, setIsOpen, setFiles, resetState } = useLanguageSelectionModalStore();

  const handleChangeLangcode = (langcode: string, filename: string) => {
    const file = files.find(f => f.file.name === filename);
    if (!file) return;

    setFiles(files.map(f => (f.file.name === file.file.name ? { file: f.file, langcode: langcode } : f)));
  };

  const handleConfirm = () => {
    const filesWithLangcode = files.map(file => {
      if (isAudioOrVideoFile(file)) {
        return { file: file.file, langcode: file.langcode || 'en' };
      }
      return { file: file.file };
    });
    onConfirm(filesWithLangcode);
    resetState();
  };

  const handleCancel = () => {
    resetState();
  };

  const isAudioOrVideoFile = (file: FileToUploadPost) => {
    return file.file.type.startsWith('video') || file.file.type.startsWith('audio');
  };

  return (
    <>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={handleCancel} lazyMount trapFocus={false}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={'30px'}>
                <VStack gap={6} width="100%">
                  <Box textStyle="xl" fontWeight="bold" width="100%" textAlign="center" mb={2}>
                    Select Language
                  </Box>
                  <VStack width={'100%'} alignItems={'center'} maxH={'45vh'} overflowY={'auto'}>
                    <Table.Root>
                      <Table.Body>
                        {files && files.length > 0 ? (
                          files.map(file => (
                            <FileItemLangSelect
                              expandFile={() => {}}
                              file={{
                                ...file,
                                filename: file.file.name,
                                created_at: new Date().getTime(),
                                workspace_file_id: '',
                                last_modified: new Date().getTime(),
                                url: '',
                              }}
                              key={file.file.name}
                              isMultiSelectEnabled={false}
                              variant="sidebar"
                              showMoreActionsMenu={false}
                              showLanguageSelector={isAudioOrVideoFile(file)}
                              onLanguageSelectorChange={langcode => handleChangeLangcode(langcode, file.file.name)}
                            />
                          ))
                        ) : (
                          <Table.Row height={'100%'} _hover={{ backgroundColor: 'transparent' }}>
                            <Table.Cell height={'100%'}>
                              <NoFiles isSearch={true} />
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table.Root>
                  </VStack>
                  <Flex width="100%" justifyContent="space-between" mt={4}>
                    <Button color="colorPalette.9" bg={'colorPalette.4'} borderWidth={0} onClick={handleCancel}>
                      {t('common.cancel')}
                    </Button>
                    <Button variant="solid" colorScheme="blue" onClick={handleConfirm}>
                      {t('common.upload')}
                    </Button>
                  </Flex>
                </VStack>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </>
  );
}
