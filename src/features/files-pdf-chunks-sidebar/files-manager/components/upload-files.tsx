import { FileUpload } from '@/components/elements/file-upload';
import { LaptopIcon, PlusIcon } from 'lucide-react';
import { FileChangeDetails } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-file-upload';
import { CRUDFilesPost } from '../../types/api-types';
import { HStack, styled, VStack } from 'styled-system/jsx';
import UploadYoutubeButton from '@/features/upload-youtube/components/UploadYoutubeButton';
import { useUserStore } from '@/stores/user-store';
import { FileUploadIcon } from './files-list/component/file-upload-icon';
import { ACCEPTED_FILE_TYPES } from '../../consts/accepted-files';
import { Select } from '@/components/elements/select';
import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { css } from 'styled-system/css';

interface Props {
  fileUploadProps?: FileUpload.RootProps;
  uploadFilePayload?: CRUDFilesPost;
  openImportFromCourseGPTEnabled?: VoidFunction;
  uploadingController?: {
    uploadFiles: (files: FileChangeDetails) => void;
  };
  variant?: 'default' | 'sidebar';
  showFromUploadedFilesOption?: boolean;
}
export function UploadFiles({
  fileUploadProps,
  uploadFilePayload,
  openImportFromCourseGPTEnabled,
  uploadingController,
  variant = 'default',
  showFromUploadedFilesOption = true,
}: Props) {
  const { t } = useTranslation();
  const { impersonated } = useUserStore();
  // Use a key to force re-render of the FileUpload component. This is used to force the component to re-mount when the language modal is closed.
  const [uploadKey, setUploadKey] = useState(0);

  const VectorIcon = () => (
    <svg width="18" height="18" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.03206 11C0.869334 6.1796 1.16856 1 5.73472 1C9.53238 1 10.5263 4.15352 10.5082 6.44069C10.454 7.96849 9.91374 10.4311 8.33856 10.4311C6.5 10.4311 5.06481 1.07081 14.6539 2.69834"
        stroke="#15112B"
        strokeOpacity="0.9"
        strokeWidth="1.72407"
      />
    </svg>
  );
  const defaultSVG = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='rgba(65, 65, 65, 0.12)' stroke-width='4' stroke-dasharray='10%2c14' stroke-dashoffset='37' stroke-linecap='square'/%3e%3c/svg%3e")`;
  const otherSVG = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='rgba(176, 176, 176, 0.4)' stroke-width='4' stroke-dasharray='10%2c14' stroke-dashoffset='37' stroke-linecap='square'/%3e%3c/svg%3e")`;
  const isSelectMenuOpen = useBoolean(false);

  const selectItems = [
    { id: 'computer', label: t('chat.dragToUpload.select.computer') },
    ...(showFromUploadedFilesOption ? [{ id: 'uploaded', label: t('chat.dragToUpload.select.files') }] : []),
    { id: 'youtube', label: t('chat.dragToUpload.select.youtube') },
  ];

  return (
    <FileUpload.Root
      key={uploadKey}
      {...fileUploadProps}
      disabled={impersonated}
      onFileChange={acceptedFiles => {
        setUploadKey(prev => prev + 1);
        uploadingController?.uploadFiles?.({ acceptedFiles: acceptedFiles.acceptedFiles });
      }}
      maxFiles={20}
      accept={ACCEPTED_FILE_TYPES}
      bgColor={'white'}
      borderRadius={variant === 'default' ? 12 : 0}
      marginBottom={'10px'}>
      <styled.div
        py="50px"
        minH="100px"
        backgroundImage={variant === 'default' ? defaultSVG : otherSVG}
        onClick={() => isSelectMenuOpen.setValue(!isSelectMenuOpen.value)}
        backgroundRepeat={'no-repeat'}
        backgroundSize={'100% 100%'}
        borderRadius={12}
        textAlign={'center'}>
        <VStack gap={4}>
          <VStack gap={3}>
            <FileUploadIcon />
            {variant === 'default' ? (
              <VStack gap={1}>
                <styled.span fontSize={18}>
                  <styled.span color={'#6d56fa'} fontWeight={'600'}>
                    {t('landing.uploadWizard.fileUpload.title.click')}
                  </styled.span>{' '}
                  <styled.span color="#15112B80">{t('landing.uploadWizard.fileUpload.title.dragAndDrop')}</styled.span>
                </styled.span>
                <styled.span fontSize={14} color="#15112B80">
                  <span>
                    {t('chat.fileUpload.description')} - {t('common.for')}
                  </span>{' '}
                  <styled.span fontWeight={'600'}>{t('chat.dragToUpload.free')}</styled.span>
                </styled.span>
              </VStack>
            ) : (
              <>
                <styled.span fontWeight={'normal'} fontSize={'sm'} color={'#151129'}>
                  {t('chat.dragToUpload.select.base')}
                </styled.span>
              </>
            )}
          </VStack>
          <FileUpload.Dropzone display={'none'} />
          <Select.Root
            w={'70%'}
            positioning={{ sameWidth: true }}
            open={isSelectMenuOpen.value}
            onOpenChange={details => isSelectMenuOpen.setValue(details.open)}
            items={selectItems}>
            <Select.Control>
              <Select.Trigger
                borderColor="#4141410D"
                borderRadius={'12px'}
                justifyContent="center"
                textAlign="center"
                display="inline-flex"
                width="auto"
                padding="10px 28px"
                shadow="sm"
                marginTop={'14px'}
                color="#3E3C46"
                className={`file-manager ${css({
                  '&:hover svg': {
                    color: '#6D56FA',
                  },
                })}`}
                _hover={{ color: '#6D56FA', backgroundColor: '#6D56FA1F' }}
                onClick={event => event.stopPropagation()}>
                <HStack gap="10px" display="inline-flex">
                  <PlusIcon size={10} />
                  <Select.ValueText
                    textStyle="sm"
                    fontSize="15px"
                    placeholder={t('chat.dragToUpload.select.placeholder')}
                    textAlign="center"
                    fontWeight={500}
                  />
                </HStack>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                <Select.ItemGroup id="uploads">
                  <FileUpload.Trigger asChild onClick={e => e.stopPropagation()}>
                    <Select.Item key={'From Computer'} item={selectItems.find(i => i.id === 'computer')?.id} w={'100%'}>
                      <HStack gap={2}>
                        <LaptopIcon color="rgba(21, 17, 43, 0.9)" size={18} />
                        <Select.ItemText textStyle={'sm'} textAlign="start">
                          {t('chat.dragToUpload.select.computer')}
                        </Select.ItemText>
                      </HStack>
                    </Select.Item>
                  </FileUpload.Trigger>
                  {showFromUploadedFilesOption && (
                    <Select.Item
                      key={'uploaded'}
                      item={selectItems.find(i => i.id === 'uploaded')?.id}
                      w={'100%'}
                      onClick={openImportFromCourseGPTEnabled}>
                      <HStack gap={2}>
                        <VectorIcon />
                        <Select.ItemText textStyle={'sm'} textAlign="start">
                          {t('chat.dragToUpload.select.files')}
                        </Select.ItemText>
                      </HStack>
                    </Select.Item>
                  )}
                  <UploadYoutubeButton variant="sidebar" crudPayload={uploadFilePayload} disabled={impersonated} />
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </VStack>
      </styled.div>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
