import { useResetChatData } from '@/hooks/use-reset-chat-data';
import { useRouter } from 'next13-progressbar';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

export const useSoftRouteToChat = () => {
  const router = useRouter();
  const resetChatData = useResetChatData();

  const routeToChat = (chat_id: string, referer: string) => {
    mixpanel.track(EventName.ChatOpened, {
      chat_id: chat_id,
      referer: referer,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
    });
    resetChatData();
    router.push(`/c/${chat_id}`);
  };

  return { routeToChat };
};
