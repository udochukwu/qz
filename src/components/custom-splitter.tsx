import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_CHAT_VIEW_SIZE, useSplitterStore } from '@/stores/splitter-api-store';
import { styled } from 'styled-system/jsx';
import { useAnimate } from 'framer-motion';
import { useBoolean } from '@/hooks/use-boolean';

interface Props {
  id?: string;
  children: [React.ReactNode, React.ReactNode];
  isToggleable?: {
    isToggled?: boolean;
  };
  containerStyles?: CSSProperties;
  onLeftPanelClick?: () => void;
  onRightPanelClick?: () => void;
  withOffset?: boolean;
}

const CustomSplitter = ({
  children,
  isToggleable,
  containerStyles,
  onLeftPanelClick,
  onRightPanelClick,
  withOffset = true,
  id = 'custom-splitter',
}: Props) => {
  const { chatSize, setChatSize } = useSplitterStore();

  const [tmpSize, setTmpSize] = React.useState<number>(id === 'custom-splitter' ? chatSize : DEFAULT_CHAT_VIEW_SIZE);

  const startX = useRef<number | null>(null); // Use ref to store the initial mouse X position

  const [contentScope, animateContent] = useAnimate();

  const [dragScope, animateDrag] = useAnimate();

  const [mainScope, animateMain] = useAnimate();

  const isSidebarInitiallyHidden = isToggleable && !isToggleable.isToggled;

  const isSidebarToggleShown = isToggleable && isToggleable.isToggled;

  const isAnimatedFinished = useBoolean();

  const initialChatSize =
    isToggleable && !isAnimatedFinished.value ? 100 : id === 'custom-splitter' ? chatSize : tmpSize;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (startX.current !== null) {
        // Calculate the offset left of the splitter component
        const splitterOffsetLeft = withOffset ? document.getElementById(id)?.offsetLeft ?? 0 : 0;
        // Adjust the difference calculation by subtracting the offset
        const diffX = e.clientX - splitterOffsetLeft - startX.current;
        const newSize = ((startX.current + diffX) / (window.innerWidth - splitterOffsetLeft)) * 100;
        setTmpSize(newSize);
      }
    },
    [setTmpSize, id],
  );

  useEffect(() => {
    if (id === 'custom-splitter') {
      setChatSize(tmpSize);
    }
  }, [id, setChatSize, tmpSize]);

  const handleMouseUp = useCallback(() => {
    // Remove listeners on mouse up
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    startX.current = null; // Reset startX on mouse up
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent default to avoid any unwanted behavior
      startX.current = e.clientX; // Set the start X position
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  // Automatically attach and clean up the mouse event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const animateSidebar = async () => {
      await Promise.all([
        animateContent(contentScope.current, { x: '-500px', opacity: '100%' }, { ease: 'easeOut', duration: 0.1 }),
        animateDrag(dragScope.current, { x: '-500px', opacity: '100%' }, { ease: 'easeOut', duration: 0.1 }),
        animateMain(mainScope.current, { width: `${tmpSize}%` }, { ease: 'easeOut', duration: 0.1 }),
      ]);
      isAnimatedFinished.setTrue();
    };

    if (isSidebarToggleShown) {
      animateSidebar();
    } else {
      isAnimatedFinished.setFalse();
    }
  }, [isSidebarToggleShown]);

  return (
    <styled.section id={id} display="flex" height="100%" pos="relative" overflowX="clip" style={containerStyles}>
      <styled.div
        ref={mainScope}
        onClick={onLeftPanelClick}
        overflowX="clip"
        style={{ width: `${initialChatSize}%`, height: '100%' }}>
        {children[0]}
      </styled.div>
      {!isSidebarInitiallyHidden && (
        <>
          <styled.div
            ref={dragScope}
            cursor="ew-resize"
            width="6px"
            height="100%"
            pos="relative"
            right={isSidebarToggleShown ? '-500px' : 'initial'}
            opacity={isSidebarToggleShown ? '0%' : '100%'}
            onMouseDown={handleMouseDown}
            borderRight={`2px solid #E5E5E5`}
            _hover={{ backgroundColor: '#1D9BD1' }}
          />
          <styled.div
            onClick={onRightPanelClick}
            pos="relative"
            h="100%"
            flex={1}
            ref={contentScope}
            right={isSidebarToggleShown ? '-500px' : 'initial'}
            opacity={isSidebarToggleShown ? '0%' : '100%'}>
            {children[1]}
          </styled.div>
        </>
      )}
    </styled.section>
  );
};

export default CustomSplitter;
