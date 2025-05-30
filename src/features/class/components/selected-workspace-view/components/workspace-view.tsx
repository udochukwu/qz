import { FileManager } from '@/features/files-pdf-chunks-sidebar/files-manager';
import { WorkspaceClass } from '@/types';
import React, { useEffect } from 'react';
import { Flex } from 'styled-system/jsx';
import WorkSpaceHeader from './workspace-header';
import { AllFilesManagerImportWorkspace } from '@/features/files-pdf-chunks-sidebar/all-files-manager-import-workspace';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useBoolean } from '@/hooks/use-boolean';
import CustomSplitter from '@/components/custom-splitter';
import { PreviewEntireFile } from '@/features/files-pdf-chunks-sidebar/preview-entire-file';
import { useSelectedFile } from '@/features/files-pdf-chunks-sidebar/hooks/use-selected-file';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { DragToUpload } from '@/features/files-pdf-chunks-sidebar/drag-to-upload/drag-to-upload';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import { PreviewEntireMedia } from '@/features/files-pdf-chunks-sidebar/audio-video-viewer/components/preview-entire-media';
import { QuickActions } from './quick-actions';
import { useViewTypeStore } from '@/stores/view-type-store';
import { MENU_TAB } from '@/features/menu-bar/types';
import { NewFlashcardView } from '@/features/flashcard/new-flashcard-view/new-flashcard-view';
import { css } from 'styled-system/css';
import { useTourStore } from '@/features/onboarding/stores/tour-store';

interface Props {
  workspace: WorkspaceClass;
}

export const WorkspaceView = ({ workspace }: Props) => {
  const { currentView } = useViewTypeStore();
  const crudPayload: CRUDFilesPost = { workspace_id: workspace.workspace_id };
  const isImportFilesManagerOpen = useBoolean();
  const { expandFile, displayedFile, clearDisplayedFile, isFileSelected } = useSelectedFile({ crudPayload });

  const displayFile = (file?: WorkspaceFile) => {
    const avExtensions = ['youtube', 'webm', 'mp4', 'mp3', 'wav', 'm4a'];
    if (!file) return;
    if (avExtensions.includes(getFileExtension(file.filename))) {
      return <PreviewEntireMedia file={file} onClose={clearDisplayedFile} />;
    }
    return <PreviewEntireFile file={file} onClose={clearDisplayedFile} />;
  };
  const { stepIndex, setStepIndex } = useTourStore();
  useEffect(() => {
    if (stepIndex === 1) {
      setStepIndex(2);
    }
  }, [stepIndex]);

  const { onFilesChange } = useOnUploadFileController({ excludeFiles: crudPayload });

  return (
    <>
      <DragToUpload
        onDrop={files => {
          onFilesChange({ acceptedFiles: files, uploadFilePayload: crudPayload });
        }}
      />
      <CustomSplitter isToggleable={{ isToggled: isFileSelected }}>
        <div style={{ height: '100vh', overflowY: 'scroll' }}>
          <AllFilesManagerImportWorkspace
            crudPayload={crudPayload}
            excludeFiles={crudPayload}
            isOpen={isImportFilesManagerOpen.value}
            setIsOpen={isImportFilesManagerOpen.setValue}
          />
          <WorkSpaceHeader workspace={workspace} />

          {currentView === MENU_TAB.FLASHCARDS && (
            <div
              className={css({
                w: '70%',
                mx: 'auto',
                minW: '500px',
              })}>
              <NewFlashcardView crudPayload={crudPayload} />
            </div>
          )}
          {currentView === MENU_TAB.CHATS && (
            <>
              <QuickActions workspace={workspace} />
              <Flex w={'70%'} mx="auto" alignItems="flex-start" py="7" gap="5" minW="500px" overflowY={'hidden'}>
                <FileManager
                  uploadingController={{
                    uploadFiles: ({ acceptedFiles }) => {
                      onFilesChange({ acceptedFiles, uploadFilePayload: crudPayload });
                    },
                  }}
                  expandFile={expandFile}
                  fileListContainerStyles={{ height: '40vh' }}
                  extensions={{
                    isFilterablebyFileType: true,
                    isMultiSelectEnabled: true,
                    openImportFromCourseGPTEnabled: isImportFilesManagerOpen.setTrue,
                    isFileUploadEnabled: true,
                  }}
                  crudPayload={crudPayload}
                />
              </Flex>
            </>
          )}
        </div>
        {displayFile(displayedFile)}
      </CustomSplitter>
    </>
  );
};
