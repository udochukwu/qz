import { Drawer } from '@/components/elements/drawer';
import { Table } from '@/components/elements/table';
import { FileItem } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/file-item/file-item';
import { FileListHeader } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/file-list-header';
import {
  allClassTypeFilter,
  allFileTypeFilter,
} from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/file-list-consts';
import { filterFiles } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/files-list';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { Button } from './elements/button';
import { MessageCircleMore } from 'lucide-react';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  files: WorkspaceFile[];
  onSelectFile: (file: WorkspaceFile) => void;
  showTranscriptOption: boolean;
}

export const FilesDrawer = ({ open, onOpenChange, files, onSelectFile, showTranscriptOption }: Props) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState<string>('');
  const filteredFiles = filterFiles(search, files, { fileType: allFileTypeFilter, class: allClassTypeFilter });
  const { mutate: createChat } = useCreateChat();

  const onStartChat = () => {
    const selectedFiles = filteredFiles.filter(file => file.isSelected);
    createChat({ workspace_file_ids: selectedFiles.map(file => file.workspace_file_id) });
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Positioner width={{ md: 'md' }}>
        <Drawer.Content>
          <FileListHeader
            files={files}
            extensionList={[]}
            search={search}
            setSearch={setSearch}
            classList={[]}
            isMultiSelectEnabled={true}
            onFilterByClassTypeChange={() => {}}
            onFilterByFileTypeChange={() => {}}
          />
          <styled.div overflowY={'auto'} height={'100%'}>
            <Table.Root>
              <Table.Body h="100%">
                {filteredFiles.map(file => (
                  <FileItem
                    isMultiSelectEnabled
                    file={file}
                    key={file.workspace_file_id}
                    variant="reduced"
                    expandFile={() => onSelectFile(file)}
                    expandOn="double-click"
                    showTranscriptOption={showTranscriptOption}
                  />
                ))}
              </Table.Body>
            </Table.Root>
          </styled.div>
          <styled.div display="flex" justifyContent="center" pos="absolute" bottom="20px" w="100%" borderTop="0">
            <Button bg="#15112B" onClick={onStartChat}>
              <MessageCircleMore />
              <span>&nbsp;{t('common.startChat')}</span>
            </Button>
          </styled.div>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
