import Lottie from 'lottie-react';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';

export function PlaylistFullLoader() {
  const { t } = useTranslation();
  return (
    <styled.div
      w="100%"
      mx="auto"
      minW="320px"
      minH="320px"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      padding="32px"
    >
      <Lottie
        animationData={require('public/lottie/generating-flashcard.json')}
        loop={true}
        autoplay={true}
        style={{ width: '220px', height: '94px', marginBottom: 32 }}
      />
      <styled.h2 fontSize="22px" fontWeight="600" color="#15112B" marginBottom="8px" margin="0">
        {t('playlist.importingFullPlaylist')}
      </styled.h2>
      <styled.p fontSize="15px" color="#15112B80" margin="0" textAlign="center">
        {t('playlist.loading')}
      </styled.p>
    </styled.div>
  );
} 