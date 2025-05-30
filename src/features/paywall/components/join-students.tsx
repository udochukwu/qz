import React from 'react';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import VideoCarousal from './video-carousal';

export default function JoinStudents() {
  const { t } = useTranslation();

  return (
    <styled.section mt="12" marginLeft={'5rem'}>
      <h2
        className={css({
          fontSize: { lg: '1.8rem', xl: '2rem', '2xl': '2.5rem' },
          fontWeight: '700',
          paddingRight: '3rem',
        })}>
        <span>{t('purchase.title2.part1')}</span>
        <span
          className={css({
            color: 'white',
            px: '2',
            py: '1',
            mx: '2px',
            borderRadius: '8px',
            pos: 'relative',
            zIndex: '1',
            fontSize: { md: '1rem', lg: '1rem', xl: '2rem', '2xl': '2.5rem' },
            _after: {
              bg: 'primary.9',
              position: 'absolute',
              content: '""',
              inset: '0',
              transform: 'rotate(2deg)',
              borderRadius: 'inherit',
              zIndex: '-1',
            },
          })}>
          {t('purchase.title2.part2')}
        </span>
        <span>{t('purchase.title2.part3')}</span>
      </h2>
      <styled.div className={css({ paddingRight: '5rem' })}>
        <VideoCarousal />
      </styled.div>
    </styled.section>
  );
}
