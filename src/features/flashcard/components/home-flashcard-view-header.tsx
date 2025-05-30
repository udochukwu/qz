import React, { useRef } from 'react';
import { UpgradePlanButton } from '@/features/paywall/components/upgrade-plan-button';
import { PenLineIcon, CheckIcon, XIcon } from 'lucide-react';
import { Box, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { Editable } from '@/components/elements/editable';
import { Skeleton } from '@/components/elements/skeleton';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { ShevronRightIcon } from './shevron-right-icon';
import { FileIcon } from './file-icon';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { TooltipWrappper } from '@/components/tooltip-wrapper';
import { ThrashIcon } from './thrash-icon';
import { Tooltip } from '@/components/elements/tooltip';

import { ShareIcon } from '@/components/icons/share-icon';
import { Select } from '@/components/elements/select';

interface ChatHeaderProps {
  classTitleParams?: string;
  setClassTitleParams?: React.Dispatch<React.SetStateAction<string>>;
  onRename?: (new_filename: string, onSuccess?: VoidFunction) => void;
  isRenaming?: boolean;
  onDeleteClick?: () => void;
  onShareClick?: () => void;
  showChatTitle?: boolean;
  showSubTitle?: boolean;
  fileType?: string;
}

export default function HomeFlashcardViewHeader({
  onDeleteClick,
  onShareClick,
  setClassTitleParams,
  classTitleParams,
  onRename,
  isRenaming,
  showChatTitle = true,
  fileType = '',
  showSubTitle = true,
}: ChatHeaderProps) {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resizeInput = () => {
    if (inputRef.current && containerRef.current) {
      inputRef.current.style.width = '0px';
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = Math.min(inputRef.current.scrollWidth, containerWidth - 80);
      inputRef.current.style.width = `${newWidth}px`;
    }
  };
  const Title = () => {
    return (
      <HStack gap="1" width="100%" overflow="hidden" ref={containerRef}>
        <Flex width="100%" overflow="hidden" justifyContent="flex-start" alignItems="center">
          <styled.img src="/icons/ic_file.svg" alt="" height="18px" width="18px" mr="2.5" />
          <Editable.Area minWidth={0} maxW="200px" mr={2}>
            <Editable.Input
              ref={inputRef}
              onInput={resizeInput}
              onFocus={e => {
                if (e.target.value === '') {
                  e.target.value = classTitleParams || '';
                }
                resizeInput();
              }}
              _focus={{ outline: 'none' }}
              style={{
                minWidth: '20px',
                maxWidth: '100%',
              }}
            />
            <Editable.Preview asChild>
              <styled.div
                color="#6E6B7B"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {classTitleParams}
              </styled.div>
            </Editable.Preview>
          </Editable.Area>
          <Editable.Context>
            {editable => {
              return (
                <Editable.Control>
                  {editable.editing ? (
                    <HStack>
                      <Editable.SubmitTrigger asChild>
                        <IconButton aria-label={t('common.save')} variant="ghost" size="sm">
                          <CheckIcon color="#363636" />
                        </IconButton>
                      </Editable.SubmitTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton aria-label={t('common.cancel')} variant="ghost" size="sm">
                          <XIcon color="#363636" />
                        </IconButton>
                      </Editable.CancelTrigger>
                    </HStack>
                  ) : (
                    <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 5 } }}>
                      <Tooltip.Trigger asChild>
                        <Editable.EditTrigger asChild>
                          <IconButton aria-label={t('flashcards.editFlashcard')} variant="ghost" size="sm">
                            <PenLineIcon color="#15112B80" />
                          </IconButton>
                        </Editable.EditTrigger>
                      </Tooltip.Trigger>
                      <Tooltip.Positioner>
                        <Tooltip.Content
                          bgColor={'white'}
                          borderRadius={'sm'}
                          color={'#484846'}
                          fontSize={'sm'}
                          fontWeight={600}
                          px={4}
                          whiteSpace={'pre-line'}
                          textWrap={'nowrap'}
                          overflow={'hidden'}
                          textOverflow={'ellipsis'}
                          lineHeight={1}
                          boxShadow={
                            '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03),-14px 0px 6px -2px rgba(16, 24, 40, 0.03)'
                          }>
                          <Tooltip.Arrow
                            className={css({
                              '--arrow-size': '8px',
                              '--arrow-background': 'white',
                            })}>
                            <Tooltip.ArrowTip />
                          </Tooltip.Arrow>
                          {t('flashcards.editFlashcard')}
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Tooltip.Root>
                  )}
                </Editable.Control>
              );
            }}
          </Editable.Context>
        </Flex>
      </HStack>
    );
  };

  const renderChatTitle = () => {
    return (
      <Editable.Root
        activationMode="focus"
        submitMode="enter"
        autoResize={false}
        onValueCommit={details => {
          if (details.value !== classTitleParams && details.value !== '') {
            onRename?.(details.value, () => {
              setClassTitleParams?.(details.value);
            });
          }
        }}>
        <Editable.Context>
          {editable => (
            <Box
              fontSize="lg"
              display={editable.editing ? 'flex' : 'grid'}
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              p="2"
              fontWeight="semibold"
              overflow="hidden"
              width="100%"
              minWidth={20}>
              {isRenaming ? (
                <Stack gap="1" width="100%">
                  <Skeleton h={'21.7px'} w={'100%'} />
                </Stack>
              ) : (
                <Title />
              )}
            </Box>
          )}
        </Editable.Context>
      </Editable.Root>
    );
  };
  const renderChatDetails = () => {
    return (
      <HStack gap={0}>
        <TooltipWrappper
          trigger={
            <styled.p
              fontWeight={'semibold'}
              fontSize="3xl"
              margin="0px 12px 0px 0px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflowX="hidden"
              maxWidth={'800px'}>
              {classTitleParams}
            </styled.p>
          }
          content={classTitleParams}
        />

        {showSubTitle && (
          <>
            <ShevronRightIcon />
            <div
              className={css({
                fontWeight: 'semibold',
                fontSize: '1.5rem',
                lineHeight: '1.81rem',
                margin: '0px 16px 0px 10px',
              })}>
              <FileIcon />
            </div>
            <p
              className={css({
                fontWeight: 'normal',
                fontSize: '1.125rem',
                lineHeight: '1.3125rem',
                margin: '0px',
                color: '#15112B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px',
              })}>
              {classTitleParams}
            </p>
          </>
        )}
      </HStack>
    );
  };

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      px={'5%'}
      py="4"
      overflow="hidden"
      gap="2">
      <>{showChatTitle ? renderChatTitle() : renderChatDetails()}</>
      <HStack gap={2}>
        <Select.Root
          positioning={{ sameWidth: false }}
          width="fit-content"
          items={['delete', 'share']}
          onValueChange={({ value }) => {
            if (value[0] === 'delete' && onDeleteClick) {
              onDeleteClick();
            } else if (value[0] === 'share' && onShareClick) {
              onShareClick();
            }
          }}>
          <Select.Control>
            <Select.Trigger
              bg="rgba(0, 0, 0, 0.05)"
              h="full"
              color="black"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              transition="background-color 0.2s ease-in-out"
              borderWidth={0}
              _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
              px={2}
              py={'10.2px'}>
              <Select.ValueText>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Select.ValueText>
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content maxH="12rem" overflowY="scroll">
              <Select.ItemGroup>
                <Select.Item
                  item={'share'}
                  display="flex"
                  alignItems="center"
                  fontWeight={'medium'}
                  fontSize={'sm'}
                  px={4}
                  cursor="pointer"
                  transition="background-color 0.2s ease-in-out"
                  _hover={{ bg: 'rgba(0, 0, 0, 0.05)' }}>
                  <Select.ItemText display="flex" alignItems="center" gap={2}>
                    <ShareIcon width={16} height={16} />
                    {t('common.share')}
                  </Select.ItemText>
                </Select.Item>
                <Select.Item
                  item={'delete'}
                  display="flex"
                  alignItems="center"
                  fontWeight={'medium'}
                  fontSize={'sm'}
                  px={4}
                  cursor="pointer"
                  transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                  _hover={{ bg: 'rgba(0, 0, 0, 0.05)', color: 'red' }}>
                  <Select.ItemText display="flex" alignItems="center" gap={2}>
                    <ThrashIcon width={16} height={16} strokeOpacity={0.8} />
                    {t('common.delete')}
                  </Select.ItemText>
                </Select.Item>
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
        <UpgradePlanButton referrer="chat-header" style={{ borderRadius: '8px' }} />
      </HStack>
    </Flex>
  );
}
