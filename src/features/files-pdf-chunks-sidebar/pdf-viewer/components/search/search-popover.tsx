import React, { useEffect, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Box, Stack } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { Popover } from '@/components/elements/popover';
import { SearchPlugin } from '@react-pdf-viewer/search';
import CustomSearch from './custom-search';
import { useTranslation } from 'react-i18next';

interface SearchPopoverProps {
  searchPluginInstance: SearchPlugin;
}

const SearchPopover = ({ searchPluginInstance }: SearchPopoverProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };
  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <IconButton aria-label={t('common.openSearch')} variant="ghost" size={'sm'}>
          <SearchIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Stack gap="1">
            <CustomSearch searchPluginInstance={searchPluginInstance} />
          </Stack>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};

export default SearchPopover;
