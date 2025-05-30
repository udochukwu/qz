'use client';

import { Button } from '@/components/elements/button';
import { HelpCircle } from 'lucide-react';
import React, { useEffect } from 'react';
const crypto = require('crypto');
import Intercom, { showNewMessage } from '@intercom/messenger-js-sdk';
import { useUserStore } from '@/stores/user-store';
import { css } from 'styled-system/css';
import { motion } from 'framer-motion';
import useIntercomStore from '../stores/intercom-store';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';

export const IntercomButton = () => {
  const { username, email, user_id, impersonated } = useUserStore();
  const { newMessage, resetNewMessage } = useIntercomStore();
  const { data: proData, isLoading: proStatusLoading } = useSubscriptionStatus();
  const is_pro = !proStatusLoading && proData?.is_pro;

  if (username !== 'Guest' && !impersonated) {
    const secretKey = '6OG-Lhlg_Pzz0fzSo__tMkj-3PKbNtyWA7ZzWp17'; // IMPORTANT: your web Identity Verification secret key - keep it safe!
    const userIdentifier = user_id.toString(); // IMPORTANT: a UUID to identify your user

    const hash = crypto.createHmac('sha256', secretKey).update(userIdentifier).digest('hex');
    Intercom({
      app_id: 'lvgna871',
      user_id,
      name: username,
      email,
      user_hash: hash,
      paid_user: is_pro,
      hide_default_launcher: true,
      custom_launcher_selector: '#intercom-custom',
    });
  }

  useEffect(() => {
    if (newMessage) {
      showNewMessage('');
      resetNewMessage();
    }
  }, [newMessage, resetNewMessage]);

  const isFileWindowVisible = false;
  return (
    <>
      {username !== 'Guest' && (
        <motion.section
          animate={{
            x: isFileWindowVisible ? '-460px' : 0,
            transition: { type: 'spring', stiffness: 300, damping: 40, duration: 0.1 },
          }}
          className={css({
            pos: 'absolute',
            bottom: 4,
            right: 4,
            zIndex: 100,
          })}>
          <Button
            aria-label="Open intercom"
            display={'none'}
            borderRadius="full"
            h="50px"
            w="50px"
            p={0}
            py={0}
            fontSize="30px"
            id="intercom-custom">
            <HelpCircle className={css({ fontSize: '30px' })} />
          </Button>
        </motion.section>
      )}
    </>
  );
};
