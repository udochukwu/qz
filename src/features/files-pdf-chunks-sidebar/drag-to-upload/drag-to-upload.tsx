'use client';
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { styled, VStack } from 'styled-system/jsx';
import { useBoolean } from '@/hooks/use-boolean';
import { ACCEPTED_FILE_TYPES, ACCEPTED_FILE_TYPES_DROPZONE } from '../consts/accepted-files';
import toast from 'react-hot-toast';
import { DragIcon } from './components/drag-icon';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
}

export function DragToUpload({ onDrop }: Props) {
  const { t } = useTranslation();

  const onDropCallback = useCallback(onDrop, [onDrop]);
  const pathname = usePathname();
  const params = useSearchParams();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onDropCallback,
    noClick: true,
    onDropRejected: filesRejected => {
      filesRejected.forEach(file => {
        const fileType = file.file.type;
        toast.error(t('chat.dragToUpload.error', { fileType, acceptedFileTypes: ACCEPTED_FILE_TYPES }));
      });
    },
    accept: ACCEPTED_FILE_TYPES_DROPZONE,

    onDragLeave: e => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Check if relatedTarget is outside the drag area
      if (target && relatedTarget && !target.contains(relatedTarget)) {
        isDragging.setFalse();
      }
    },
  });

  const isHydrated = useBoolean();

  useEffect(() => {
    isHydrated.setTrue();
  }, []);

  const isDragging = useBoolean();

  useEffect(() => {
    if (!isDragActive) {
      isDragging.setFalse();
    }
  }, [isDragActive]);

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.setTrue();
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const isOnBadPath = pathname === '/' && params.get('tab') === 'Record' && params.get('recording') === 'true';
  const isRendered = typeof window === 'object' && isHydrated.value && !isOnBadPath;

  useEffect(() => {
    if (!isOnBadPath) {
      isDragging.setFalse();
    }
  }, [isOnBadPath]);

  return (
    <>
      {isRendered &&
        ReactDOM.createPortal(
          <styled.div
            {...getRootProps()}
            pos="absolute"
            top={0}
            left={0}
            w="100%"
            h="100svh"
            overflow="hidden"
            backdropFilter={isDragActive ? 'auto' : 'none'}
            backdropBlur={isDragActive ? 'lg' : 'none'}
            bg={isDragActive ? '#15112b60' : 'transparent'}
            zIndex={9999999999999}
            display="flex"
            pointerEvents={isDragging.value ? 'all' : 'none'}
            justifyContent="center"
            alignItems="center">
            {isDragging.value && (
              <styled.div pos="absolute" top="0" left="0" w="100%" h="100svh" bg="#0000003fF" pointerEvents="none" />
            )}
            <styled.input {...getInputProps()} />
            {isDragActive && (
              <VStack pointerEvents="none" color="white">
                <DragIcon />
                <styled.span textStyle="2xl" fontWeight="semibold">
                  {t('chat.dragToUpload.title')}
                </styled.span>
                <styled.span textStyle="md">
                  <span>{t('chat.dragToUpload.description')}</span>{' '}
                  <styled.span fontWeight={'600'}>{t('chat.dragToUpload.free')}</styled.span>
                </styled.span>
              </VStack>
            )}
          </styled.div>,
          document.body,
        )}
    </>
  );
}
