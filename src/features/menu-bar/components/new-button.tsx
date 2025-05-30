import { useUserStore } from '@/stores/user-store';
import { PlusIcon, MessageSquareIcon, WalletCards } from 'lucide-react';
import React from 'react';
import { styled, HStack } from 'styled-system/jsx';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/elements/select';
import { useBoolean } from '@/hooks/use-boolean';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import { css } from 'styled-system/css';

type NewButtonProps = {
  workspace_id: string | null;
};

const NewButton: React.FC<NewButtonProps> = ({ workspace_id }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { impersonated } = useUserStore();
  const router = useRouter();

  return (
    <styled.button
      display={'flex'}
      width={'full'}
      h={'fit-content'}
      px={'4'}
      py={'2.5'}
      fontSize={'14px'}
      fontWeight={'medium'}
      bgColor={pathname === '/' ? '#f5f5f5' : 'white'}
      rounded={'md'}
      border={'1.5px solid'}
      borderColor={pathname === '/' ? '#633CEF60' : 'rgba(21, 17, 43, 0.1)'}
      color="#3E3C46"
      _hover={{ bgColor: '#6D56FA1F', borderColor: '#6D56FA29', color: '#6D56FA' }}
      className={css({
        '& svg': {
          color: '#3E3C46',
        },
        '&:hover svg': {
          color: '#6D56FA',
        },
      })}
      cursor={impersonated ? 'not-allowed' : 'pointer'}
      disabled={impersonated}
      alignItems={'center'}
      transition={'all 0.2s ease-in-out'}
      onClick={() => router.push('/')}>
      <HStack gap="10px" display="inline-flex" justifyContent="space-between" width="full">
        <styled.p m={0} textStyle="sm" fontSize="14px" fontWeight={500}>
          {t('common.new')}
        </styled.p>
        <PlusIcon size={18} />
      </HStack>
    </styled.button>
  );
};

export default NewButton;
