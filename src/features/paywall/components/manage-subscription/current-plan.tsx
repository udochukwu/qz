import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';
import { HStack, Stack, VStack, styled } from 'styled-system/jsx';

interface Props {
  onNext: () => void;
}

export const CurrentPlan = ({ onNext }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack gap="8" p="6">
      <VStack gap={0} alignItems={'start'}>
        <styled.span color="#15112b80" fontSize={16} fontWeight={'medium'}>
          {t('newChatView.paywall.currentPlan')}
        </styled.span>
        <HStack width="full" gap="20" alignItems={'center'} fontWeight={'semibold'}>
          <styled.span fontSize={26}>{t('newChatView.paywall.proPlan')}</styled.span>
        </HStack>
      </VStack>
      <HStack gap="3" width="full" fontWeight={'normal'}>
        <Button
          variant={'outline'}
          color={'#6D56FA'}
          background={'#6D56FA1F'}
          _hover={{ bgColor: '#1a0c6c0f' }}
          borderColor={'#6D56FA2F'}
          minW={200}
          width="full"
          onClick={onNext}>
          {t('newChatView.paywall.cancelPlan')}
        </Button>
      </HStack>
    </Stack>
  );
};
