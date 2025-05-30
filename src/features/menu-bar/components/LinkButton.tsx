import React from 'react';
import Link from 'next/link';
import { ButtonProps } from '@/components/elements/button';
import { PropsWithChildren } from 'react';
import { css } from 'styled-system/css';
import { useResetChatData } from '@/hooks/use-reset-chat-data';
import IconButton from './icon-button';
import { styled } from 'styled-system/jsx';
import { usePathname } from 'next/navigation';

interface LinkButtonProps extends ButtonProps {
  href: string;
  icon: React.ReactNode;
  text?: string;
}

export default function LinkButton({ href, icon, text, children, ...buttonProps }: PropsWithChildren<LinkButtonProps>) {
  const resetChatData = useResetChatData();
  const pathname = usePathname();
  const onButtonClicked = () => {
    resetChatData();
  };

  return (
    <Link
      className={css({
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none',
        },
      })}
      href={href}
      passHref>
      <styled.div position={'relative'}>
        <IconButton
          icon={icon}
          text={text}
          onClick={onButtonClicked}
          _hover={{ opacity: pathname === href ? 1 : 0.6 }}
          transition={'opacity 0.2s ease-in-out'}
          {...buttonProps}
        />
        {children}
      </styled.div>
    </Link>
  );
}
