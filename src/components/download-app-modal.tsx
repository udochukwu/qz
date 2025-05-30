'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { HStack, styled, Box, VStack } from 'styled-system/jsx';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { useSettledFilesStore } from '@/features/files-pdf-chunks-sidebar/stores/settled-files-store';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useSession } from 'next-auth/react';
import { useUploadBarState } from '@/hooks/useUploadBarState';
import { motion } from 'framer-motion';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';

const COOKIE_NAME = 'show-download-modal';
const COOKIE_EXPIRY_DAYS = 90;
const UPLOAD_FILES_PROGRESS_TITLE_HEIGHT = 40;
const UPLOAD_FILES_PROGRESS_BODY_HEIGHT = 79;

const DownloadAppBanner = () => {
  const { t } = useTranslation();
  const { status } = useSession();

  const { isExpanded } = useUploadBarState();

  const { data: fileList } = useFiles();
  const files = fileList?.files ?? [];
  const { settledFiles } = useSettledFilesStore();
  const uploadingFiles = files.filter(file => file.status === WorkspaceFileUploadStatus.UPLOADING);

  const displayedSettledFiles = settledFiles
    .filter(settledFile => !uploadingFiles.some(file => file.workspace_file_id === settledFile.workspace_file_id))
    .filter(
      file => file.status === WorkspaceFileUploadStatus.FINISHED || file.status === WorkspaceFileUploadStatus.FAILED,
    );

  const displayedPendingFiles = [...uploadingFiles, ...displayedSettledFiles].reduce((acc, file) => {
    const existingFileIndex = acc.findIndex(f => f.workspace_file_id === file.workspace_file_id);

    if (existingFileIndex !== -1) {
      const existingFile = acc[existingFileIndex];

      // Function to determine which file to keep
      const shouldReplaceFile = (newFile: WorkspaceFile, oldFile: WorkspaceFile) => {
        if (newFile.status === WorkspaceFileUploadStatus.FINISHED) return true;
        if (oldFile.status === WorkspaceFileUploadStatus.FINISHED) return false;
        if (newFile.status === WorkspaceFileUploadStatus.FAILED && oldFile.status !== WorkspaceFileUploadStatus.FAILED)
          return true;
        if (oldFile.status === WorkspaceFileUploadStatus.FAILED && newFile.status !== WorkspaceFileUploadStatus.FAILED)
          return false;
        return newFile.created_at > oldFile.created_at;
      };

      if (shouldReplaceFile(file, existingFile)) {
        acc[existingFileIndex] = file;
      }
    } else {
      // If there's no existing file with this workspace_file_id, add the new file
      acc.push(file);
    }

    return acc;
  }, [] as WorkspaceFile[]);

  const isFileWindowVisible = files !== undefined && Object.keys(displayedPendingFiles).length > 0;
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    // Set the cookie to expire in 90 days
    mixpanel.track(EventName.DownloadAppModalClosed);
    Cookies.set(COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY_DAYS });
    setIsVisible(false);
  };

  const handleOpenAppStore = () => {
    mixpanel.track(EventName.MobileAppDownloadClicked);
    window.open('https://apps.apple.com/us/app/unstuck-ai-note-taker/id6714484560', '_blank');
  };

  useEffect(() => {
    // Check if the modal should be displayed
    const cookie = Cookies.get(COOKIE_NAME);
    if (!cookie) {
      setIsVisible(true);
    }
  }, []);

  const bottomPosValue = useMemo(() => {
    if (!isExpanded) {
      return UPLOAD_FILES_PROGRESS_TITLE_HEIGHT + 40;
    }

    if (!displayedPendingFiles.length || displayedPendingFiles.length === 1) {
      return 160;
    }

    return UPLOAD_FILES_PROGRESS_BODY_HEIGHT * displayedPendingFiles?.length + UPLOAD_FILES_PROGRESS_TITLE_HEIGHT;
  }, [displayedPendingFiles, isExpanded]);
  const isUserAuthenticated = status === 'authenticated';

  return (
    <>
      {isVisible ? (
        <motion.section
          animate={{
            bottom: isFileWindowVisible && isUserAuthenticated ? `${bottomPosValue}px` : '40px',
          }}
          className={css({
            pos: 'fixed',
            right: '5',
            zIndex: 10,
          })}>
          <Box
            width="280px"
            display={{ base: 'none', md: 'flex' }}
            flexDirection="column"
            gap="4"
            zIndex={2000}
            backgroundColor="white"
            rounded="14px"
            shadow="lg"
            px={4}
            py={3}
            justifyContent="space-between"
            alignItems="center">
            <VStack w="100%">
              <Image
                alt="unstuck-vector"
                src="/images/unstuck-vector.png"
                width={300}
                height={300}
                className={css({
                  position: 'absolute',
                  bottom: '7',
                  pointerEvents: 'none',
                })}
              />
              <HStack w="100%" justify="space-between">
                <Image
                  src="/images/phone-round.png"
                  width={40}
                  height={40}
                  alt="Unstuck App Icon"
                  style={{ borderRadius: '10px' }}
                />
                <X onClick={handleClose} color="#00000066" cursor="pointer" />
              </HStack>
              <Box position="relative" flexShrink={0}>
                <Image
                  src="/images/download-qr.png"
                  width={100}
                  height={100}
                  alt="Unstuck App Icon"
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    height: '100%',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    border: '1px solid #6D56FA30',
                    padding: 4,
                    backgroundColor: 'white',
                  }}
                />
              </Box>
            </VStack>

            <VStack w="100%">
              <styled.p
                mb="0"
                fontWeight="500"
                fontSize={{ base: '1.1rem' }}
                lineHeight={{ base: '1.3rem' }}
                textAlign="center">
                {t('common.downloadApp.useMobileApp')}
              </styled.p>
              <styled.p mt="0" color="gray" fontSize={{ base: '0.8rem' }} textAlign="center">
                {t('common.downloadApp.takeYourLearning')}
              </styled.p>
            </VStack>
            <styled.button
              onClick={handleOpenAppStore}
              display="flex"
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
              gap="2"
              backgroundColor="#6D56FA"
              color="white"
              py="2"
              px="4"
              width="100%"
              borderRadius="md"
              fontWeight="500"
              fontSize={{ base: '0.8rem' }}
              _hover={{
                backgroundColor: '#5A46E5',
              }}
              transition="all 0.2s">
              {t('common.downloadApp.openInAppStore')}
              <ArrowUpRight size={18} />
            </styled.button>
          </Box>
        </motion.section>
      ) : null}
    </>
  );
};

export default DownloadAppBanner;
