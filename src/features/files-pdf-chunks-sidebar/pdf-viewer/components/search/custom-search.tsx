import { RenderSearchProps, SearchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import React, { useState } from 'react';
import { Input } from '@/components/elements/input';
import { Box } from 'styled-system/jsx';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { IconButton } from '@/components/elements/icon-button';
import { useTranslation } from 'react-i18next';

interface CustomSearchProps {
  searchPluginInstance: SearchPlugin;
}

export default function CustomSearch({ searchPluginInstance }: CustomSearchProps) {
  const { t } = useTranslation();

  const { Search } = searchPluginInstance;
  const [readyToSearch, setReadyToSearch] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  return (
    <Search>
      {(renderSearchProps: RenderSearchProps) => {
        return (
          <Box flexDirection="row" alignItems="center" display={'flex'} gap={1}>
            <Input
              placeholder={t('common.enterToSearch')}
              size={'sm'}
              value={renderSearchProps.keyword}
              onChange={e => {
                setReadyToSearch(false);
                renderSearchProps.setKeyword(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (renderSearchProps.keyword && renderSearchProps.keyword !== lastSearchTerm) {
                    setLastSearchTerm(renderSearchProps.keyword);
                    setReadyToSearch(true);
                    renderSearchProps.search();
                  } else if (renderSearchProps.keyword === lastSearchTerm) {
                    renderSearchProps.jumpToNextMatch();
                  }
                }
              }}
            />
            {readyToSearch && renderSearchProps.keyword && renderSearchProps.numberOfMatches >= 0 && (
              <div style={{ padding: '0 8px' }}>
                {renderSearchProps.currentMatch}/{renderSearchProps.numberOfMatches}
              </div>
            )}
            <IconButton variant="ghost" onClick={renderSearchProps.jumpToPreviousMatch} size={'sm'}>
              <ChevronUpIcon />
            </IconButton>

            <IconButton variant="ghost" onClick={renderSearchProps.jumpToNextMatch} size={'sm'}>
              <ChevronDownIcon />
            </IconButton>
          </Box>
        );
      }}
    </Search>
  );
}
