'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user_id, username, email } = useUserStore();

  useEffect(() => {
    posthog.init('phc_4xmy0z4mq5NAjAwCYiXcKVVtZulhhnPwkvy5s4LSXXG', {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      autocapture: false,
      debug: process.env.NODE_ENV === 'development',
    });
    // Set user identity if not guest
    if (user_id !== 'Guest') {
      posthog.identify(user_id);
      posthog.people.set({
        $email: email,
        $name: username,
        $distinct_id: user_id,
      });
    }
  }, [user_id, username, email]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
