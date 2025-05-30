import { Button } from '@/components/elements/button';
import { Zap } from 'lucide-react';
import React from 'react';
import { useSubscriptionStatus } from '../hooks/use-subscription-status';
import { useUpgradePlanModalStore } from '../stores/upgrade-plan-modal';
import { ReasonType } from '@/types';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-system/jsx';

interface Props {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  referrer: ReasonType;
}

export const UpgradePlanButton = ({ referrer, children, style }: Props) => {
  const { t } = useTranslation();

  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const { data: proData, isLoading: proStatusLoading } = useSubscriptionStatus();
  const show_upgrade = !proStatusLoading && !proData?.is_pro;

  const handleClick = () => {
    setReferrer(referrer);
    setIsOpen(true);
  };

  return (
    <Button
      variant={'solid'}
      justifyContent={'center'}
      bg={'#3E3C46'}
      size={'xs'}
      style={style}
      display={show_upgrade ? 'flex' : 'none'}
      onClick={handleClick}
      maxH={'30px'}>
      <styled.img src="/icons/ic_zap.svg" alt="" height="10px" width="10px" />
      {children ?? <span style={{ fontSize: '12px' }}>{t('chat.header.upgrade')}</span>}
    </Button>
  );
};
