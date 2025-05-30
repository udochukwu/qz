import React from 'react';
import { HStack, styled } from 'styled-system/jsx';
import { TextArea } from '@/components/elements/text-area';
import { IconButton } from '@/components/elements/icon-button';
import MessageRendererV2 from '../message-rendererengine';
import { Avatar } from '@/components/elements/avatar';
import { ResourceChunk } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';

interface UserMessageProps {
  isEditing: boolean;
  handleEdit: () => void;
  isHovering: boolean;
  message_id: string;
  message: string;
  isStreaming?: boolean;
  resource_chunks?: ResourceChunk[];
  isErrored?: boolean;
  editedMessage: string;
  onEditMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  authorName: string;
  userImage: string;
  siblings_node_ids: string[] | undefined;
  current_message_index: number;
  handleSelectNode: (direction: 'next' | 'prev') => void;
  onSave: () => void;
  onCancel: () => void;
  isChatLoading: boolean;
}

const UserMessage = ({
  isEditing,
  handleEdit,
  isHovering,
  message_id,
  message,
  resource_chunks,
  isStreaming,
  isErrored,
  editedMessage,
  onEditMessageChange,
  authorName,
  userImage,
  siblings_node_ids,
  current_message_index,
  handleSelectNode,
  onSave,
  onCancel,
  isChatLoading,
}: UserMessageProps) => {
  const { t } = useTranslation();
  return (
    <styled.div display={'flex'} flexDir={'column'} alignItems={'flex-end'} w="100%" my={'20px'}>
      <styled.div display={'flex'} flexDir={'row'} w={isEditing ? '100%' : 'auto'}>
        {!isEditing && (
          <IconButton
            variant={'ghost'}
            onClick={handleEdit}
            style={{
              cursor: 'pointer',
              visibility: isHovering ? 'visible' : 'hidden',
              marginRight: '10px',
              marginTop: '7px',
            }}>
            <styled.img src="/icons/ic_edit.svg" alt="" height="14px" width="14px" />
          </IconButton>
        )}
        <styled.div
          bg={!isEditing ? '#F1F0F1' : 'transparent'}
          borderRadius={'12px'}
          display={'flex'}
          flexDir={'row'}
          pl={isEditing ? 'auto' : '25px'}
          py={'12px'}
          pr={isEditing ? '24px' : '12px'}
          w={isEditing ? '100%' : 'auto'}>
          {!isEditing ? (
            <styled.div width="auto" mb={'-1rem'} mt={'2px'}>
              <MessageRendererV2
                className="message-renderer"
                message_id={message_id}
                message={message}
                isStreaming={isStreaming}
                isErrored={isErrored}
              />
            </styled.div>
          ) : (
            <styled.div
              width="100%"
              display={'flex'}
              flexGrow={1}
              border="1px solid #e0e0e0"
              borderRadius="12px"
              paddingTop={'5px'}
              paddingBottom={'12px'}
              px="25px"
              alignItems="center"
              backgroundColor="#FFFFFF"
              flexBasis="100%">
              <TextArea
                id={`messageTextArea-${message_id}`}
                value={editedMessage}
                onChange={e => onEditMessageChange(e)}
              />
            </styled.div>
          )}
          <styled.div ml={'10px'} display={'flex'} flexDir={'column'}>
            <Avatar name={authorName} size="xs" src={userImage} />
          </styled.div>
        </styled.div>
      </styled.div>
      {siblings_node_ids && siblings_node_ids.length > 1 && !isEditing && (
        <styled.div flexDirection="row" display="flex" color="gray" alignItems="center" marginLeft="auto" mt={'7px'}>
          <ChevronLeft
            onClick={() => handleSelectNode('prev')}
            color="gray"
            size={16}
            style={{
              cursor: 'pointer',
            }}
          />
          <styled.span color="gray" fontSize="0.7rem" fontWeight="semibold">{`${current_message_index + 1} / ${
            siblings_node_ids.length
          }`}</styled.span>
          <ChevronRight
            onClick={() => handleSelectNode('next')}
            color="gray"
            size={16}
            style={{
              cursor: 'pointer',
            }}
          />
        </styled.div>
      )}
      {isEditing && (
        <HStack alignItems={'center'} w="100%" justifyContent={'flex-end'} pr={'24px'}>
          <Button
            bg="#15112B0D"
            paddingX={'3rem'}
            borderRadius={'12px'}
            onClick={() => {
              onCancel();
            }}>
            <span style={{ color: '#3E3C46' }}>{t('common.cancel')}</span>
          </Button>
          <Button
            paddingX={'3rem'}
            bg="#6D56FA"
            borderRadius={'12px'}
            disabled={isChatLoading}
            onClick={() => {
              onSave();
            }}>
            <span>{t('common.send')}</span>
          </Button>
        </HStack>
      )}
    </styled.div>
  );
};

export default UserMessage;
