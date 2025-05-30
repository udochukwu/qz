import { useEffect } from 'react';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

export const useTrackCopy = () => {
  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      const copiedText = window.getSelection()?.toString() || '';
      mixpanel.track(EventName.TextCopied, {
        copied_text: copiedText,
        url: window.location.href,
        path: window.location.pathname,
        page_title: document.title,
        text_length: copiedText.length,
        timestamp: new Date().toISOString(),
      });
    };

    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);
};
