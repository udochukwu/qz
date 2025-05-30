import { Avatar } from '@/components/elements/avatar';
import { useUserStore } from '@/stores/user-store';
import { Divider, HStack, styled, VStack } from 'styled-system/jsx';
import { Menu } from '@/components/elements/menu';
import { ChevronRightIcon, LogOutIcon, Settings, UserRoundXIcon } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { Skeleton } from '@/components/elements/skeleton';
import { useManageSubscriptionModalStore } from '@/features/paywall/stores/manage-subscription-modal';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';
import { Badge } from '@/components/elements/badge';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { useDeleteAccount } from '@/hooks/use-delete-account';
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from './language-icon';
import LanguageModal from './language-modal';
import { useState } from 'react';

export default function UserCard() {
  const { t } = useTranslation();

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  //need to fix this so it actually uses user store
  const { username, email, user_subheader, user_image, langcode } = useUserStore();
  const router = useRouter();
  const { setIsOpen: setManageSubscriptionOpen } = useManageSubscriptionModalStore();
  const { data: proData, isLoading: proStatusLoading } = useSubscriptionStatus();
  const show_guide = !proStatusLoading && proData?.is_pro;
  const is_pro = !proStatusLoading && proData?.is_pro;
  const isDeleteModalOpen = useBoolean();
  const { mutate: deleteAccount, isLoading: isDeleting } = useDeleteAccount();
  if (username === 'Guest') {
    return (
      <HStack py={3} alignItems="center" gap={'10px'}>
        <Skeleton borderRadius="full">
          <Avatar size={'lg'} rounded={'full'} />
        </Skeleton>
      </HStack>
    );
  }

  const showManageSubscriptionModal = () => {
    setManageSubscriptionOpen(true);
  };

  return (
    <>
      <ConfirmDeleteModal
        entityType="account"
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteAccount}
        isLoading={isDeleting}
      />
      <LanguageModal isOpen={isLanguageModalOpen} setIsOpen={setIsLanguageModalOpen} />
      <Menu.Root positioning={{ placement: 'right' }}>
        <Menu.Trigger asChild>
          <HStack
            py={3}
            width="100%"
            alignItems="center"
            gap={'10px'}
            _hover={{
              cursor: 'pointer',
            }}>
            <Avatar name={username} src={user_image} size={'lg'} border={is_pro ? '2px solid #6D56FA' : 'none'} />
          </HStack>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content marginBottom={9} marginLeft={1}>
            <Menu.ItemGroup id="group-1">
              {/* <Menu.Item id="profile">
              <HStack gap="2">
                <UserIcon />
                Profile
              </HStack>
            </Menu.Item>
            <Menu.Item id="settings">
              <HStack gap="2">
                <SettingsIcon /> Settings
              </HStack>
            </Menu.Item> */}

              {show_guide && (
                <Menu.Item value="manage-subscription" id="manage-subscription" asChild>
                  <styled.button display="flex" gap={2} alignItems="center" onClick={showManageSubscriptionModal}>
                    <Settings />
                    <styled.span color={'#565656'}>{t('user.manageSubscription')}</styled.span>
                  </styled.button>
                </Menu.Item>
              )}

              <Menu.Item value="language" id="language" asChild>
                <styled.button
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={() => setIsLanguageModalOpen(true)}>
                  <HStack gap={2}>
                    <LanguageIcon />
                    <styled.span color={'#565656'}>{t('common.language')}</styled.span>
                  </HStack>
                  <styled.div display="flex" alignItems="center" fontSize="12px" color={'#565656'}>
                    {t(`language.${langcode}`)}
                    <ChevronRightIcon />
                  </styled.div>
                </styled.button>
              </Menu.Item>

              <Divider />

              <Menu.Item value="logout" id="logout" asChild>
                <styled.button
                  display="flex"
                  gap={2}
                  alignItems="center"
                  onClick={() => {
                    router.push('/auth/logout');
                  }}>
                  <LogOutIcon color="#565656" />
                  <styled.span color={'#565656'}>{t('auth.common.logOut')}</styled.span>
                </styled.button>
              </Menu.Item>

              <Divider />

              <Menu.Item value="user" id="user" asChild marginY={2}>
                <HStack>
                  <Avatar name={username} src={user_image} size={'md'} border={is_pro ? '2px solid #6D56FA' : 'none'} />
                  <VStack gap={0} alignItems="start">
                    <styled.p margin={0}>{username}</styled.p>
                    <styled.p margin={0} fontSize="10px" fontWeight="light">
                      {email}
                    </styled.p>
                  </VStack>
                </HStack>
                {/* <styled.button
                  display="flex"
                  gap={2}
                  alignItems="center"
                  onClick={() => {
                    router.push('/auth/logout');
                  }}>
                  <LogOutIcon color="#565656" />
                  <styled.span color={'#565656'}>{t("auth.common.logOut")}</styled.span>
                </styled.button> */}
              </Menu.Item>

              {/* <Menu.Item value="delete" id="delete" asChild>
                <styled.button
                  display="flex"
                  gap={2}
                  alignItems="center"
                  onClick={() => {
                    isDeleteModalOpen.setValue(true);
                  }}>
                  <UserRoundXIcon />
                  <span>Delete my account</span>
                </styled.button>
              </Menu.Item> */}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </>
  );
}
