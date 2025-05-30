import { Badge } from '@/components/elements/badge';
import { Flex, HStack, styled, VStack, Wrap } from 'styled-system/jsx';
import { useUpgradePlanModalStore } from '../stores/upgrade-plan-modal';
import Image from 'next/image';
import { useSubscriptionStatus } from '../hooks/use-subscription-status';
import { UsageProgress } from './usage-progress';
import { useUserStore } from '@/stores/user-store';
import { useTranslation } from 'react-i18next';

export const UpgradePlanSidebarButton = () => {
  const { t } = useTranslation();

  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { experiments } = useUserStore();

  const handleClick = () => {
    setIsOpen(true);
    setReferrer('menu-bar');
  };

  return (
    <VStack
      onClick={handleClick}
      mx={4}
      bgColor={'#F5F5F6'}
      _hover={{
        bgColor: '#F1F1F0',
        cursor: 'pointer',
      }}
      borderRadius={'md'}>
      <Flex
        justifyContent="space-between"
        alignItems={'center'}
        borderBottom={'1px solid rgba(0, 0, 0, 0.08)'}
        w={'full'}
        p={2}>
        <styled.span color={'rgba(21, 17, 43, 0.5)'} fontSize={'sm'}>
          {t('newChatView.paywall.currentPlan')}
        </styled.span>
        <Badge
          px={'3px'}
          py={'1px'}
          variant={'subtle'}
          borderRadius={'6px'}
          color={'#6D56FA'}
          fontSize={'10px'}
          background={'#6D56FA1F'}>
          {t('newChatView.paywall.freePlan')}
        </Badge>
      </Flex>

      {experiments && experiments['monthly-limit-paywall'] && (
        <>
          <UsageProgress
            type="Documents"
            limit={subscriptionStatus?.limits.document}
            usage={subscriptionStatus?.usage.document || 0}
          />
          <UsageProgress
            type="Messages"
            limit={subscriptionStatus?.limits.message}
            usage={subscriptionStatus?.usage.message || 0}
          />
          <UsageProgress
            type="Recordings"
            limit={subscriptionStatus?.limits.recording}
            usage={subscriptionStatus?.usage.recording || 0}
          />
          <UsageProgress
            type="Youtube"
            limit={subscriptionStatus?.limits.youtube}
            usage={subscriptionStatus?.usage.youtube || 0}
          />
        </>
      )}

      <HStack gap="1" alignItems={'flex-start'}>
        <Image src="/images/sparkles.svg" alt="sparkles" width={18} height={18} />
        <VStack gap="0.5" fontSize={'12px'} color={'#6E6B7B'} alignItems={'start'} pb={2}>
          <styled.span color={'#15112B'} fontWeight={'semibold'}>
            {t('newChatView.paywall.upgradePlan.title')}
          </styled.span>
          <Wrap fontWeight={400}>{t('newChatView.paywall.upgradePlan.description')}</Wrap>
        </VStack>
      </HStack>
    </VStack>
  );
};
