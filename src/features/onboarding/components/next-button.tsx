import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';

interface NextButtonProps {
  updateProgress: () => void;
  isEnabled?: boolean;
}

export const NextButton = ({ updateProgress, isEnabled }: NextButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      color={'#fff'}
      p={'1rem 10rem'}
      visibility={isEnabled ? 'visible' : 'hidden'}
      bg={'#6D56FA'}
      _hover={{ bg: '#9FA1FF' }}
      onClick={updateProgress}
      cursor={'pointer'}>
      {t('common.next')}
    </Button>
  );
};
