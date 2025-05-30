import React, { ReactNode } from 'react';
import { Viewer, Worker, SpecialZoomLevel, RenderPage } from '@react-pdf-viewer/core';
import { ChevronLeftIcon, MessageCircleMoreIcon } from 'lucide-react';
import { PageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { HStack, VStack, styled, Divider, Box } from 'styled-system/jsx';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Button } from '@/components/elements/button';
import { SpinningIcon } from '@/components/spinning-icon';
import { IconButton } from '@/components/elements/icon-button';
import { getPageName } from '@/utils/page-name-utils';
import PageNavigationBar from './pdf-viewer/components/page-navigation-bar';
import { searchPlugin } from '@react-pdf-viewer/search';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { token } from 'styled-system/tokens';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose?: VoidFunction;
  file: WorkspaceFile;
  renderPage?: RenderPage;
  initialPage?: number;
  pageNavigationPluginInstance?: PageNavigationPlugin;
}

export const PreviewEntireFile = ({ file, onClose, renderPage, initialPage, pageNavigationPluginInstance }: Props) => {
  const { t } = useTranslation();

  const { mutate: createChat, isLoading } = useCreateChat();

  const onCreateChat = () => {
    createChat({ workspace_file_ids: [file.workspace_file_id] });
  };
  const searchPluginInstance = searchPlugin();
  const zoomPluginInstance = zoomPlugin();

  const unifiedPlugins = [searchPluginInstance, zoomPluginInstance];

  const plugins = pageNavigationPluginInstance
    ? [...unifiedPlugins, pageNavigationPluginInstance]
    : [...unifiedPlugins];

  // Modified onClose function to include Statsig logging
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    mixpanel.track(EventName.FileUnexpanded, {
      fileId: file.workspace_file_id,
      page: getPageName(window.location.pathname),
      path: window.location.pathname,
    });
  };

  return (
    <VStack p={4} overflowY="clip" h="100vh">
      <HStack w="100%" justify="space-between">
        <Box flexDirection="row" flex={1} display={'flex'} alignItems={'center'}>
          <IconButton variant="ghost" onClick={handleClose}>
            <ChevronLeftIcon size={20} color="#292829" />
          </IconButton>
          <Box
            fontSize={14}
            fontWeight="semibold"
            maxW="200px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {file.filename}
          </Box>
        </Box>
        <Button
          variant="ghost"
          color={'quizard.black'}
          bg={'rgba(21, 17, 43, 0.05)'}
          onClick={onCreateChat}
          textStyle="sm"
          disabled={isLoading}>
          {isLoading ? <SpinningIcon /> : <MessageCircleMoreIcon size={12} color={token('colors.quizard.black')} />}
          <span>{t('common.startChat')}</span>
        </Button>
      </HStack>
      <Divider />
      {pageNavigationPluginInstance && (
        <PageNavigationBar
          pageNavigationPluginInstance={pageNavigationPluginInstance}
          searchPluginInstance={searchPluginInstance}
          zoomPluginInstance={zoomPluginInstance}
        />
      )}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
        <styled.div css={{ height: '100vh', width: '100%', display: 'flex', overflow: 'clip' }}>
          <Viewer
            fileUrl={file.url}
            plugins={plugins}
            defaultScale={SpecialZoomLevel.PageFit}
            renderPage={renderPage}
            initialPage={initialPage}
          />
        </styled.div>
      </Worker>
    </VStack>
  );
};
