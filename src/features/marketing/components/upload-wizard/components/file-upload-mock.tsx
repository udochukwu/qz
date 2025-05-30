'use client';
import React, { useState } from 'react';
import { FileUpload } from '@/components/elements/file-upload';
import { VStack, styled } from 'styled-system/jsx';
import { useRouter } from 'next13-progressbar';
import { UploadIcon } from './upload-icon';
import { useTranslation } from 'react-i18next';

const FileUploadMock = () => {
  const { t } = useTranslation();
  const [uploadKey, setUploadKey] = useState(0);
  const router = useRouter();

  return (
    <styled.div p={{ sm: 4, base: 0 }} bg="white" borderRadius="2xl" border="1px solid #6c56fa20">
      <FileUpload.Root
        maxFiles={20}
        display="flex"
        h="100%"
        onFileChange={() => {
          setUploadKey(prev => prev + 1);
          router.push('/auth/login?source_button=upload_file_modal');
        }}
        w="100%"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        key={uploadKey}
        p={{ sm: 2, base: 4 }}>
        <FileUpload.Dropzone border="2px dashed #A294FA" borderRadius="2xl" minH="300px" bg="white" w="100%" p={4}>
          <VStack color="#475467" gap={1}>
            <UploadIcon />
            <styled.h3 textStyle="lg" fontWeight="normal" color="#202020">
              <styled.span fontWeight="600" textDecoration="underline" color="#6D56FA">
                {t('landing.uploadWizard.fileUpload.title.click')}
              </styled.span>
              <styled.br display={{ sm: 'none', base: 'block' }} />
              <span>&nbsp;{t('landing.uploadWizard.fileUpload.title.dragAndDrop')}</span>
            </styled.h3>
            <styled.p textStyle="medium">
              <span>{t('chat.fileUpload.description')} -</span>{' '}
              <styled.span fontWeight="600">{t('chat.fileUpload.free')}</styled.span>
            </styled.p>
          </VStack>
          <FileUpload.HiddenInput />
        </FileUpload.Dropzone>
      </FileUpload.Root>
    </styled.div>
  );
};

export default FileUploadMock;
