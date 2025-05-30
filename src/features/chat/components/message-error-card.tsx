import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';

export function MessageErrorCard() {
  const { t } = useTranslation();

  return (
    <div>
      <styled.div
        mt="3"
        py="2"
        px="3"
        border="1px solid rgb(239, 68, 68)"
        borderRadius="md"
        fontSize="sm"
        bg="rgba(239, 68, 68, 0.1)">
        {t('chat.message.error')}
      </styled.div>
    </div>
  );
}
