import {
  AlignJustify,
  FolderSymlink,
  GalleryVerticalEnd,
  MessageCircleMoreIcon,
  MoreVertical,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
  BookOpenCheckIcon,
} from 'lucide-react';
import { useState } from 'react';
import { HStack, styled } from 'styled-system/jsx';
import { Menu } from '@/components/elements/menu';
import { IconButton } from '@/components/elements/icon-button';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { RenameFileModal } from './components/rename-file-modal';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { AddToWorkspaceModal } from '@/features/class/components/add-to-workspace-modal';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { avExtensions } from '@/features/files-pdf-chunks-sidebar/consts/av_extentions';
import { useRouter } from 'next13-progressbar';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import QuizView from '@/features/quiz/components/quiz-view';
import { useQuizViewStore } from '@/features/quiz/stores/quiz-view-store';

interface Props {
  fileName: string;
  fileId: string;
  fileExt: string;
  crudPayload?: CRUDFilesPost;
  excludeFiles?: CRUDFilesPost;
  file: WorkspaceFile;
  variant?: 'reduced' | 'expanded' | 'sidebar';
  onShareFileClick: (fileId: string) => void;
  iconColor?: string;
  expandFile: (file: WorkspaceFile) => void;
  showTranscriptOption: boolean;
}

export const FileItemMoreActionsMenu = ({
  fileName,
  fileId,
  crudPayload,
  fileExt,
  excludeFiles,
  file,
  variant = 'reduced',
  iconColor,
  onShareFileClick,
  expandFile,
  showTranscriptOption,
}: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { open: openQuizView } = useQuizViewStore();
  const {
    deleteFileMutation: { mutateAsync: deleteFilePost, isLoading },
  } = useFileDelete({ crudPayload, excludeFiles });
  const { mutate: createChat } = useCreateChat();

  const isDeleteModalOpen = useBoolean();
  const isRenameModalOpen = useBoolean();
  const isAddToWorkspaceModalOpen = useBoolean();

  const isAudioOrVideo = avExtensions.includes(fileExt.toLowerCase());

  const deleteFile = async () => {
    await deleteFilePost({ workspace_file_id: fileId, myfiles: pathname === '/files' });
    isDeleteModalOpen.setFalse();
  };

  const chatWithFile = (filedId: string) => {
    createChat({ workspace_file_ids: [filedId] });
  };

  const createFlashcard = () => {
    openQuizView('flashcards', file);
  };

  const onExpandFile = () => {
    expandFile(file);
  };

  return (
    <>
      <RenameFileModal
        fileExt={fileExt}
        isOpen={isRenameModalOpen.value}
        setIsOpen={isRenameModalOpen.setValue}
        fileId={fileId}
        fileName={fileName}
        excludeFiles={excludeFiles}
      />
      <ConfirmDeleteModal
        isLoading={isLoading}
        name={fileName}
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteFile}
        entityType="file"
      />
      <AddToWorkspaceModal
        isOpen={isAddToWorkspaceModalOpen.value}
        setIsOpen={isAddToWorkspaceModalOpen.setValue}
        file={file}
      />
      <Menu.Root positioning={{ strategy: 'fixed' }}>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            aria-label="More actions"
            color={variant === 'reduced' ? '#48484633' : 'rgba(21, 17, 43, 0.5)'}>
            <MoreVertical color={iconColor} />
          </IconButton>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup id="group-1">
              <Menu.Item value="new-chat" id="chat" onClick={() => chatWithFile(fileId)}>
                <HStack>
                  <MessageCircleMoreIcon />
                  <span>{t('common.chat')}</span>
                </HStack>
              </Menu.Item>

              <Menu.Item
                value="create-flashcard"
                id="create-flashcard"
                onClick={() => {
                  mixpanel.track(EventName.FlashcardStarted, {
                    path: window.location.pathname,
                    source: 'file_menu',
                  });
                  createFlashcard();
                }}>
                <HStack>
                  <GalleryVerticalEnd />
                  <span>{t('common.createFlashcard')}</span>
                </HStack>
              </Menu.Item>
              <Menu.Item
                value="create-quiz"
                id="create-quiz"
                onClick={() => {
                  mixpanel.track(EventName.QuizModalOpened, {
                    path: window.location.pathname,
                    source: 'file_menu',
                  });
                  openQuizView('quiz', file);
                }}>
                <HStack>
                  <BookOpenCheckIcon />
                  <span>{t('common.createQuiz')}</span>
                </HStack>
              </Menu.Item>
              <styled.hr p={0} m={0} opacity={0.5} />
              <Menu.Item value="share-file" id="share-file" onClick={() => onShareFileClick(fileId)}>
                <HStack>
                  <UploadIcon />
                  <span>{t('common.share')}</span>
                </HStack>
              </Menu.Item>
              <Menu.Item
                value="add-to-workspace"
                id="add-to-workspace"
                onClick={e => {
                  isAddToWorkspaceModalOpen.setTrue();
                }}>
                <HStack>
                  <FolderSymlink />
                  <span>{t('common.addClass')}</span>
                </HStack>
              </Menu.Item>
              {isAudioOrVideo && showTranscriptOption && (
                <Menu.Item value="readTranscript" id="readTranscript" onClick={onExpandFile}>
                  <HStack>
                    <AlignJustify />
                    <span>{t('common.readTranscript')}</span>
                  </HStack>
                </Menu.Item>
              )}
              <styled.hr p={0} m={0} opacity={0.5} />

              <Menu.Item value="rename" id="rename" onClick={isRenameModalOpen.setTrue}>
                <HStack>
                  <PencilIcon />
                  <span>{t('common.rename')}</span>
                </HStack>
              </Menu.Item>
              <Menu.Item value="delete" id="delete" onClick={isDeleteModalOpen.setTrue}>
                <HStack flex="1">
                  <Trash2Icon />
                  <span>{t('common.delete')}</span>
                </HStack>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </>
  );
};
