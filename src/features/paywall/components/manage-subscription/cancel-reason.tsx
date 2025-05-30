/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/elements/button';
import { RadioGroup } from '@/components/elements/radio-group';
import { HStack, Stack, styled, VStack } from 'styled-system/jsx';
import { SubscriptionCancelFormData } from '../../types';
import { useTranslation } from 'react-i18next';

interface Props {
  onNext: () => void;
  onBack: () => void;
  formData: SubscriptionCancelFormData;
  onFormDataChange: (data: Partial<SubscriptionCancelFormData>) => void;
}

const options = [
  { value: 'Too Expensive', label: 'newChatView.paywall.cancelReason.options.expensive' },
  { value: 'Found a Better Alternative', label: 'newChatView.paywall.cancelReason.options.alternative' },
  { value: 'No Longer Needed the Service', label: 'newChatView.paywall.cancelReason.options.service' },
  { value: 'Technical Issues', label: 'newChatView.paywall.cancelReason.options.technicalIssues' },
  { value: 'Temporary Subscription Only', label: 'newChatView.paywall.cancelReason.options.temporarySubscription' },
  { value: 'Switching to a Competitor', label: 'newChatView.paywall.cancelReason.options.competitor' },
  { value: 'Did not meet expectations', label: 'newChatView.paywall.cancelReason.options.expectations' },
  { value: 'Other', label: 'newChatView.paywall.cancelReason.options.otherReason' },
];

export const CancelReason = ({ onNext, onBack, formData, onFormDataChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack gap="2" p="3">
      <VStack maxW={640} alignItems={'start'}>
        <styled.span fontSize={20} fontWeight={'medium'}>
          {t('newChatView.paywall.cancelReason.title')}
        </styled.span>
        <styled.span color="#15112b80" fontSize={14} fontWeight={'medium'}>
          {t('newChatView.paywall.cancelReason.description')}
        </styled.span>
        <RadioGroup.Root
          width={'full'}
          value={formData.cancelReason}
          onValueChange={d => onFormDataChange({ cancelReason: d.value })}>
          <RadioGroup.Indicator />
          {options.map(option => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              borderColor={'#E8E8E8'}
              borderWidth={'2px'}
              borderRadius={'6px'}
              padding={'10px 10px 10px 15px'}>
              <RadioGroup.ItemControl />
              <RadioGroup.ItemText color={'#15112B99'} fontWeight={'normal'}>
                {t(option.label)}
              </RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </VStack>
      <HStack gap="3" width="full" fontWeight={'normal'} justifyContent={'space-between'}>
        <Button variant={'link'} color={'#21212180'} minW={200} fontSize={14} fontWeight={'medium'} onClick={onNext}>
          {t('common.skipForNow')}
        </Button>
        <Button maxW={120} width="full" bgColor={'#6D56FA'} onClick={onNext}>
          {t('common.next')}
        </Button>
      </HStack>
    </Stack>
  );
};
