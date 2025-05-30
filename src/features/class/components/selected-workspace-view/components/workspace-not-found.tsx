import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, styled } from 'styled-system/jsx';
import Image from 'next/image';

export const WorkspaceNotFound = () => {
  const { t } = useTranslation();

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      maxWidth="400px"
      margin="0 auto">
      <Image src="/images/class-not-found-emoji.png" alt="class-not-found" width={200} height={200} />
      <styled.h1 fontSize="2rem" color="#3E3646">
        {t('class.workspace.error.class_not_found_title')}
      </styled.h1>
      <styled.p fontSize="1rem" lineHeight="1.0625rem" color="#3E3646" textAlign="center">
        {t('class.workspace.error.class_not_found')}
      </styled.p>
    </Flex>
  );
};
