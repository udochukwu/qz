import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { FileListHeader } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/file-list-header';
import {
  allClassTypeFilter,
  allFileTypeFilter,
} from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/file-list-consts';
import {
  extractUniqueClass,
  extractUniqueExtensions,
  filterFiles,
} from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/files-list';
import { NoFiles } from '@/features/files-pdf-chunks-sidebar/files-manager/components/no-files';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useRouter } from 'next13-progressbar';
import { CSSProperties, useState } from 'react';
import { HStack, styled } from 'styled-system/jsx';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { Check } from 'lucide-react';

interface SearchFilters {
  fileType: string | null;
  class: string | null;
}

interface Props {
  files?: WorkspaceFile[];
  isLoading?: boolean;
  isFilterablebyFileType?: boolean;
  isFilterableByClass?: boolean;
  fileListContainerStyles?: CSSProperties;
  onFileClick?: (file: WorkspaceFile) => void;
  selectedFiles?: WorkspaceFile[];
}

export default function FlashcardFiles({
  isLoading,
  files = [],
  isFilterablebyFileType = false,
  isFilterableByClass = false,
  fileListContainerStyles,
  onFileClick,
  selectedFiles = [],
}: Props) {
  const [search, setSearch] = useState<string>('');
  const extensionList = extractUniqueExtensions(files);
  const classList = extractUniqueClass(files);
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFilters>({
    fileType: allFileTypeFilter,
    class: allClassTypeFilter,
  });

  const filteredFiles = filterFiles(search, files, filters);

  const onFilterByFileTypeChange = (types: string[]) => {
    const [selectedType] = types;
    setFilters(prev => ({ ...prev, fileType: selectedType }));
  };

  const onFilterByClassTypeChange = (types: string[]) => {
    const [selectedType] = types;
    setFilters(prev => ({ ...prev, class: selectedType }));
  };

  const goToFlashcard = (file: WorkspaceFile) => {
    if (onFileClick) {
      onFileClick(file);
    } else {
      // Default behavior - navigate to flashcard
      mixpanel.track(EventName.FlashcardStarted, {
        path: window.location.pathname,
        source: 'file_list',
      });
      router.push(`/f/${file.workspace_file_id}`);
    }
  };

  return (
    <styled.div w="100%">
      <styled.div>
        <FileListHeader
          files={files}
          search={search}
          setSearch={setSearch}
          isFilterableByClass={isFilterableByClass}
          isFilterablebyFileType={isFilterablebyFileType}
          extensionList={extensionList}
          classList={classList}
          onFilterByClassTypeChange={onFilterByClassTypeChange}
          onFilterByFileTypeChange={onFilterByFileTypeChange}
          variant={'sidebar'}
        />
      </styled.div>
      <styled.div overflowY="auto" style={fileListContainerStyles}>
        <HStack alignItems="flex-start" flexWrap="wrap" gap={4} w="full">
          {files &&
            files.length > 0 &&
            (filteredFiles && filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => {
                const fileExtension = getFileExtension(file.filename);

                const fileName = extractFileName(file.filename);
                return (
                  <HStack
                    onClick={e => {
                      goToFlashcard(file);
                    }}
                    position="relative"
                    cursor="pointer"
                    p="10px"
                    w={{ md: '70%', lg: '47%' }}
                    borderRadius="12px"
                    border="1px solid #EFEFF0"
                    key={index}
                    backgroundColor={
                      selectedFiles.some(f => f.workspace_file_id === file.workspace_file_id)
                        ? 'rgba(109, 86, 250, 0.1)'
                        : 'transparent'
                    }
                    transition="background-color 0.2s ease-in-out">
                    <FileItemExtension
                      width="28px"
                      height="28px"
                      iconSize={17}
                      fontSize="10.5px"
                      extension={fileExtension}
                    />
                    <styled.div
                      display="flex"
                      justifyContent="flex-start"
                      textAlign="left"
                      alignItems="center"
                      overflow="hidden">
                      <styled.span
                        fontWeight="500"
                        color="#15112B"
                        pb={0}
                        pr={4}
                        fontSize="14px"
                        flexGrow={1}
                        flexShrink={1}
                        maxWidth={'270px'}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis">
                        {fileName}
                      </styled.span>
                      {selectedFiles.some(f => f.workspace_file_id === file.workspace_file_id) && (
                        <styled.div position="absolute" right={2} ml={2} transition="opacity 0.2s ease-in-out">
                          <Check size={16} color="#6D56FA" />
                        </styled.div>
                      )}
                    </styled.div>
                  </HStack>
                );
              })
            ) : (
              <NoFiles isSearch={true} />
            ))}
        </HStack>
      </styled.div>
    </styled.div>
  );
}
