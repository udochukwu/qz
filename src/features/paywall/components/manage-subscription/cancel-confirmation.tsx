/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';
import { HStack, Stack, styled, VStack } from 'styled-system/jsx';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const CancelConfirmation = ({ onNext, onBack }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack gap="8" p="6" alignItems={'center'}>
      <VStack maxW={320} textAlign={'center'}>
        <styled.span fontSize={26} fontWeight={'medium'}>
          {t('newChatView.paywall.cancelConfirmation.title')}
        </styled.span>
        <styled.span color="#15112b80" fontSize={16} fontWeight={'medium'}>
          {t('newChatView.paywall.cancelConfirmation.description')}
        </styled.span>
      </VStack>
      <HStack gap="3" width="full" fontWeight={'normal'}>
        <Button
          variant={'outline'}
          color={'#6D56FA'}
          background={'#6D56FA1F'}
          _hover={{ bgColor: '#1a0c6c0f' }}
          borderColor={'#6D56FA2F'}
          minW={200}
          onClick={onBack}>
          {t('common.goBack')}
        </Button>
        <Button minW={200} bgColor={'#6D56FA'} onClick={onNext}>
          {t('newChatView.paywall.cancelPlan')}
        </Button>
      </HStack>
    </Stack>
  );
};
