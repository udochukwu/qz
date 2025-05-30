import { FileItem } from './component/file-item/file-item';
import { styled, HStack, VStack } from 'styled-system/jsx';
import { CSSProperties, useState } from 'react';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Table } from '@/components/elements/table';
import { getFileExtension } from '../../util/get-file-extension';
import { allClassTypeFilter, allFileTypeFilter } from './file-list-consts';
import { CRUDFilesPost, GetFilesResponse, UnsavedRecording } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { Checkbox } from '@/components/elements/checkbox';
import { SwitchCheckedChangeDetails } from '@ark-ui/react';
import { useQueryClient } from 'react-query';
import { getFilesQueryKey } from '@/features/files-pdf-chunks-sidebar/utils/get-files-query-key';
import { UploadFiles } from '../upload-files';
import { FileListHeader } from './component/file-list-header';
import { Skeleton } from '@/components/elements/skeleton';
import { NoFiles } from '../no-files';
import { FileChangeDetails } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-file-upload';
import OnboardingInfoModal from '@/components/onboarding-modal';
import { ArrowDown, ArrowUp, FolderOpen } from 'lucide-react';
import { UnsavedRecordingItem } from './component/file-item/unsaved-recording-item';
import { useTranslation } from 'react-i18next';
import QuizView from '@/features/quiz/components/quiz-view';

interface Props {
  files?: WorkspaceFile[];
  unsavedRecordings?: UnsavedRecording[];
  crudPayload?: CRUDFilesPost;
  isLoading?: boolean;
  isFilterablebyFileType?: boolean;
  isFileViewToggleEnabled?: boolean;
  isMultiSelectEnabled?: boolean;
  isFilterableByClass?: boolean;
  isFileUploadEnabled?: boolean;
  expandFile: (file: WorkspaceFile) => void;
  openImportFromCourseGPTEnabled?: VoidFunction;
  fileListContainerStyles?: CSSProperties;
  excludeFiles?: CRUDFilesPost;
  uploadingController?: {
    uploadFiles: (files: FileChangeDetails) => void;
  };
  variant?: 'default' | 'sidebar';
}

interface SearchFilters {
  fileType: string | null;
  class: string | null;
}

export function FilesList({
  isLoading,
  files = [],
  unsavedRecordings = [],
  crudPayload,
  isFilterablebyFileType = false,
  isFileViewToggleEnabled = false,
  isMultiSelectEnabled = false,
  isFilterableByClass = false,
  isFileUploadEnabled = false,
  expandFile,
  openImportFromCourseGPTEnabled,
  fileListContainerStyles,
  excludeFiles,
  uploadingController,
  variant = 'default',
}: Props) {
  const { t } = useTranslation();

  const [search, setSearch] = useState<string>('');

  const [filters, setFilters] = useState<SearchFilters>({
    fileType: allFileTypeFilter,
    class: allClassTypeFilter,
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredFiles = filterFiles(search, files, filters);

  const extensionList = extractUniqueExtensions(files);

  const classList = extractUniqueClass(files);

  const onFilterByFileTypeChange = (types: string[]) => {
    const [selectedType] = types;
    setFilters(prev => ({ ...prev, fileType: selectedType }));
  };

  const onFilterByClassTypeChange = (types: string[]) => {
    const [selectedType] = types;
    setFilters(prev => ({ ...prev, class: selectedType }));
  };

  const queryClient = useQueryClient();

  const filesQueryKey = getFilesQueryKey(crudPayload, excludeFiles);

  const isAllFilesSelected = files.length > 0 && files.every(file => file.isSelected);

  const onSelectAllFileItems = (details: SwitchCheckedChangeDetails) => {
    queryClient.setQueryData<GetFilesResponse>(filesQueryKey, prev => {
      const prevFiles = prev?.files ?? [];
      return {
        files: prevFiles.map(traversedFile => {
          return { ...traversedFile, isSelected: details.checked };
        }),
      };
    });
  };

  // Sorting function
  const sortFiles = (fileList: WorkspaceFile[], order: 'asc' | 'desc') => {
    return [...fileList].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const sortedFiles = sortFiles(filteredFiles, sortOrder);

  const onUploadDateHeaderClick = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <>
      <styled.section height="100%" w="100%" pos="relative">
        <VStack w="100%" gap={4} bg="inherit">
          {isFileUploadEnabled && (
            <UploadFiles
              uploadingController={uploadingController}
              uploadFilePayload={crudPayload}
              openImportFromCourseGPTEnabled={openImportFromCourseGPTEnabled}
              variant={variant}
            />
          )}
          <FileListHeader
            excludeFiles={excludeFiles}
            crudPayload={crudPayload}
            files={files}
            search={search}
            setSearch={setSearch}
            isFilterableByClass={isFilterableByClass}
            isFilterablebyFileType={isFilterablebyFileType}
            extensionList={extensionList}
            classList={classList}
            isMultiSelectEnabled={isMultiSelectEnabled}
            onFilterByClassTypeChange={onFilterByClassTypeChange}
            onFilterByFileTypeChange={onFilterByFileTypeChange}
            variant={variant}
          />
        </VStack>
        <Skeleton isLoaded={!isLoading}>
          {variant === 'default' ? (
            <styled.div
              display={'flex'}
              flexDirection={'column'}
              height="100%"
              backgroundColor={'white'}
              borderRadius={12}
              borderRight={'1.1px solid rgba(21, 17, 43, 0.1)'}
              borderLeft={'1.1px solid rgba(21, 17, 43, 0.1)'}
              borderBottom={'1.1px solid rgba(21, 17, 43, 0.1)'}
              borderTop={0}
              borderTopRadius={0}
              style={fileListContainerStyles}
              paddingX={'43px'}>
              <styled.div overflowY={'auto'} height={'100%'}>
                <Table.Root
                  borderBottom={'1.1px solid rgba(21, 17, 43, 0.1)'}
                  width={'100%'}
                  height={filteredFiles.length === 0 ? '100%' : 'auto'}
                  style={{ tableLayout: 'fixed' }}>
                  <Table.Head pos="sticky" top={0} bg="white">
                    <Table.Row>
                      <Table.Header textStyle="sm" width={isMultiSelectEnabled ? '40%' : '50%'}>
                        <HStack>
                          {isMultiSelectEnabled && (
                            <Checkbox
                              borderColor={'#D0D5DD33'}
                              checked={isAllFilesSelected}
                              onCheckedChange={onSelectAllFileItems}
                            />
                          )}
                          <styled.span color={'#999999'}>{t('common.name')}</styled.span>
                        </HStack>
                      </Table.Header>
                      <Table.Header textStyle="sm" width="25%">
                        <styled.div
                          display="flex"
                          flexDirection={'row'}
                          color={'#999999'}
                          cursor={'pointer'}
                          onClick={onUploadDateHeaderClick}
                          alignItems={'center'}>
                          <styled.span marginRight={'5px'}>{t('files.list.uploadDate')}</styled.span>
                          {sortOrder === 'asc' ? (
                            <ArrowUp size={16} className="h-[18px] w-[18px]" color="#475467" />
                          ) : (
                            <ArrowDown size={16} className="h-[18px] w-[18px]" color="#475467" />
                          )}
                        </styled.div>
                      </Table.Header>
                      <Table.Header textStyle="sm" width={isFilterableByClass ? '15%' : '25%'}></Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body h={'100%'}>
                    {unsavedRecordings &&
                      unsavedRecordings.length > 0 &&
                      unsavedRecordings.map(recording => (
                        <UnsavedRecordingItem
                          key={recording.file_id}
                          recording={recording}
                          expandFile={expandFile}
                          crudPayload={crudPayload}
                          isMultiSelectEnabled={isMultiSelectEnabled}
                        />
                      ))}
                    {files && files.length > 0 ? (
                      sortedFiles && sortedFiles.length > 0 ? (
                        sortedFiles.map(file => (
                          <FileItem
                            expandFile={expandFile}
                            key={file.workspace_file_id}
                            file={file}
                            crudPayload={crudPayload}
                            excludeFiles={excludeFiles}
                            isFilterableByClass={isFilterableByClass}
                            isFileViewToggleEnabled={isFileViewToggleEnabled}
                            isMultiSelectEnabled={isMultiSelectEnabled}
                          />
                        ))
                      ) : (
                        <Table.Row height={'100%'}>
                          <Table.Cell colSpan={isFilterableByClass ? 4 : 3} height={'100%'}>
                            <NoFiles isSearch={true} />
                          </Table.Cell>
                        </Table.Row>
                      )
                    ) : (
                      <Table.Row height={'100%'}>
                        <Table.Cell colSpan={isFilterableByClass ? 4 : 3} height={'100%'}>
                          <NoFiles />
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </styled.div>
            </styled.div>
          ) : (
            <VStack width={'100%'} alignItems={'center'} maxH={'45vh'} overflowY={'auto'}>
              <Table.Root>
                <Table.Body>
                  {files &&
                    files.length > 0 &&
                    (filteredFiles && filteredFiles.length > 0 ? (
                      filteredFiles.map(file => (
                        <FileItem
                          expandFile={expandFile}
                          expandOn="click"
                          file={file}
                          key={file.workspace_file_id}
                          isMultiSelectEnabled={isMultiSelectEnabled}
                          isFileViewToggleEnabled={isFileViewToggleEnabled}
                          variant="sidebar"
                        />
                      ))
                    ) : (
                      <Table.Row height={'100%'} _hover={{ backgroundColor: 'transparent' }}>
                        <Table.Cell height={'100%'}>
                          <NoFiles isSearch={true} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>
            </VStack>
          )}
        </Skeleton>
      </styled.section>
      <QuizView hideTrigger />
    </>
  );
}

export function filterFiles(query: string, files: WorkspaceFile[] | undefined, filters: SearchFilters) {
  return (
    files
      ?.filter(file => file.filename.toLowerCase().includes(query.toLowerCase()))
      .filter(file => !file.uploadingFile)
      .filter(file => {
        if (filters?.fileType && filters.fileType !== allFileTypeFilter) {
          const extType = getFileExtension(file.filename);
          return extType === filters.fileType;
        }
        return true;
      })
      .filter(file => {
        if (filters?.class && filters.class !== allClassTypeFilter) {
          if (Array.isArray(file.class_name)) {
            return file.class_name.includes(filters.class);
          } else {
            return file.class_name === filters.class;
          }
        }
        return true;
      }) ?? []
  );
}

export function extractUniqueExtensions(fileList: WorkspaceFile[]): string[] {
  const extensionsSet: Set<string> = new Set();

  fileList.forEach(file => {
    const extension = getFileExtension(file.filename);
    extensionsSet.add(extension);
  });

  return Array.from(extensionsSet);
}

export function extractUniqueClass(fileList: WorkspaceFile[]): string[] {
  const set: Set<string> = new Set();
  fileList.forEach(file => {
    if (file.class_name) {
      if (Array.isArray(file.class_name)) {
        file.class_name.forEach(className => set.add(className));
      } else {
        set.add(file.class_name);
      }
    }
  });
  return Array.from(set);
}
