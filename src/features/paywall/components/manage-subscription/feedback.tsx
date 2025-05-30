import { Button } from '@/components/elements/button';
import { TextArea } from '@/components/elements/text-area';
import { useUserStore } from '@/stores/user-store';
import { useRef, useState } from 'react';
import { HStack, Stack, styled, VStack } from 'styled-system/jsx';
import { useManageSubscription } from '../../hooks/use-subscription-manage';
import { SubscriptionCancelFormData } from '../../types';
import {
  EMAIL_PHONE_INPUT_NAME,
  FEEDBACK_INPUT_NAME,
  REASON_INPUT_NAME,
  USER_ID_INPUT_NAME,
} from './user-feedback-form-input-consts';
import { useTranslation } from 'react-i18next';

interface Props {
  onNext: () => void;
  onBack: () => void;
  formData: SubscriptionCancelFormData;
  onFormDataChange: (data: Partial<SubscriptionCancelFormData>) => void;
}

export const Feedback = ({ onNext, onBack, formData, onFormDataChange }: Props) => {
  const { t } = useTranslation();

  const { user_id, email } = useUserStore();
  const manageSubscription = useManageSubscription();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await manageSubscription.mutateAsync();

      if (result.redirect_url) {
        sessionStorage.setItem('subscriptionRedirectUrl', result.redirect_url);
        formRef.current?.submit();
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        id="hidden_iframe"
        name="hidden_iframe"
        style={{ display: 'none' }}
        onLoad={() => {
          if (isSubmitting) {
            const redirectUrl = sessionStorage.getItem('subscriptionRedirectUrl');
            if (redirectUrl) {
              sessionStorage.removeItem('subscriptionRedirectUrl');
              window.location.href = redirectUrl;
            }
          }
        }}></iframe>
      <Stack gap="8" p="6">
        <form
          ref={formRef}
          action="https://docs.google.com/forms/d/e/1FAIpQLSfJwskxQFsPLXMI2X9SyUBJd8Ga3TseOGE40xmPul3FhZe9tQ/formResponse"
          target="hidden_iframe"
          onSubmit={handleFinish}>
          <input type="hidden" name={REASON_INPUT_NAME} value={formData.cancelReason} />
          <input type="hidden" name={USER_ID_INPUT_NAME} value={user_id} />
          <input type="hidden" name={EMAIL_PHONE_INPUT_NAME} value={email} />
          <VStack maxW={640} alignItems={'start'}>
            <styled.span fontSize={26} fontWeight={'medium'}>
              <span>{t('newChatView.paywall.feedback.title')}</span>
            </styled.span>
            <styled.span color="#15112b80" fontSize={16} fontWeight={'medium'}>
              {t('newChatView.paywall.feedback.description')}
            </styled.span>
            <Stack width={'full'} height={200}>
              <styled.div
                display={'flex'}
                borderColor={'#E8E8E8'}
                borderWidth={'2px'}
                borderRadius={'6px'}
                padding={'10px 10px 10px 15px'}
                width={'full'}
                height={'full'}>
                <TextArea
                  resizable={false}
                  name={FEEDBACK_INPUT_NAME}
                  id="feedback-suggestions"
                  placeholder={t('newChatView.paywall.feedback.placeholder')}
                  value={formData.feedback}
                  onChange={e => onFormDataChange({ feedback: e.target.value })}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </styled.div>
            </Stack>
          </VStack>
          <HStack mt={3} gap="3" width="full" fontWeight={'normal'} justifyContent={'space-between'}>
            <Button
              variant={'link'}
              color={'#21212180'}
              minW={200}
              fontSize={16}
              fontWeight={'medium'}
              disabled={isSubmitting}
              onClick={handleFinish}>
              {t('common.skipForNow')}
            </Button>
            <Button maxW={120} width="full" bgColor={'#6D56FA'} disabled={isSubmitting} onClick={handleFinish}>
              {t('common.finish')}
            </Button>
          </HStack>
        </form>
      </Stack>
    </>
  );
};
