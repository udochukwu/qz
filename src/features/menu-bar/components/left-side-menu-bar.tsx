/* eslint-disable @sayari/no-unwrapped-jsx-text */
import { Info, Youtube, MessageCircleQuestion, PlusIcon } from 'lucide-react';
import {
  FolderIcon,
  HomeIcon,
  LaptopIcon,
  SidePanelIconClosed,
  SidePanelIconOpened,
  CollectionIcon,
} from './menu-icons';
import { HStack, styled, VStack, Wrap } from 'styled-system/jsx';
import LinkButton from './LinkButton';
import { Tooltip } from '@/components/elements/tooltip';
import { MultipleButtons } from './multiple-buttons';
import { ActionButton } from './action-button';
import { DiscordLogo } from '@/components/discord-logo';
import useIntercomStore from '@/features/customer-service/stores/intercom-store';
import UserCard from './user-card';
import ClassButton from './class-button';
import IconButton from './icon-button';
import { CreateNewWorkspaceModal } from '@/features/class/components/create-new-workspace-modal';
import { useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { useTranslation } from 'react-i18next';
import { useTourStore } from '@/features/onboarding/stores/tour-store';
import { usePathname } from 'next/navigation';

interface LeftSideMenuBarProps {
  onSideBarToggle: () => void;
  isSideBarOpen: boolean;
  numUnsavedRecordings: number;
  currentWorkspace: string | null;
  classes: { workspace_id: string; class_name: string }[];
  isLoading: boolean;
}
export default function LeftSideMenuBar({
  onSideBarToggle,
  isSideBarOpen,
  numUnsavedRecordings,
  currentWorkspace,
  classes,
  isLoading,
}: LeftSideMenuBarProps) {
  const { t } = useTranslation();
  const { isTourActive } = useTourStore();
  const { showNewMessage } = useIntercomStore();
  const pathname = usePathname();
  const router = useRouter();
  const onClassClick = (workspace_id: string | null) => {
    if (workspace_id) {
      router.push(`/classes/${workspace_id}`);
    } else {
      router.push('/');
    }
    if (!isSideBarOpen) onSideBarToggle();
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <CreateNewWorkspaceModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <VStack
        width="70px"
        height="calc(100vh - 30px)"
        display="flex"
        py={4}
        bg={'white'}
        border="1px solid token(colors.gray.4)"
        justifyContent={'space-between'}
        borderLeftRadius={'xl'}
        borderRightRadius={!isSideBarOpen ? 'xl' : 'none'}>
        <VStack gap={8} pt={2} flexShrink={0}>
          <IconButton
            bgColor={currentWorkspace ? '#F3F3F3' : '#6D56FA'}
            _hover={pathname === '/' ? {} : { opacity: 0.8 }}
            transition={'opacity 0.2s ease-in-out'}
            icon={
              <HomeIcon
                size={20}
                color={currentWorkspace ? '#6D56FA' : '#FFFFFF'}
                fill={currentWorkspace ? ' none' : '#FFFFFF'}
              />
            }
            text={t('common.home')}
            onClick={() => onClassClick(null)}
          />
          <IconButton
            color="#363636"
            icon={isSideBarOpen ? <SidePanelIconOpened size={20} /> : <SidePanelIconClosed size={20} />}
            onClick={onSideBarToggle}
            text={isSideBarOpen ? t('class.menu.sidebar.close') : t('class.menu.sidebar.open')}
          />
        </VStack>
        <HStack alignItems={'center'} gap={0.5} w={'100%'} flexShrink={0}>
          <styled.div h={'1px'} w={'100%'} bgColor={'token(colors.gray.4)'} flex={1}></styled.div>
          <styled.span fontSize={'sm'} fontWeight={'medium'} color={'#868492'}>
            {t('common.class', { count: 2 })}
          </styled.span>
          <styled.div h={'1px'} w={'100%'} bgColor={'token(colors.gray.4)'} flex={1}></styled.div>
        </HStack>
        <VStack
          flex={1}
          width={'100%'}
          overflowY={isTourActive ? 'none' : 'auto !important'}
          scrollbar="hidden"
          scrollbarWidth={'0px'}
          css={{
            '&::-webkit-scrollbar': {
              width: '0px',
            },
          }}>
          {!isLoading &&
            classes.map(c => (
              <ClassButton
                workspace_id={c.workspace_id}
                class_name={c.class_name}
                onClick={onClassClick}
                key={c.workspace_id}
                isActive={currentWorkspace === c.workspace_id}
              />
            ))}

          <IconButton
            transition={'opacity 0.2s ease-in-out'}
            className={'create-new-class-button'}
            onClick={() => setIsOpen(true)}
            color="rgb(21, 17, 43,0.5)"
            _hover={{ border: '2px solid #73708080' }}
            icon={<PlusIcon size={20} />}
            text={t('class.workspace.createNewClass')}
          />
        </VStack>
        <VStack flexShrink={0}>
          <VStack gap={2}>
            <LinkButton
              href="/classes"
              color="rgb(21, 17, 43,0.5)"
              _hover={{ color: '#6D56FA', border: '1px solid #6D56FA' }}
              icon={<LaptopIcon />}
              text={t('common.class', { count: 2 })}
            />
            <LinkButton
              href="/files"
              color="rgb(21, 17, 43,0.5)"
              _hover={{ color: '#6D56FA', border: '1px solid #6D56FA' }}
              icon={<FolderIcon />}
              text={t('common.files')}>
              {numUnsavedRecordings > 0 && (
                <Tooltip.Root
                  positioning={{
                    placement: 'right-start',
                    offset: { mainAxis: 12, crossAxis: 0 },
                  }}>
                  <Tooltip.Trigger>
                    <styled.span
                      position="absolute"
                      bottom="-4px"
                      right="-4px"
                      color="white"
                      backgroundColor="red"
                      rounded="sm"
                      width={4}
                      height={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="center">
                      {numUnsavedRecordings}
                    </styled.span>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content backgroundColor="white">
                      <Tooltip.Arrow>
                        <Tooltip.ArrowTip />
                      </Tooltip.Arrow>
                      <styled.div color="black" p={2} rounded="md" fontSize="xs">
                        {t('class.menu.unsavedRecordings', { numUnsavedRecordings })}
                      </styled.div>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              )}
            </LinkButton>
            <LinkButton
              href="/collection"
              _hover={{ color: '#6D56FA', border: '1px solid #6D56FA' }}
              color="rgb(21, 17, 43,0.5)"
              icon={<CollectionIcon />}
              text={t('common.collection')}
            />
          </VStack>
        </VStack>
        <VStack
          alignItems={'center'}
          flexShrink={0}
          width="full"
          gap={1}
          pt={2}
          borderTop={'1px solid token(colors.gray.4)'}>
          <MultipleButtons
            triggerProps={{ color: 'rgb(21, 17, 43,0.5)', _hover: { color: '#6D56FA', border: '1px solid #6D56FA' } }}
            icon={<Info />}>
            <ActionButton
              text={t('class.menu.actions.tutorial')}
              icon={<Youtube color="rgb(21, 17, 43,0.5)" />}
              onClick={() => window.open('https://www.youtube.com/watch?v=JQTP6aunnrQ', '_blank')}
            />
            <ActionButton
              text={t('class.menu.actions.askCustomerSupport')}
              icon={<MessageCircleQuestion color="rgb(21, 17, 43,0.5)" />}
              onClick={showNewMessage}
            />
            <ActionButton
              text={t('class.menu.actions.joinDiscord')}
              icon={<DiscordLogo width={26} height={19} />}
              onClick={() => window.open('https://discord.gg/A5pP5JaZB3', '_blank')}
            />
          </MultipleButtons>
          <Wrap px={3} flexShrink={0}>
            <UserCard />
          </Wrap>
        </VStack>
      </VStack>
    </>
  );
}
