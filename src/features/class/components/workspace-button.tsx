import { css } from 'styled-system/css';
import { useRouter } from 'next13-progressbar';
import { FileTextIcon, ClockIcon, Trash2Icon, MoreVertical, MessageCircleMoreIcon } from 'lucide-react';
import { WorkspaceClass } from '@/types';
import { formatTimeAgo } from '@/utils/formatting-utils';
import { Box, Flex, HStack, Grid, GridItem, styled } from 'styled-system/jsx';
import { Menu } from '@/components/elements/menu';
import { IconButton } from '@/components/elements/icon-button';
import { useDeleteWorkspace } from '../hooks/use-delete-workspace';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useUserStore } from '@/stores/user-store';
import { getClassNameAndIcon } from '../util/get-class-name';
import generatePastelColor from '@/utils/generate-pastel-color';
import { useTranslation } from 'react-i18next';

interface AddToChatProps {
  isSelected?: boolean;
  onClassClick?: (workspaceId: string) => void;
}

export default function WorkspaceButton({
  class_name,
  updated_at,
  workspace_id,
  number_of_files,
  isSelected,
  onClassClick,
}: WorkspaceClass & AddToChatProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const [ExtractIcon, extractTitle] = getClassNameAndIcon(class_name);
  const create_at_text = formatTimeAgo(updated_at, t);
  const { mutate: deleteWorkspacePost, isLoading } = useDeleteWorkspace();
  const isDeleteModalOpen = useBoolean();
  const { mutate: createChat } = useCreateChat();
  const crudPayload: CRUDFilesPost = { workspace_id: workspace_id };
  const deleteWorkspace = () => {
    deleteWorkspacePost(
      { workspace_id: workspace_id },
      {
        onSuccess: () => {
          isDeleteModalOpen.setFalse();
        },
      },
    );
  };
  const NewChatIcon = () => (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.0982 9.4H16.3V1H4.9V4.2M13.1 4.2H1.5V12.6H4.1V14.6L7.7 12.6H13.1V4.2Z"
        stroke="#A3A3A2"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <div className="stop-propagation">
      <ConfirmDeleteModal
        isLoading={isLoading}
        name={class_name}
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        entityType="class"
        onConfirm={deleteWorkspace}
      />
      <styled.div
        border={isSelected ? '2px solid #3E3C46B2' : '2px solid rgba(224, 226, 229, 0.5)'}
        backgroundColor={isSelected ? '#F7F7F7' : '#FFFFFF'}
        height={'120px'}
        className={css({
          display: 'flex',
          flexDir: 'column',
          flex: '1',
          alignItems: 'flex-start',
          py: '4',
          pr: '2',
          pl: '6',
          rounded: '2xl',
          _hover: {
            backgroundColor: 'rgba(26, 12, 108, 0.06)', // New background color on hover
          },
          cursor: 'pointer',
        })}
        onClick={() => {
          if (onClassClick) {
            onClassClick(workspace_id);
          } else {
            router.push(`/classes/${workspace_id}`);
          }
        }}>
        <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <HStack
            className={css({
              fontSize: 'lg',
              lineHeight: 'sm',
              fontWeight: 'semibold',
              color: '#15112b',
              overflow: 'hidden',
              alignItems: 'center',
            })}
            gap={'0.25'}>
            <ExtractIcon
              size={24}
              className={css({
                flexShrink: 0,
                marginRight: '8px',
              })}
              color={generatePastelColor(workspace_id)}
            />
            <styled.span textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} flex={1}>
              {extractTitle}
            </styled.span>
          </HStack>
          <Box onClick={e => e.stopPropagation()}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  px={3}
                  py={3}
                  variant="link"
                  color={'rgba(72, 72, 70, 0.2)'}
                  aria-label={t('common.moreActions')}>
                  <MoreVertical />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.ItemGroup id="group-1">
                    <Menu.Item value="new-chat" id="chat" onClick={() => createChat(crudPayload)}>
                      <HStack>
                        <NewChatIcon />
                        <span>{t('common.newChat')}</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item value="delete" id="delete" onClick={isDeleteModalOpen.setTrue}>
                      <HStack justify="space-between" flex="1">
                        <HStack>
                          <Trash2Icon color={'rgba(163, 163, 162, 1)'} />
                          <span>{t('common.delete')}</span>
                        </HStack>
                      </HStack>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Box>
        </Flex>
        <HStack gap={10} w={'100%'} mt={3.5} fontWeight={400} alignItems={'center'}>
          <HStack gap={1.5} flex={1} overflow="hidden" flexShrink={0}>
            <ClockIcon size={20} />
            <styled.span textWrap={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
              {create_at_text}
            </styled.span>
          </HStack>
          <HStack gap={1.5} flex={1} overflow="hidden" flexShrink={0}>
            <FileTextIcon size={20} />
            <styled.span
              textWrap={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}>{`${number_of_files} ${t('common.resources')}`}</styled.span>
          </HStack>
        </HStack>
      </styled.div>
    </div>
  );
}
