import React from 'react';
import ClassesFilesBrowser from './components/classes-files-browser/classes-files-browser';
import { styled } from 'styled-system/jsx';
import { UnstuckLogoMini } from '@/components/unstuck-logo-mini';
import { useTranslation } from 'react-i18next';

export function NewChatView() {
  const { t } = useTranslation();

  return (
    <styled.div h="100vh" w="100%" display="flex" justifyContent="center">
      <styled.div
        w="100%"
        h="100%"
        overflowY="auto"
        display="flex"
        flexDir="column"
        alignItems="center"
        pt="15vh"
        pb="12px">
        <styled.div
          width="50vw"
          maxWidth="750px"
          overflow="visible"
          paddingRight="150px"
          mx="lg"
          display="flex"
          flexDir="row"
          gap="15"
          marginX="6px">
          <styled.div minWidth={'27px'} minHeight={'27px'}>
            <UnstuckLogoMini height={27} width={27} />
          </styled.div>
          <styled.div display="flex" flexDir="column">
            <styled.span color="#3E3C46" fontWeight="500" textStyle="2xl" marginBottom="10px">
              {t('newChatView.hiHowCanIHelpYouToday')}
            </styled.span>
            <styled.p textStyle="lg" fontWeight="400" color="#15112B80">
              {t('newChatView.yourPersonalAIAssistantToHelpWithYourSchoolWork')}
            </styled.p>
          </styled.div>
        </styled.div>
        <ClassesFilesBrowser />
      </styled.div>
    </styled.div>
  );
}
