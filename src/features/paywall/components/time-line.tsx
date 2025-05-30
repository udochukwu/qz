import { css } from 'styled-system/css';
import LockIcon from './assets/lock-icon';
import BellIcon from './assets/bell-icon';
import RocketIcon from './assets/rocket-icon';
import { Flex, styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

function TimelineItem({
  icon,
  title,
  description,
  hasBar,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  hasBar?: boolean;
  dashed?: boolean;
}) {
  return (
    <Flex alignItems="flex-start">
      <Flex flexDir="column" alignItems="center" mr="3.5">
        <Flex
          className={css({
            width: { md: '35px', lg: '50px', '2xl': '70px' },
            height: { md: '35px', lg: '50px', '2xl': '70px' },
            borderRadius: 'full',
            bg: index === 0 ? 'primary.9' : '#6D56FA14',
            color: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          })}>
          {icon}
        </Flex>
        {hasBar && index === 0 && (
          <div
            className={css({
              width: '2px',
              height: { md: '8', lg: '14', '2xl': '20' },
              bg: 'transparent',
              borderWidth: 2,
              borderColor: 'primary.9',
            })}></div>
        )}
        {index == 1 && (
          <Image
            src={'/images/dashed-line.svg'}
            alt={'dashed line'}
            width={10}
            height={100}
            objectFit="fit-content"
            className={css({
              height: { md: '10', lg: '14', '2xl': '20' },
            })}
          />
        )}
      </Flex>

      <styled.div w="100%" h="auto">
        <styled.div
          className={css({
            fontWeight: '500',
            fontSize: { md: '0.8rem', lg: '1rem', '2xl': '1.4rem' },
            color: '#3E3C46',
          })}>
          {title}
        </styled.div>
        <styled.div
          className={css({ color: '#3E3C46B2', mt: '1', fontSize: { md: '0.6rem', lg: '0.8rem', '2xl': '1rem' } })}>
          {description}
        </styled.div>
      </styled.div>
    </Flex>
  );
}

export default function Timeline() {
  const { t } = useTranslation();
  const steps = [
    {
      icon: <LockIcon width={20} height={20} />,
      title: t('purchase.timeline.title1'),
      description: t('purchase.timeline.subtitle1'),
      hasBar: true,
    },
    {
      icon: <BellIcon width={20} height={20} />,
      title: t('purchase.timeline.title2'),
      description: t('purchase.timeline.subtitle2'),
      hasBar: true,
      dashed: true,
    },
    {
      icon: <RocketIcon width={20} height={20} />,
      title: t('purchase.timeline.title3'),
      description: t('purchase.timeline.subtitle3'),
      hasBar: false,
    },
  ];
  return (
    <div>
      {steps.map((step, index) => (
        <TimelineItem
          key={index}
          index={index}
          description={step.description}
          title={step.title}
          icon={step.icon}
          hasBar={step.hasBar}
          dashed={step.dashed}
        />
      ))}
    </div>
  );
}
