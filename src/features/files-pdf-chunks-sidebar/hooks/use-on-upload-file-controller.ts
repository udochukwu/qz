import toast from 'react-hot-toast';
import { CRUDFilesPost, FileToUploadPost } from '../types/api-types';
import { calculateSHA256 } from '../utils/get-file-sha';
import useFileUpload from './files/use-file-upload';
import { useSettledFilesStore } from '../stores/settled-files-store';
import { WorkspaceFile } from '../types/types';
import { useRouter } from 'next13-progressbar';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';
import { useSearchParams } from 'next/navigation';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { useQuizViewStore } from '@/features/quiz/stores/quiz-view-store';
import { useLanguageSelectionModalStore } from '../stores/language-selection-modal-store';

export const useOnUploadFileController = ({
  excludeFiles,
  dontRedirect,
}: {
  excludeFiles?: CRUDFilesPost;
  dontRedirect?: boolean;
}) => {
  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { onFileUpload } = useFileUpload({ excludeFiles });
  const { settledFiles } = useSettledFilesStore();
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const {
    setIsOpen: setLanguageModalOpen,
    setFiles: setLanguageModalFiles,
    setOnConfirm,
    resetState,
  } = useLanguageSelectionModalStore();
  const router = useRouter();
  const { setSelectedFiles, open } = useQuizViewStore();
  const searchParams = useSearchParams();
  const isFlashcards = searchParams.get('tab') === 'Flashcards';
  const isQuiz = searchParams.get('tab') === 'Quiz';

  const uploadFilesWithLangcode = async (files: FileToUploadPost[], uploadFilePayload: CRUDFilesPost) => {
    const updatedCRUDPayload = {
      chat_id: uploadFilePayload?.chat_id,
      workspace_id: uploadFilePayload?.workspace_id,
    };
    let hasUpgradeError = false;
    const uploadPromises = files.map(async file => {
      try {
        const result = await onFileUpload({
          isPro: subscriptionStatus?.is_pro || false,
          file: file.file,
          payload: updatedCRUDPayload,
          langcode: file.langcode,
          onUploadProgress: () => {},
        });
        return result;
      } catch (error: any) {
        if (error instanceof Error && error.message === 'Upgrade required') {
          hasUpgradeError = true;
          setReferrer('document-limit');
          setIsOpen(true);
        }
      }
    });

    const result = await Promise.all(uploadPromises);
    return { result, hasUpgradeError };
  };

  const uploadFiles = async (files: File[], uploadFilePayload: CRUDFilesPost) => {
    // Check if any files are audio or video
    const filesToUpload = files.map(file => ({ file }));
    const audioVideoFiles = files.filter(file => isAudioOrVideoFile(file));

    if (audioVideoFiles.length > 0) {
      // Show language selection modal if there are audio/video files
      setLanguageModalFiles(filesToUpload);
      setOnConfirm(async (filesWithLangcode: FileToUploadPost[]) => {
        try {
          const result = await uploadFilesWithLangcode(filesWithLangcode, uploadFilePayload);
          // Ensure state is reset whether upload succeeds or fails
          resetState();
          return result;
        } catch (error) {
          // Ensure state is reset in case of errors
          resetState();
          throw error;
        }
      });
      setLanguageModalOpen(true);
      return { result: [], hasUpgradeError: false };
    }

    // If no audio/video files, upload the files right away
    return await uploadFilesWithLangcode(filesToUpload, uploadFilePayload);
  };

  const isAudioOrVideoFile = (file: File): boolean => {
    return file.type.startsWith('audio/') || file.type.startsWith('video/');
  };

  const onFilesChange = async ({
    acceptedFiles,
    uploadFilePayload,
  }: {
    acceptedFiles: File[];
    uploadFilePayload: CRUDFilesPost;
  }) => {
    // TODO:
    // If possible have FE filter for files that already exist
    // We can no longer match on size and modified dates
    // I think the BE changes modified date when uploading
    // Also size is not given in the BE called
    const filesToUploadUnprocessed: FileToUploadPost[] = acceptedFiles.map(file => ({ file }));
    const removedUploadingDupeFiles = await removeDuplicates(filesToUploadUnprocessed);
    const filesToUpload = await removeSettledFiles(removedUploadingDupeFiles, settledFiles);

    if (filesToUpload.length === 0 && acceptedFiles.length > 0) {
      toast('File has already been uploaded', {
        icon: '👋',
      });
      return;
    }

    // Check if any files are audio or video
    const audioVideoFiles = filesToUpload.filter(file => isAudioOrVideoFile(file.file));

    if (audioVideoFiles.length > 0) {
      // Show language selection modal if there are audio/video files
      setLanguageModalFiles(filesToUpload);
      setOnConfirm(async (filesWithLangcode: FileToUploadPost[]) => {
        try {
          const { hasUpgradeError, result } = await uploadFilesWithLangcode(filesWithLangcode, uploadFilePayload);
          handleUploadResult(hasUpgradeError, result, uploadFilePayload);
          // Ensure state is reset after upload
          resetState();
        } catch (error) {
          console.error('Upload failed:', error);
          // Ensure state is reset in case of errors
          resetState();
        }
      });
      setLanguageModalOpen(true);
      return;
    }

    try {
      const { hasUpgradeError, result } = await uploadFilesWithLangcode(filesToUpload, uploadFilePayload);
      handleUploadResult(hasUpgradeError, result, uploadFilePayload);
      return result;
    } catch (error) {
      return;
    }
  };

  const handleUploadResult = (
    hasUpgradeError: boolean,
    result: any[] | undefined,
    uploadFilePayload: CRUDFilesPost,
  ) => {
    if (!hasUpgradeError && uploadFilePayload.chat_id && !dontRedirect && !isFlashcards && !isQuiz) {
      router.push(`/c/${uploadFilePayload.chat_id}`);
    } else if (isQuiz || isFlashcards) {
      if (result && result.length > 0) {
        const variant = isQuiz ? 'quiz' : 'flashcards';
        open(variant);
        setSelectedFiles(
          result
            .filter(
              (file): file is NonNullable<typeof file> & { workspace_file_id: string } =>
                file !== undefined && typeof file.workspace_file_id === 'string',
            )
            .map(file => ({
              workspace_file_id: file.workspace_file_id,
              filename: file.file.name,
              created_at: Date.now(),
              last_modified: file.file.lastModified,
              url: '',
            })),
        );
      }
    }
  };

  return { onFilesChange, uploadFiles };
};
async function removeDuplicates(files: FileToUploadPost[]): Promise<FileToUploadPost[]> {
  const uniqueFiles = new Map<string, FileToUploadPost>();

  for (const file of files) {
    const hash = await calculateSHA256(file.file);
    if (!uniqueFiles.has(hash)) {
      uniqueFiles.set(hash, file);
    }
  }

  return Array.from(uniqueFiles.values());
}

async function removeSettledFiles(
  files: FileToUploadPost[],
  settledFiles: WorkspaceFile[],
): Promise<FileToUploadPost[]> {
  //use settledfiles sha256 to filter out files
  const settledFilesSHA256 = settledFiles.map(file => file.sha256);
  const uniqueFiles = new Map<string, FileToUploadPost>();
  for (const file of files) {
    const hash = await calculateSHA256(file.file);
    if (!settledFilesSHA256.includes(hash) && !uniqueFiles.has(hash)) {
      uniqueFiles.set(hash, file);
    }
  }
  return Array.from(uniqueFiles.values());
}
