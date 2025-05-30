'use client';

import { ReactNode } from 'react';
import { styled } from 'styled-system/jsx';
import { FilesSideBar } from '@/features/files-pdf-chunks-sidebar/files-chunks-pdf-side-bar';
import { useSplitterStore } from '@/stores/splitter-api-store';
import { useSideBarRouteStore } from '@/features/files-pdf-chunks-sidebar/stores/side-bar-router';
import { SideBarRoutes } from '@/features/files-pdf-chunks-sidebar/types/types';
import { motion } from 'framer-motion';
import CustomSplitter from '@/components/custom-splitter';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function QuizSessionLayout({ children }: { children: ReactNode }) {
  const chatSize = useSplitterStore(state => state.chatSize);
  const pathname = usePathname();
  const currentRoute = useSideBarRouteStore(state => state.currentRoute);
  const setCurrentRoute = useSideBarRouteStore(state => state.setCurrentRoute);
  const showFileViewer = currentRoute === SideBarRoutes.FILE_VIEW || currentRoute === SideBarRoutes.VIDEO_VIEW;

  useEffect(() => {
    setCurrentRoute(SideBarRoutes.FILE_CHUNKS_ROUTE);
  }, [pathname, setCurrentRoute]);

  return (
    <styled.div display="flex" height="100vh" width="100%" overflow="hidden" position="relative">
      <styled.section display="flex" h="100vh" w="100%" bg="#F8F8F9" overflow="clip">
        <CustomSplitter containerStyles={{ width: '100%' }} isToggleable={{ isToggled: showFileViewer }}>
          {children}
          <FilesSideBar />
        </CustomSplitter>
      </styled.section>
    </styled.div>
  );
}
