import { PostHog } from 'posthog-node';

export default function PostHogClient() {
  const posthogClient = new PostHog('phc_4xmy0z4mq5NAjAwCYiXcKVVtZulhhnPwkvy5s4LSXXG'!, {
    host: 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}
