import { PageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { SearchPlugin } from '@react-pdf-viewer/search';
import { Tooltip, Position } from '@react-pdf-viewer/core';
import { Box } from 'styled-system/jsx';
import SearchPopover from './search/search-popover';
import { ZoomPlugin } from '@react-pdf-viewer/zoom';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import { ScanIcon } from 'lucide-react';
import { IconButton } from '@/components/elements/icon-button';
import { useTranslation } from 'react-i18next';

const PageNavigationBar = ({
  pageNavigationPluginInstance,
  searchPluginInstance,
  zoomPluginInstance,
}: {
  pageNavigationPluginInstance: PageNavigationPlugin;
  searchPluginInstance: SearchPlugin;
  zoomPluginInstance: ZoomPlugin;
}) => {
  const { t } = useTranslation();

  const { CurrentPageInput, NumberOfPages } = pageNavigationPluginInstance;
  const { ZoomInButton, ZoomOutButton, zoomTo } = zoomPluginInstance;

  return (
    <Box flexDirection="row" flex={1} width={'100%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
      <Box flexDirection="row" flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
        <ZoomOutButton />
        <Tooltip
          position={Position.BottomCenter}
          target={
            <IconButton
              onClick={() => zoomTo(SpecialZoomLevel.PageFit)}
              variant="ghost"
              aria-label={t('common.fitToPage')}
              size={'sm'}>
              <ScanIcon />
            </IconButton>
          }
          content={() => t('common.fitToPage')}
          offset={{ left: 0, top: 8 }}
        />
        <ZoomInButton />
        <CurrentPageInput />
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <NumberOfPages />
      </Box>
      <Box ml={1}>
        <SearchPopover searchPluginInstance={searchPluginInstance} />
      </Box>
    </Box>
  );
};

export default PageNavigationBar;
