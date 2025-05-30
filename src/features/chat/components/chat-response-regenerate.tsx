import { Button } from '@/components/elements/button';
import { ListRestartIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VStack } from 'styled-system/jsx';
import { styled } from 'styled-system/jsx';

interface Props {
  regenerate: () => void;
}

export const ChatResponseRegenerate = ({ regenerate }: Props) => {
  const { t } = useTranslation();

  return (
    <VStack w="100%" py={5}>
      <styled.p mb={0} color="fg.muted" textStyle="xs">
        {t('chat.regenerate.error')}
      </styled.p>
      <Button onClick={regenerate}>
        <ListRestartIcon size={10} />
        <span>&nbsp;{t('chat.regenerate.submit')}</span>
      </Button>
    </VStack>
  );
};
