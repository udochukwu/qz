import { useRef, useLayoutEffect, useMemo, useEffect } from 'react';

const useKeepScrollPosition = (
  messages = [] as any,
): { containerRef: React.MutableRefObject<HTMLDivElement | null> } => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtBottom = useRef(true);
  const isInitialLoad = useRef(true);

  // Use useMemo to calculate and store whether the user is at the bottom of the container
  const last_message = messages[messages.length - 1];
  useMemo(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Check if the user is at the bottom of the chat before updating the chat content
      // We consider the user to be at the bottom if the scroll position is within a small threshold (e.g., 40px) of the bottom
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 40;
      wasAtBottom.current = isAtBottom;
    }
  }, [last_message]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (wasAtBottom.current || isInitialLoad.current) {
        // If the user was at the bottom, scroll to the new bottom
        container.scrollTop = container.scrollHeight - container.clientHeight;
        const timeoutId = setTimeout(() => {
          container.scrollTop = container.scrollHeight - container.clientHeight;
          if (messages.length > 0) {
            isInitialLoad.current = false;
          }
        }, 100);
        return () => clearTimeout(timeoutId);
      } else {
        // If the user was not at the bottom, maintain the scroll position relative to the top
        // This can be achieved by not changing the scrollTop value, as the content grows upwards
      }
    }
  }, [last_message]);

  return {
    containerRef,
  };
};

export default useKeepScrollPosition;
