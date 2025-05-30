import { useSoftRouteToChat } from '@/features/chat/hooks/use-soft-route-to-chat';
import useChatStore from '@/features/chat/stores/chat-store';
import { UnassignedChatHistoryProps } from '@/types';
import { ChevronDownIcon, ChevronUpIcon, FileIcon, PlusIcon, EyeIcon, FolderSymlink } from 'lucide-react';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { useRouter } from 'next13-progressbar';
import { Box, HStack, Wrap, styled } from 'styled-system/jsx';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { Menu } from '@/components/elements/menu';
import { GTWalsheim } from '@/fonts/GTWalsheim';
import { Skeleton } from '@/components/elements/skeleton';
import { token } from 'styled-system/tokens';
import useGetChatId from '@/features/chat/hooks/use-chatId';
import { Tooltip } from '@/components/elements/tooltip';
import { AddToWorkspaceModal } from '@/features/class/components/add-to-workspace-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from 'react-i18next';
export default function ConversationsHistoryPerWorkspace({
  workspace_id,
  name,
  chats,
  isLoading = false,
}: {
  workspace_id?: string;
  name: string;
  chats: UnassignedChatHistoryProps[];
  isLoading?: boolean;
}) {
  const { t } = useTranslation();

  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const chatId = useGetChatId();
  const { routeToChat } = useSoftRouteToChat();
  const { mutate: createChat } = useCreateChat();
  const isWorkspaceModalOpen = useBoolean(false);
  const [addToChatId, setAddToChatId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box mt={3} rounded={'md'} pb={3.5} bg={'rgba(21, 17, 43, 0.03)'}>
        <HStack justifyContent={'space-between'} px={4} pt={3.5}>
          <Skeleton w="100px" h="20px" />
          <Skeleton w="14px" h="14px" />
        </HStack>
        <Wrap
          marginTop={1}
          display={'block'}
          maxHeight={'calc(4.5 * (14px * 1.5 + 2.5 * 2 * 4px))'}
          overflow={'auto'}
          px={5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Wrap key={index} py={2.5} px={0}>
              <Skeleton w="100%" h="20px" />
            </Wrap>
          ))}
        </Wrap>
      </Box>
    );
  }
  return (
    <>
      <AddToWorkspaceModal
        isOpen={isWorkspaceModalOpen.value}
        setIsOpen={isWorkspaceModalOpen.setValue}
        chatId={addToChatId}
      />
      <Box mt={3} rounded={'md'} pb={3.5} bg={'rgba(21, 17, 43, 0.03)'}>
        <HStack justifyContent={'space-between'} px={4} pt={3.5}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box
                fontSize={'14px'}
                fontWeight={'semibold'}
                color={'#6E6B7B'}
                display="flex"
                flex="1"
                overflow="hidden"
                textOverflow="ellipsis"
                justifyContent="flex-start"
                _hover={{
                  cursor: 'pointer',
                }}>
                <span>{name}</span>
              </Box>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.ItemGroup id="group-1">
                  <Menu.Item
                    id="option1"
                    value="new-chat"
                    onClick={() => (workspace_id ? createChat({ workspace_id }) : router.push('/'))}>
                    <PlusIcon color="#202020" style={{ marginRight: 4 }} />
                    <span>&nbsp;{t('common.newChat')}</span>
                  </Menu.Item>
                  {workspace_id && (
                    <Menu.Item id="option2" value="view-class" onClick={() => router.push(`/classes/${workspace_id}`)}>
                      <EyeIcon color="#202020" style={{ marginRight: 4 }} />
                      <span>&nbsp;{t('common.viewClass')}</span>
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
          <styled.button _hover={{ cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ChevronDownIcon size={14} color="rgb(21, 17, 43,0.6)" />
            ) : (
              <ChevronUpIcon size={14} color="rgb(21, 17, 43,0.6)" />
            )}
          </styled.button>
        </HStack>
        {isExpanded && (
          <Wrap
            marginTop={1}
            display={'block'}
            maxHeight={'calc(4.5 * (14px * 1.5 + 2.5 * 2 * 4px))'}
            overflow={'auto'}
            scrollbarColor="rgba(0, 0, 0, 0.1) transparent"
            _scrollbar={{
              width: '3px',
              height: '3px',
            }}>
            {chats.map(chat => (
              <Wrap
                key={chat.chat_id}
                fontSize={'14px'}
                fontWeight={'400'}
                onClick={() => {
                  routeToChat(chat.chat_id, 'conversations-history-per-workspace');
                }}
                _hover={{
                  bg: '#F1F1F0',
                  cursor: 'pointer',
                }}
                px={0}>
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    width: '100%',
                    px: 4,
                    py: 1.5,
                    //left border violet.500
                    borderLeft: chat.chat_id === chatId ? '3px solid' : 'none',
                    borderLeftColor: 'colorPalette.default',
                  })}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}>
                    <FileIcon
                      size={'19px'}
                      color={chat.chat_id === chatId ? token('colors.colorPalette.default') : '#73726F'}
                      style={{ marginRight: 5, flexShrink: 0, paddingLeft: '2px' }}
                    />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color:
                          chat.chat_id === chatId
                            ? token('colors.colorPalette.default')
                            : token('colors.quizard.black'),
                      }}>
                      {chat.description || t('common.newChat')}
                    </span>
                  </div>
                  {!workspace_id && (
                    <Tooltip.Root positioning={{ placement: 'top' }}>
                      <Tooltip.Trigger asChild>
                        <Wrap
                          px={0.5}
                          py={0.5}
                          onClick={e => {
                            e.stopPropagation();
                            setAddToChatId(chat.chat_id);
                            isWorkspaceModalOpen.setTrue();
                          }}>
                          <FolderSymlink size={16} color={'#15112B66'} />
                        </Wrap>
                      </Tooltip.Trigger>
                      <Tooltip.Positioner>
                        <Tooltip.Arrow>
                          <Tooltip.ArrowTip />
                        </Tooltip.Arrow>
                        <Tooltip.Content bgColor={'white'} color={'black'} fontWeight={'medium'} fontSize={'sm'}>
                          {t('common.connectClass')}
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Tooltip.Root>
                  )}
                </div>
              </Wrap>
            ))}
          </Wrap>
        )}
      </Box>
    </>
  );
}
