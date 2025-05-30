import { Tooltip } from '@/components/elements/tooltip';
import { useSoftRouteToChat } from '@/features/chat/hooks/use-soft-route-to-chat';
import generatePastelColor from '@/utils/generate-pastel-color';
import { ClipboardPlusIcon, MessageCircleMoreIcon } from 'lucide-react';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { Box, Flex, HStack, styled } from 'styled-system/jsx';
import { token } from 'styled-system/tokens';
import { useTranslation } from 'react-i18next';

interface Props {
  description: string;
  chat_id: string;
  active: boolean;
  workspace_id: string | null;
  OnAddChatToWorkspace?: (chatId: string) => void;
}

export function ConversationItem({ description, chat_id, active, workspace_id, OnAddChatToWorkspace }: Props) {
  const { t } = useTranslation();
  const { routeToChat } = useSoftRouteToChat();
  const activeColor = workspace_id ? generatePastelColor(workspace_id) : '#6D56FA';
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverBgColor = workspace_id ? `${activeColor.replace('rgb', 'rgba').replace(')', ', 0.1)')}` : '#6D56FA1F';
  const hoverColor = workspace_id ? `${activeColor}` : '#6D56FA';

  return (
    <HStack
      onClick={() => routeToChat(chat_id, 'conversations-history-per-workspace')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        borderRadius: '6px',
        backgroundColor: isHovered && !isIconHovered ? hoverBgColor : '#F8F8F9',
        color: isHovered && !isIconHovered ? hoverColor : '#868492',
        cursor: 'pointer',
        border: '1px solid rgba(95, 95, 95, 0.06)',
        borderLeftColor: active ? activeColor : 'rgba(95, 95, 95, 0.06)',
        borderLeftWidth: active ? '3px' : '1px',
        transition:
          'border-left-width 0.2s ease-in-out, border-left-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
        padding: '8px',
      }}>
      <Flex alignItems="center" gap="2" minW="0" flex="1">
        <Box flexShrink="0">
          <MessageCircleMoreIcon size={14} />
        </Box>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            fontSize: '14px',
            fontWeight: 500,
            color: isHovered && workspace_id ? hoverColor : '#3E3C46',
          }}>
          {description}
        </span>
      </Flex>

      {OnAddChatToWorkspace && (
        <Box
          flexShrink="0"
          color="#868492"
          _hover={{ color: '#6D56FA', backgroundColor: '#6D56FA26' }}
          padding="5px"
          borderRadius="4px"
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}>
          <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 5 } }}>
            <Tooltip.Trigger asChild>
              <ClipboardPlusIcon size={14} onClick={() => OnAddChatToWorkspace(chat_id)} />
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content
                bgColor={'white'}
                borderRadius={'sm'}
                color={'#484846'}
                fontSize={'sm'}
                fontWeight={600}
                px={4}
                py={2}
                boxShadow={'0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)'}>
                <Tooltip.Arrow
                  className={css({
                    '--arrow-size': '8px',
                    '--arrow-background': 'white',
                  })}>
                  <Tooltip.ArrowTip />
                </Tooltip.Arrow>
                <styled.span>{t('common.addClass')}</styled.span>
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </Box>
      )}

      {workspace_id && (
        <styled.div
          flexShrink="0"
          width={'4px'}
          height={'12px'}
          borderRadius={'12px'}
          style={{ backgroundColor: activeColor }}
        />
      )}
    </HStack>
  );
}
