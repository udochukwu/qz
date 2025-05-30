import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';

export const HeroTitle = () => {
  const { t } = useTranslation();

  return (
    <section className={stack({ gap: 2 })}>
      <styled.h2 gap={4} fontWeight={700} textStyle={{ base: '6xl', sm: '5xl', md: '6xl' }} lineHeight="80px">
        <span>{t('landing.hero.title.chat')}&nbsp;</span>
        <styled.br display={{ sm: 'none', base: 'block' }} />
        <span>{t('landing.hero.title.your')}</span>{' '}
        <styled.span
          pos="relative"
          color="white"
          borderRadius="2xl"
          px={{ sm: 6, base: 2 }}
          py={1}
          border="5px solid #6D56FA"
          background="linear-gradient(136.06deg, #A192FF 19.77%, #5F45FC 84.93%)">
          {t('common.class', { count: 1 }).toLocaleLowerCase()}
        </styled.span>
      </styled.h2>
      <styled.h1 fontWeight="initial" textStyle="lg" color="#4F4F4F">
        <span>{t('landing.hero.description.withUnstuck')}</span>{' '}
        <styled.strong fontWeight="semibold" color="black">
          {t('landing.hero.description.files')}
        </styled.strong>{' '}
        <span>{t('landing.hero.description.once')}</span>{' '}
        <styled.strong fontWeight="semibold" color="black">
          {t('landing.hero.description.citedAnswers')}
        </styled.strong>
      </styled.h1>
    </section>
  );
};
