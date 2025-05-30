import { Box, Flex, HStack, VStack, styled } from 'styled-system/jsx';
import { UpgradePlanButton } from '../upgrade-plan-button';
import { useEffect } from 'react';
import { useUpgradePlanModalStore } from '../../stores/upgrade-plan-modal';
import { useTranslation } from 'react-i18next';

export default function MessagesUpgradeBox() {
  const { t } = useTranslation();
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();

  // Automatically show upgrade modal for lifetime limited users
  useEffect(() => {
    setReferrer('message-limit');
    setIsOpen(true);
  }, [setIsOpen, setReferrer]);

  return (
    <VStack width="100%" gap={0} marginTop={'16px'}>
      <HStack
        alignItems="flex-start"
        justifyContent="space-between"
        overflowX="hidden"
        width="100%"
        p={6}
        position={'sticky'}
        border={'1px solid rgba(0,0,0,0.08)'}
        bg={'white'}
        rounded="md">
        <styled.div maxWidth="450px" flexGrow={1} pt={1}>
          <VStack overflowX="auto" alignItems={'start'} gap={2}>
            <Flex flexDirection={'column'} gap={0}>
              <styled.span fontWeight={'semibold'} fontSize={18}>
                {t('chat.upgrade.messageLimit')} :&#40;
              </styled.span>
              <styled.span fontWeight={'semibold'} fontSize={18} color={'#6D56FA'}>
                {t('chat.upgrade.unlimitedQuestions')}
              </styled.span>
            </Flex>
            <styled.span fontWeight={'normal'} fontSize={14}>
              {t('chat.upgrade.unlimitedAccess')}
            </styled.span>
            <UpgradePlanButton referrer="message-limit" />
          </VStack>
        </styled.div>
        <Flex flexDir={'column'} alignItems={'end'} gap={2}>
          <Flex flexDir={'column'} alignItems={'end'} fontWeight={'semibold'} fontSize={22}>
            <styled.div>
              <styled.span>{t('chat.upgrade.join')} </styled.span>
              <styled.span color={'#6D56FA'}>2M+</styled.span>
              <styled.span> {t('common.students')}</styled.span>
            </styled.div>
            <styled.span>{t('chat.upgrade.trust')}</styled.span>
          </Flex>
          <styled.div px={2} py={1} border={'1px solid rgba(0,0,0,0.08)'} rounded={'lg'}>
            <Flex flexDir={'column'}>
              <styled.span fontWeight={'bold'} fontSize={22} color={'#6D56FA'}>
                50M+
              </styled.span>
              <styled.span fontWeight={'medium'} fontSize={10}>
                {t('chat.upgrade.answeredQuestions')}
              </styled.span>
            </Flex>
          </styled.div>
        </Flex>
      </HStack>
    </VStack>
  );
}
