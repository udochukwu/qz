import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAddChatToWorkspace } from '../hooks/use-add-chat-to-workspace';
import { useAddFile } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-add-file';
import { Dialog } from '@/components/elements/dialog';
import { WorkspaceList } from './workspace-list';
import { Flex, HStack, styled } from 'styled-system/jsx';
import { LinkIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/elements/button';
import { circle } from 'styled-system/patterns';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chatId?: string | null;
  file?: WorkspaceFile;
}

export const AddToWorkspaceModal = ({ isOpen, setIsOpen, chatId, file }: Props) => {
  const { t } = useTranslation();

  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { mutate: addChatToWorkspace, isLoading: isChatLoading } = useAddChatToWorkspace(response => {
    setIsOpen(false);
  });

  const { addAllFiles, isLoading: isFileLoading } = useAddFile();

  const handleDoneClick = () => {
    if (selectedWorkspace) {
      if (file) {
        addAllFiles({ files: [file], crudPayload: { workspace_id: selectedWorkspace } });
      } else if (chatId) {
        addChatToWorkspace({ chat_id: chatId, workspace_id: selectedWorkspace });
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }
  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
          <Dialog.Backdrop
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(0px)',
              position: 'fixed',
              inset: 0,
              zIndex: 50,
            }}
          />
          <Dialog.Positioner>
            <Dialog.Content
              w={{ base: '100%', md: '60%' }}
              p={'35px'}
              display={'flex'}
              flexDir={'column'}
              gap={8}
              borderRadius={'22px'}>
              <Dialog.Title asChild>
                <Flex justifyContent={'space-between'}>
                  <HStack color={'#3E3C46'}>
                    <LinkIcon />
                    <span style={{ fontWeight: '500', fontSize: '22px' }}>
                      {t('files.list.item.addToWorkspace.select')}
                    </span>
                  </HStack>
                  <Dialog.CloseTrigger asChild>
                    <styled.div
                      className={circle({ size: 8 })}
                      border={'1px solid #DCDCDC'}
                      _hover={{ backgroundColor: '#F7F7F7', cursor: 'pointer' }}>
                      <XIcon color="#15112B99" size={18} />
                    </styled.div>
                  </Dialog.CloseTrigger>
                </Flex>
              </Dialog.Title>
              <Flex h={'260px'} overflowY={'auto'}>
                <WorkspaceList onClassClick={setSelectedWorkspace} selectedWorkspaceId={selectedWorkspace} />
              </Flex>
              <Button
                size={'lg'}
                width={'full'}
                loading={isChatLoading || isFileLoading}
                disabled={selectedWorkspace == null}
                onClick={handleDoneClick}>
                {t('common.done')}
              </Button>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </>,
    document.body,
  );
};
