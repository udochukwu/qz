import React, { useRef } from 'react';
import { Button } from '@/components/elements/button';
import { motion } from 'framer-motion';
import { UpgradePlanButton } from '@/features/paywall/components/upgrade-plan-button';
import { ChevronRightIcon, ChevronsLeft, PenLineIcon, CheckIcon, XIcon } from 'lucide-react';
import { Box, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { class_title_params } from '../types';
import { IconButton } from '@/components/elements/icon-button';
import { useRouter } from 'next13-progressbar';
import { Editable } from '@/components/elements/editable';
import { Skeleton } from '@/components/elements/skeleton';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import generatePastelColor from '@/utils/generate-pastel-color';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/elements/tooltip';
import { css } from 'styled-system/css';
import { ThrashIcon } from '@/components/icons/thrash-icon';
import { ShareIcon } from '@/components/icons/share-icon';

interface ChatHeaderProps {
  showFilesSideBar: boolean;
  classTitleParams: class_title_params;
  setClassTitleParams: React.Dispatch<React.SetStateAction<class_title_params>>;
  setSideBarOpen: (show: boolean) => void;
  onRename: (new_chat_name: string, onSuccess?: VoidFunction) => void;
  isRenaming: boolean;
  onDeleteClick: () => void;
  onShareClick: () => void;
}

export default function ChatHeader({
  onDeleteClick,
  onShareClick,
  showFilesSideBar,
  setSideBarOpen,
  setClassTitleParams,
  classTitleParams,
  onRename,
  isRenaming,
}: ChatHeaderProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1, ease: 'easeIn' } },
  };

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
        <Flex width="100%" overflow="hidden" alignItems="center">
          <Editable.Area minWidth={0} mr={2}>
            <Editable.Input
              ref={inputRef}
              onInput={resizeInput}
              onFocus={e => {
                if (e.target.value === '') {
                  e.target.value = classTitleParams.chat_desc;
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
                color={classTitleParams.chat_desc === t('common.untitledChat') ? '#6E6B7B80' : 'quizard.black'}
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {classTitleParams.chat_desc}
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
                        <IconButton
                          aria-label={t('common.save')}
                          variant="ghost"
                          size="sm"
                          _hover={{ color: '#6D56FA' }}>
                          <CheckIcon />
                        </IconButton>
                      </Editable.SubmitTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton
                          aria-label={t('common.cancel')}
                          variant="ghost"
                          size="sm"
                          _hover={{ color: '#6D56FA' }}>
                          <XIcon />
                        </IconButton>
                      </Editable.CancelTrigger>
                    </HStack>
                  ) : (
                    <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 5 } }}>
                      <Tooltip.Trigger asChild>
                        <Editable.EditTrigger asChild>
                          <IconButton
                            aria-label={t('chat.header.editChat')}
                            variant="ghost"
                            size="sm"
                            color="#15112B80"
                            _hover={{ color: '#6D56FA' }}>
                            <PenLineIcon />
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
                          {t('chat.header.editChat')}
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
    const [ExtractEmoji, extractTitle] = getClassNameAndIcon(classTitleParams.chat_name);
    const color = generatePastelColor(classTitleParams.workspace_id);
    return (
      <Editable.Root
        activationMode="focus"
        submitMode="enter"
        autoResize={false}
        onValueCommit={details => {
          if (details.value !== classTitleParams.chat_desc && details.value !== '') {
            onRename(details.value, () => {
              setClassTitleParams((prevState: class_title_params) => ({
                ...prevState,
                chat_desc: details.value,
              }));
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
              {classTitleParams.is_class_chat ? (
                <Flex gap="1" alignItems="center" overflow="hidden" width="100%" minWidth={0}>
                  <styled.div
                    color={'#6E6B7B'}
                    fontSize="lg"
                    whiteSpace={'nowrap'}
                    maxWidth={'150px'}
                    display={'inline-flex'}
                    flexShrink={1}
                    textOverflow={'ellipsis'}
                    _hover={{ cursor: 'pointer' }}
                    alignItems={'center'}
                    onClick={() => router.push(`/classes/${classTitleParams.workspace_id}`)}>
                    <ExtractEmoji color={color} size={22} style={{ flexShrink: 0 }} />
                    <styled.span overflow={'hidden'} whiteSpace={'nowrap'} textOverflow={'ellipsis'}>
                      &nbsp;
                      {extractTitle}
                    </styled.span>
                  </styled.div>
                  <ChevronRightIcon size={17} />
                  {isRenaming ? <Skeleton h={'21.7px'} w={'100%'} /> : <Title />}
                </Flex>
              ) : isRenaming ? (
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

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      px={'5%'}
      py="4"
      overflow="hidden"
      gap="2">
      {renderChatTitle()}
      <HStack gap={1} flexShrink={0}>
        <IconButton variant={'ghost'} onClick={onDeleteClick} _hover={{ color: '#FA5656' }}>
          <ThrashIcon />
        </IconButton>
        <UpgradePlanButton referrer="chat-header" style={{ borderRadius: '8px' }} />
        <IconButton variant={'ghost'} onClick={onShareClick} _hover={{ color: '#6D56FA' }}>
          <ShareIcon height={18} width={18} />
        </IconButton>

        {!showFilesSideBar && (
          <motion.div initial="hidden" animate={showFilesSideBar ? 'hidden' : 'visible'} variants={buttonVariants}>
            <Button
              variant={'ghost'}
              size={'md'}
              onClick={() => setSideBarOpen(true)}
              visibility={showFilesSideBar ? 'hidden' : 'visible'}>
              <ChevronsLeft />
            </Button>
          </motion.div>
        )}
      </HStack>
    </Flex>
  );
}
