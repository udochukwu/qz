import { FileUpload } from '@/components/elements/file-upload';
import { SpinningIcon } from '@/components/spinning-icon';
import { useNewChatWithPendingFiles } from '@/features/chat/hooks/use-new-chat-with-pending-files';
import { ACCEPTED_FILE_TYPES } from '@/features/files-pdf-chunks-sidebar/consts/accepted-files';
import { useTranslation } from 'react-i18next';
import { VStack, styled } from 'styled-system/jsx';
import { useState } from 'react';
interface FileRejection {
  file: File;
  errors: any[];
}

interface FileChangeDetails {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}

interface NewChatUploadProp {
  showFreeText?: boolean;
}

export default function NewChatUpload({ showFreeText }: NewChatUploadProp) {
  const { t } = useTranslation();
  const [uploadKey, setUploadKey] = useState(0);
  const { uploadFiles, isLoading } = useNewChatWithPendingFiles();

  const uploadFile = ({ acceptedFiles }: FileChangeDetails) => {
    setUploadKey(prev => prev + 1);
    uploadFiles(acceptedFiles);
  };

  if (isLoading) {
    return (
      <VStack h="100%" justify="center">
        <styled.h3 textStyle="md" fontWeight="normal" color="#202020">
          {t('chat.fileUpload.loading')}
        </styled.h3>
        <SpinningIcon />
      </VStack>
    );
  }

  return (
    <FileUpload.Root
      onFileChange={uploadFile}
      maxFiles={20}
      borderRadius="md"
      accept={ACCEPTED_FILE_TYPES}
      key={uploadKey}>
      <FileUpload.Dropzone
        py={7}
        bgColor={'white'}
        minH="264px"
        backgroundImage={
          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='rgba(65, 65, 65, 0.12)' stroke-width='4' stroke-dasharray='6%2c8' stroke-dashoffset='20' stroke-linecap='square'/%3e%3c/svg%3e\") !important"
        }
        backgroundRepeat={'no-repeat'}
        backgroundSize={'100% 100%'}
        borderRadius={16}
        cursor="pointer"
        border={0}>
        <VStack gap={4}>
          <VStack gap={3}>
            <styled.img
              mb={5}
              display="flex"
              justifyContent="center"
              alignItems="center"
              src="/images/action-box-thumbnails/chat.jpg"
              width={120}
              height={120}
            />
            <VStack gap={1}>
              <styled.span fontSize={18} textAlign="center">
                <styled.span color="#6d56fa" fontWeight="600" fontSize="19.77px">
                  {t('landing.uploadWizard.fileUpload.title.click')}
                </styled.span>{' '}
                <styled.span color="#15112B80" fontWeight="400" fontSize="19.77">
                  {t('landing.uploadWizard.fileUpload.title.dragAndDrop')}
                </styled.span>
              </styled.span>
              <styled.span textAlign="center" w={showFreeText ? '80%' : 'unset'}>
                <styled.span fontSize="15.38px" color="#15112B80" textAlign="center" fontWeight="400">
                  {t('chat.fileUpload.description')}
                </styled.span>
                {showFreeText && (
                  <styled.span>
                    <styled.span fontSize="15.38px" color="#15112B80" textAlign="center" fontWeight="400">
                      {` - ${t('chat.fileUpload.for')} `}
                    </styled.span>
                    <styled.span fontSize="15.38px" color="#15112B80" textAlign="center" fontWeight="600">
                      {t('chat.fileUpload.free1')}
                    </styled.span>
                  </styled.span>
                )}
              </styled.span>
            </VStack>
          </VStack>
        </VStack>
        <FileUpload.HiddenInput />
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}
