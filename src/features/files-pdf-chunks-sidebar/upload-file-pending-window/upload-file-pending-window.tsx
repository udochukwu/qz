'use client';

import { HStack, Stack, styled } from 'styled-system/jsx';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { css } from 'styled-system/css';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '../types/types';
import { AlertCircle, ArrowUpFromLine, ChevronDown, ChevronUp, Trash2Icon, XIcon } from 'lucide-react';
import { getFileExtension } from '../files-manager/util/get-file-extension';
import { extractFileName } from '../files-manager/util/extract-file-name';
import toast, { CheckmarkIcon, useToasterStore } from 'react-hot-toast';
import { useBoolean } from '@/hooks/use-boolean';
import { IconButton } from '@/components/elements/icon-button';
import { TailSpin } from 'react-loader-spinner';
import { useFiles } from '../hooks/files/use-files';
import { useEffect, useRef, useState } from 'react';
import { FileItemName } from '../files-manager/components/files-list/component/file-item/components/file-item-name';
import { useSettledFilesStore } from '../stores/settled-files-store';
import { useUploadStatus } from '../hooks/use-upload-status';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import FileUploadToast from './components/file-upload-toast';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useUploadBarState } from '@/hooks/useUploadBarState';
import useUploadProgressStore from '@/hooks/use-upload-progress';

const stiffness = 300;

const damping = 40;

const ITEM_HEIGHT = 45;

const TAB_HEIGHT = 50;

const StyledMotionDiv = styled(motion.div);

export const UploadFilePendingWindow = () => {
  const { t } = useTranslation();
  const controls = useDragControls();
  const isClose = useBoolean();
  const barState = useUploadBarState();
  const { mutate: createChat } = useCreateChat();
  const { toasts } = useToasterStore();
  const pathname = usePathname();
  const { settledFiles, clearSettledFiles, removeSettledFiles } = useSettledFilesStore();
  const dismissedToasts = useRef<string[]>([]);
  const { data: fileList } = useFiles();
  const files = fileList?.files ?? [];
  const uploadingFiles = files.filter(file => file.status === WorkspaceFileUploadStatus.UPLOADING);
  const { getProgress, resetProgress } = useUploadProgressStore();
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});

  // Auto-collapse state
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(false);

  // Add a ref to track files that should be auto-dismissed
  const autoDismissTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    for (const file of displayedPendingFiles) {
      if (file.status === WorkspaceFileUploadStatus.FINISHED) {
        removeSettledFiles(file.inprogressId!);
        toast.dismiss(file.filename + file.workspace_file_id); // Toast ID;
      }
    }
  }, []);

  const displayedSettledFiles = settledFiles
    .filter(settledFile => !uploadingFiles.some(file => file.workspace_file_id === settledFile.workspace_file_id))
    .filter(
      file => file.status === WorkspaceFileUploadStatus.FINISHED || file.status === WorkspaceFileUploadStatus.FAILED,
    );

  //File out files with same workspace_file_id (keep the on with the success status if they have different status)
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

  const { mutateAsync: getUploadStatus } = useUploadStatus();

  const uploadingFileWithWorkspaceId = files
    .filter(file => file.status === WorkspaceFileUploadStatus.UPLOADING)
    .filter(file => file.workspace_file_id.length > 0);

  useEffect(
    function recheckFilesForUploadStatus() {
      let timer: NodeJS.Timeout | null = null;

      const update = async () => {
        if (uploadingFileWithWorkspaceId.length > 0) {
          Promise.all(
            uploadingFileWithWorkspaceId.map(async file => {
              if (file.status && file.status === WorkspaceFileUploadStatus.UPLOADING) {
                await getUploadStatus(file.workspace_file_id).catch(err => console.error(err));
              }
              return Promise.resolve();
            }),
          ).catch(err => {
            console.error('unable to fetch file status', err);
          });
        } else {
          if (timer) clearTimeout(timer);
        }
      };

      timer = setTimeout(() => {
        update().catch(err => {
          console.error('unable to update file status', err);
        });
      }, 2000);

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
    [uploadingFiles],
  );

  useEffect(() => {
    if (pathname.startsWith('/c/') || pathname.startsWith('/f/')) {
      // Dismiss all files that are done uploading
      displayedPendingFiles.forEach(file => {
        if (file.status === WorkspaceFileUploadStatus.FINISHED) {
          const toastID = file.filename + file.workspace_file_id;
          if (!dismissedToasts.current.includes(toastID)) {
            dismissedToasts.current.push(toastID);
          }
        }
      });
      return;
    }
    displayedPendingFiles.forEach(file => {
      const toastID = file.filename + file.workspace_file_id;
      if (
        file.status === WorkspaceFileUploadStatus.FINISHED &&
        toasts.findIndex(t => t.id === toastID) === -1 &&
        !dismissedToasts.current.includes(toastID)
      ) {
        toast.success(
          <FileUploadToast
            file={file}
            createChat={createChat}
            onDismiss={() => dismissedToasts.current.push(toastID)}
            toastId={toastID}
          />,
          {
            duration: 3000,
            position: 'top-right',
            style: {
              overflow: 'hidden',
            },
            id: toastID,
          },
        );

        // Set up auto-dismiss timer for finished files
        if (file.inprogressId && !autoDismissTimers.current[file.inprogressId]) {
          autoDismissTimers.current[file.inprogressId] = setTimeout(() => {
            removeSettledFiles(file.inprogressId!);
            resetProgress(file.sha256);
            toast.dismiss(toastID);
            dismissedToasts.current.push(toastID);
            delete autoDismissTimers.current[file.inprogressId!];
          }, 3000); // Auto-dismiss after 3 seconds
        }
      }
    });
  }, [displayedPendingFiles, toast, pathname]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(autoDismissTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const isFileStillInProgress = files.some(file => file.status === WorkspaceFileUploadStatus.UPLOADING);

  const isFileFinishAllSuccess =
    !isFileStillInProgress && displayedSettledFiles.every(file => file.status === WorkspaceFileUploadStatus.FINISHED);

  const isFileFinishAtleastOneError =
    !isFileStillInProgress && displayedSettledFiles.some(file => file.status === WorkspaceFileUploadStatus.FAILED);

  const isFileWindowVisible = files !== undefined && Object.keys(displayedPendingFiles).length > 0;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isFileFinishAllSuccess) {
      timer = setTimeout(() => {
        isClose.setTrue();
        barState.toggle(false);
      }, 5000);
    } else {
      isClose.setFalse();
      barState.toggle(true);
      if (timer) {
        clearTimeout(timer);
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isFileFinishAllSuccess]);

  // Auto-collapse effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isFileStillInProgress && !isAutoCollapsed) {
      timer = setTimeout(() => {
        setIsAutoCollapsed(true);
      }, 5000);
    } else if (!isFileStillInProgress) {
      setIsAutoCollapsed(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isFileStillInProgress, isAutoCollapsed]);

  const currentListHeight = displayedPendingFiles.length * ITEM_HEIGHT + 32;

  const toggleError = (fileId: string) => {
    setExpandedErrors(prev => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  const isErrorExpanded = (fileId: string) => {
    return expandedErrors[fileId] ?? true;
  };

  if (pathname.includes('/flashcards')) {
    return;
  }
  return (
    <styled.div h="100svh" w="100%" pos="absolute" zIndex={1000} pointerEvents="none">
      <AnimatePresence>
        {/* Only show circular button when auto-collapsed */}
        {isAutoCollapsed && (
          <motion.div
            key="circular-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'end',
            }}>
            <styled.div pos="relative" w={14} h={14}>
              <StyledMotionDiv
                pointerEvents={'all'}
                cursor={'pointer'}
                w={14}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                aspectRatio={'1/1'}
                bg="white"
                shadow="sm"
                rounded={'full'}
                pos="relative"
                zIndex={1}
                onClick={() => {
                  setIsAutoCollapsed(false);
                }}>
                <ArrowUpFromLine />
                {(isFileStillInProgress || isFileFinishAllSuccess) && (
                  <styled.div
                    pos="absolute"
                    top="-6px"
                    right="-6px"
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={isFileStillInProgress ? '#6D56FA' : 'green.500'}
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight="bold"
                    zIndex={2}
                    border="2px solid white"
                    shadow="sm">
                    {isFileStillInProgress ? (
                      uploadingFiles.length
                    ) : (
                      <CheckmarkIcon className={css({ color: 'white', fontSize: 'xs' })} />
                    )}
                  </styled.div>
                )}
              </StyledMotionDiv>
            </styled.div>
          </motion.div>
        )}
      </AnimatePresence>

      <styled.div h="100svh" w="100%" pos="relative" overflow="hidden" pointerEvents="none">
        <AnimatePresence>
          {isFileWindowVisible && !isAutoCollapsed && (
            <motion.section
              key="upload-window"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: stiffness, damping: damping, delay: 0.1 },
              }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
              className={css({
                pointerEvents: 'all',
                borderRadius: 'lg',
                border: '1.1px solid rgba(21, 17, 43, 0.1)',
                pos: 'absolute',
                bottom: 4,
                right: 4,
                bg: 'white',
                scrollbarGutter: 'stable',
                zIndex: 10000,
                dropShadow: '3xl',
                w: '450px',
                maxH: '300px',
                overflowY: 'auto',
              })}>
              <styled.div
                height={TAB_HEIGHT}
                py={4}
                px={4}
                mt={0}
                display="flex"
                flexDir="column"
                justifyContent="center"
                pos="sticky"
                bg="white"
                zIndex={1000}
                top={0}>
                <HStack w="full " justifyContent="space-between">
                  <HStack alignItems="center">
                    <styled.h4 mt={0} fontWeight="medium" textStyle="md">
                      {t('files.pdf.upload.title')}
                    </styled.h4>
                    {isFileStillInProgress && (
                      <TailSpin
                        visible={true}
                        height="20"
                        width="20"
                        color="#6D56FA"
                        ariaLabel="tail-spin-loading"
                        radius="2"
                      />
                    )}
                    {isFileFinishAllSuccess && <CheckmarkIcon className={css({ color: 'green.5' })} />}
                    {isFileFinishAtleastOneError && <AlertCircle className={css({ color: 'red.5' })} />}
                  </HStack>
                  <HStack>
                    <motion.div
                      animate={{
                        x: isFileStillInProgress ? 60 : 0,
                        transition: { type: 'spring', stiffness: stiffness, damping: damping, delay: 0.2 },
                      }}
                      className={css({ zIndex: 10 })}>
                      <IconButton
                        p={0}
                        w="30px"
                        h="30px"
                        aria-label={t('files.pdf.upload.toggle')}
                        variant="ghost"
                        onClick={e => {
                          e.preventDefault();
                          isClose.onToggle();
                          barState.toggle(isClose.value);
                        }}>
                        {isClose.value ? <ChevronUp /> : <ChevronDown />}
                      </IconButton>
                    </motion.div>
                    <motion.div
                      animate={{
                        opacity: !isFileStillInProgress ? 100 : 0,
                        pointerEvents: isFileStillInProgress ? 'none' : 'all',
                        transition: { delay: !isFileStillInProgress ? 0.5 : 0 },
                      }}>
                      <IconButton
                        w="30px"
                        h="30px"
                        p={0}
                        aria-label={t('files.pdf.upload.close')}
                        variant="ghost"
                        onClick={() => {
                          if (!isFileStillInProgress) {
                            clearSettledFiles();
                          }
                        }}>
                        <XIcon />
                      </IconButton>
                    </motion.div>
                  </HStack>
                </HStack>
              </styled.div>
              <motion.div
                className={css({ px: 4 })}
                animate={{
                  height: isClose.value ? 0 : 'auto',
                  overflowY: 'hidden',
                  transition: { type: 'spring', stiffness: stiffness, damping: damping },
                }}>
                <styled.div display="flex" flexDirection="column" gap={4} pb={4} h="100%" justifyContent="flex-start">
                  {displayedPendingFiles !== undefined &&
                    displayedPendingFiles.map((uploadedFile, id) => {
                      const { status, completion_percentage = 0, filename, workspace_file_id, sha256 } = uploadedFile;
                      const fileExtension = getFileExtension(filename);
                      const fileName = extractFileName(filename);

                      const uploadProgress = getProgress(sha256 ?? '') || 0;
                      const totalProgress = completion_percentage || uploadProgress;
                      const progressPercent = `${totalProgress.toFixed(2).replace(/\.00$/, '')}%`;

                      const inProgressBar = (
                        <>
                          {totalProgress >= 0 && (
                            <HStack alignItems="center">
                              <styled.div
                                w="120px"
                                display="flex"
                                justifyContent="flex-start"
                                pos="relative"
                                borderRadius="4px">
                                <styled.div
                                  height="4px"
                                  mt={2}
                                  bg="#6D56FA"
                                  style={{
                                    width: `${Math.max(1, totalProgress)}%`,
                                    borderRadius: '4px',
                                    position: 'absolute',
                                  }}
                                />
                                <styled.div height="4px" mt={2} bg="#6c56fa25" width="100%" />
                              </styled.div>
                              <styled.span w="40px" color="fg.muted" textStyle="sm">
                                {progressPercent}
                              </styled.span>
                            </HStack>
                          )}
                        </>
                      );

                      const failure = (
                        <IconButton
                          aria-label="Delete"
                          variant="ghost"
                          onClick={() => {
                            if (uploadedFile.inprogressId) {
                              removeSettledFiles(uploadedFile.inprogressId);
                              resetProgress(uploadedFile.sha256);
                            }
                          }}>
                          <Trash2Icon className={css({ color: 'red' })} />
                        </IconButton>
                      );

                      const finished = (
                        <HStack>
                          <IconButton
                            w="30px"
                            h="30px"
                            p={0}
                            px={0}
                            aria-label="Close pending file list"
                            variant="ghost"
                            onClick={() => {
                              if (uploadedFile.inprogressId) {
                                removeSettledFiles(uploadedFile.inprogressId);
                                resetProgress(uploadedFile.sha256);
                              }
                            }}>
                            <XIcon />
                          </IconButton>
                          <styled.div px={2.5} display="flex" flexDir="column" justifyContent="center">
                            <CheckmarkIcon className={css({ color: 'green.5' })} />
                          </styled.div>
                        </HStack>
                      );

                      return (
                        <styled.div key={id} w="100%" overflow="visible" display="flex" flexDirection="column">
                          <HStack
                            w="100%"
                            h={`${ITEM_HEIGHT}px`}
                            overflow="visible"
                            justifyContent="space-between"
                            cursor={status === WorkspaceFileUploadStatus.FAILED ? 'pointer' : 'default'}
                            onClick={() =>
                              status === WorkspaceFileUploadStatus.FAILED && toggleError(workspace_file_id)
                            }>
                            <HStack alignItems="center" h="100%">
                              <FileItemExtension extension={fileExtension} />
                              <Stack flexDir="column" gap={0} h="100%" justify="center" pos="relative" bottom="2px">
                                <styled.div pos="relative">
                                  <FileItemName
                                    fileName={fileName}
                                    variant="reduced"
                                    color={status === WorkspaceFileUploadStatus.FAILED ? '#FF0D0D' : '#15112B'}
                                  />
                                </styled.div>
                              </Stack>
                            </HStack>
                            {status === WorkspaceFileUploadStatus.UPLOADING && inProgressBar}
                            {status === WorkspaceFileUploadStatus.FAILED && failure}
                            {status === WorkspaceFileUploadStatus.FINISHED && finished}
                          </HStack>
                          <AnimatePresence>
                            {status === WorkspaceFileUploadStatus.FAILED &&
                              uploadedFile.user_shown_error &&
                              isErrorExpanded(workspace_file_id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}>
                                  <styled.div pl={3.5}>
                                    <styled.div
                                      mt={1}
                                      p={1.5}
                                      pl={2}
                                      borderRadius="6px"
                                      border="1px solid"
                                      borderColor="#FF0D0D1A"
                                      bg="#FF0D0D0D">
                                      <HStack gap={2} alignItems="center">
                                        <styled.div
                                          w="18px"
                                          h="18px"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center">
                                          <AlertCircle size={18} color="#FF0D0DB2" />
                                        </styled.div>
                                        <styled.p
                                          color="#B00B0B"
                                          fontSize="xs"
                                          lineHeight="1.2"
                                          whiteSpace="pre-wrap"
                                          m={0}>
                                          {uploadedFile.user_shown_error}
                                        </styled.p>
                                      </HStack>
                                    </styled.div>
                                  </styled.div>
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </styled.div>
                      );
                    })}
                </styled.div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </styled.div>
    </styled.div>
  );
};
