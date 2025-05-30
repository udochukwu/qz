import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';

export default function GeneratingFlashcardLoader({ customText }: { customText?: string }) {
  const { t } = useTranslation();
  return (
    <styled.div
      w="100%"
      mx="auto"
      h="85vh"
      minW="500px"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center">
      <Lottie
        animationData={require('@assets/lottie/generating-flashcard.json')}
        loop={true}
        autoplay={true}
        style={{ width: '447px', height: '191px' }}
      />
      <styled.p mb="2" fontWeight="500" fontSize={{ base: '20px', lg: '33px' }} color="#3E3C46">
        {customText || t('flashcards.generating')}
      </styled.p>
      <styled.p fontWeight="400" color="#000000" fontSize={{ base: '14px', lg: '18px' }}>
        {t('flashcards.takeAWhile')}
      </styled.p>
    </styled.div>
  );
}
