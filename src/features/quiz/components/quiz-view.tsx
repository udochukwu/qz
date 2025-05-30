import React, { useState, useCallback, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { styled } from 'styled-system/jsx';
import UploadActionBox from '@/components/upload-action-box';
import { ClipboardList, PlusIcon, LaptopIcon, XIcon, Youtube, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/modal/modal';
import { FileUpload } from '@/components/elements/file-upload';
import { ACCEPTED_FILE_TYPES } from '@/features/files-pdf-chunks-sidebar/consts/accepted-files';
import { CRUDFilesPost } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { WorkspaceFileUploadStatus, WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import { Select } from '@/components/elements/select';
import { HStack } from 'styled-system/jsx';
import { Dialog } from '@/components/elements/dialog';
import { useBoolean } from '@/hooks/use-boolean';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import useWorkspaceStore from '@/features/class/stores/workspace-store';
import FlashcardFiles from '@/features/flashcard/new-flashcard-view/components/flashcard-files';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import UploadYoutubeButton from '@/features/upload-youtube/components/UploadYoutubeButton';
import { useUserStore } from '@/stores/user-store';
import { useGetFileDetail } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-file';
import { DownloadFile } from '@/types';
import { useReward } from 'react-rewards';
import { useGenerateQuiz, GenerateQuizQuery } from '../hooks/use-generate-quiz';
import { QuestionType } from '../types/quiz';
import { useRouter } from 'next13-progressbar';
import { Spinner } from '@/components/elements/spinner';
import { Badge } from '@/components/elements/badge';
import { StepperItem } from '../components/quiz-view/stepper-item';
import { VectorIcon, YoutubeIcon } from '../components/quiz-view/icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { useSettledFilesStore } from '@/features/files-pdf-chunks-sidebar/stores/settled-files-store';
import { useQuizViewStore } from '../stores/quiz-view-store';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { useQueryClient } from 'react-query';
import { GET_RECENT_QUIZES_QUERY_KEY } from '../hooks/use-get-recent-quizes';
import { useGenerateFlashcard } from '@/features/flashcard/hooks/use-generate-flashcard';
import { GenerateFlashcardQuery } from '@/features/flashcard/types/flashcard-api-types';
import { AxiosError } from 'axios';
import { GenerateQuizResponse } from '../hooks/use-generate-quiz';
import { GenerateFlashcardResponse } from '@/features/flashcard/types/flashcard-api-types';
import { GET_RECENT_FLASHCARDS_QUERY_KEY } from '@/features/flashcard/hooks/use-get-recent-flashcard-sets';

const MotionStyledButton = motion(styled.button);
const MotionCheck = motion(Check);
const MotionStyledP = motion(styled.p);
const MotionDiv = motion(styled.div);

// Define an interface that extends WorkspaceFile with our temporary properties
interface QuizResource extends Partial<WorkspaceFile> {
  workspace_file_id: string;
  filename: string;
  isTemporary?: boolean;
  fileDetails?: DownloadFile;
  detailsFetched?: boolean;
}

interface VisibleMessage {
  message: {
    id: string;
    message: string;
    type: string;
  };
  position: number;
  isNextUpMaterial?: boolean;
}

export interface QuizViewRef {
  open: () => void;
  close: () => void;
}

interface QuizViewProps {
  hideTrigger?: boolean;
}

const QuizView = ({ hideTrigger = false }: QuizViewProps) => {
  const crudPayload: CRUDFilesPost = {};
  const { selectedFiles, isOpen, close, open, variant, topics: loadedTopics, quickMake } = useQuizViewStore();
  const { t: translateRaw } = useTranslation();
  const router = useRouter();
  const { mutate: generateQuiz } = useGenerateQuiz();
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const isSelectMenuOpen = useBoolean(false);
  const [selectedResources, setSelectedResources] = useState<QuizResource[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedQuizMode, setSelectedQuizMode] = useState<'test' | 'grind' | null>(null);
  const { workspaceId } = useWorkspaceStore();
  const { uploadFiles } = useOnUploadFileController({});
  const { impersonated } = useUserStore();
  const searchParams = useSearchParams();
  const { settledFiles } = useSettledFilesStore();
  const [hasClickedGrindMode, setHasClickedGrindMode] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [resourcesToNotAutoAdd, setResourcesToNotAutoAdd] = useState<QuizResource[]>([]);
  const [uploadKey, setUploadKey] = useState(0);
  const { mutate: generateFlashcardSet, isLoading, isError } = useGenerateFlashcard();
  const [pastVariant, setPastVariant] = useState<'quiz' | 'flashcards' | null>(null);

  const t = (key: string, more?: any): string => {
    return translateRaw(key, { variant, ...more }) as string;
  };

  // Track the last variant and clear the selected resources when it changes
  useEffect(() => {
    if (variant === null) return;
    if (pastVariant !== variant) {
      setSelectedResources([]);
    }
    setPastVariant(variant);
  }, [variant]);

  // Add this new code to handle the 'openQuiz' URL parameter
  useEffect(() => {
    const { openQuiz, workspaceFileId } = Object.fromEntries(searchParams.entries());
    if (openQuiz === 'true' && !isOpen) {
      open();
      mixpanel.track(EventName.QuizModalOpened, {
        path: window.location.pathname,
        source: 'url_param',
      });
    }
    if (workspaceFileId) {
      // Find the file in the allWorkspaceFiles
      const file = allWorkspaceFiles?.files.find((f: WorkspaceFile) => f.workspace_file_id === workspaceFileId);
      if (file && file.completion_percentage === 100) {
        setSelectedResources([{ ...file, isTemporary: false, detailsFetched: false }]);
      }
    }
  }, [searchParams]);

  const statusMessages = [
    {
      id: 'getting-ready',
      message: t('quiz.generate_quiz_modal.steps.getting_ready'),
      type: 'intro',
    },
    // Study materials messages will be generated dynamically
    // Topic messages will be generated dynamically
    {
      id: 'customizing-quiz',
      message: t('quiz.generate_quiz_modal.steps.customizing_quiz'),
      type: 'final',
    },
    {
      id: 'generating-quiz',
      message: t('quiz.generate_quiz_modal.steps.generating_quiz'),
      type: 'final',
    },
    {
      id: 'finalizing-quiz',
      message: t('quiz.generate_quiz_modal.steps.finalizing_quiz'),
      type: 'final',
    },
  ];

  const steps = [
    {
      name: t('quiz.generate_quiz_modal.quiz_steps.resources.name'),
      longName: t('quiz.generate_quiz_modal.quiz_steps.resources.long_name'),
      description: t('quiz.generate_quiz_modal.quiz_steps.resources.description'),
    },
    {
      name: t('quiz.generate_quiz_modal.quiz_steps.customize.name'),
      longName: t('quiz.generate_quiz_modal.quiz_steps.customize.long_name'),
      description: t('quiz.generate_quiz_modal.quiz_steps.customize.description'),
    },
  ];

  if (variant === 'quiz') {
    steps.push({
      name: t('quiz.generate_quiz_modal.quiz_steps.settings.name'),
      longName: t('quiz.generate_quiz_modal.quiz_steps.settings.long_name'),
      description: t('quiz.generate_quiz_modal.quiz_steps.settings.description'),
    });
  }

  useEffect(() => {
    if (isOpen) {
      if (selectedFiles) {
        setSelectedResources(resources => {
          const uniqueFiles = selectedFiles.filter(
            (file, index, self) =>
              // First ensure it's unique within selectedFiles
              index === self.findIndex(t => t.filename === file.filename) &&
              // Then ensure it's not already in resources
              !resources.some(r => r.filename === file.filename),
          );
          return [...resources, ...uniqueFiles];
        });
      }
      if (loadedTopics) {
        setSelectedTopics(topics => [...topics, ...loadedTopics]);
      }
    }
  }, [selectedFiles, loadedTopics, isOpen]);

  useEffect(() => {
    if (quickMake) {
      setSelectedQuizMode('test');
      if (selectedTopics.length === 0 && selectedResources.length === 0) return;
      if (creatingQuiz) return;
      handleQuizCreation();
    }
  }, [quickMake, selectedTopics, selectedResources]);

  // Define the original English question types and their translations
  const questionTypeMap = {
    'Multiple choice': t('quiz.question_types.multiple_choice'),
    'True or false': t('quiz.question_types.true_false'),
    'Short response': t('quiz.question_types.short_answer'),
    'Fill in the blank': t('quiz.question_types.fill_in_the_blank'),
  };

  // Create a reverse mapping for translating back to English
  const reverseQuestionTypeMap = Object.entries(questionTypeMap as Record<string, string>).reduce(
    (acc, [eng, translated]) => {
      acc[translated] = eng;
      return acc;
    },
    {} as Record<string, string>,
  );

  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([
    questionTypeMap['Multiple choice'],
    questionTypeMap['True or false'],
    questionTypeMap['Short response'],
    questionTypeMap['Fill in the blank'],
  ]);

  // Add a state for dynamic status messages
  const [dynamicStatusMessages, setDynamicStatusMessages] = useState(statusMessages);

  // Add state to track which message is currently active
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  // Keep track of the previous active message for exit animations
  const [previousActiveMessage, setPreviousActiveMessage] = useState<any>(null);

  // Keep track of which file ID we're currently fetching details for
  const [currentDetailFileId, setCurrentDetailFileId] = useState<string | null>(null);
  // Only use the hook when we have a valid file ID
  const {
    data: fileDetails,
    isLoading: isLoadingFileDetails,
    isError: isFileDetailError,
  } = useGetFileDetail(currentDetailFileId || '');

  // Update the previous active message when the active message changes
  useEffect(() => {
    if (activeMessageIndex > 0 && dynamicStatusMessages.length > 0) {
      const prevIndex = activeMessageIndex - 1;
      if (prevIndex >= 0 && prevIndex < dynamicStatusMessages.length) {
        setPreviousActiveMessage(dynamicStatusMessages[prevIndex]);
      }
    }
  }, [activeMessageIndex, dynamicStatusMessages]);

  // Instead of rotating indices, we'll simply increment the active message index
  useEffect(() => {
    if (!dynamicStatusMessages.length) return;

    // Don't continue if we've reached the end of the messages
    if (activeMessageIndex >= dynamicStatusMessages.length) return;

    // Get the current message type to determine timing
    const currentMessage = dynamicStatusMessages[activeMessageIndex];
    const messageType = currentMessage?.type || 'final';

    // Check if this is the last message - if so, don't auto-advance
    const isLastMessage = activeMessageIndex === dynamicStatusMessages.length - 1;
    if (isLastMessage) return; // Don't set a timer if this is the last message

    // Set different timing based on message type
    const getIntervalForMessageType = (type: string) => {
      switch (type) {
        case 'material':
          return 3500;
        case 'topic':
          return 1500;
        case 'intro':
          return 3000;
        case 'final':
          return 3000;
        case 'success':
          return 2500;
        default:
          return 1500;
      }
    };

    // Calculate timeout based on the current message type
    const timeoutDuration = getIntervalForMessageType(messageType);

    // Move to the next message after the timeout
    const timeout = setTimeout(() => {
      setActiveMessageIndex(prev => prev + 1);
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [dynamicStatusMessages, activeMessageIndex]);

  // Generate the messages to display based on the active index
  const visibleMessages = useMemo<VisibleMessage[]>(() => {
    if (!dynamicStatusMessages.length) return [];

    // If we've reached the end of the messages, show the last message
    if (activeMessageIndex >= dynamicStatusMessages.length) {
      // Just return an empty array (no messages) if we somehow got past the end
      return [];
    }

    // If this is the last message, just show it without any upcoming messages
    const isLastMessage = activeMessageIndex === dynamicStatusMessages.length - 1;
    if (isLastMessage) {
      return [
        {
          message: dynamicStatusMessages[activeMessageIndex],
          position: 0,
          isNextUpMaterial: false,
        },
      ];
    }

    // Create an array of messages to display
    const result: VisibleMessage[] = [];

    // Start from the active message and include up to 8 messages (increased from 5)
    for (let i = 0; i < 8; i++) {
      const index = activeMessageIndex + i;
      // Stop if we've reached the end of the messages
      if (index >= dynamicStatusMessages.length) break;

      // For the next message (position 1), check if it's a material message and the current message is also material
      // If so, we want to show it more prominently to avoid seeming like it's being skipped
      const currentMessage = dynamicStatusMessages[activeMessageIndex];
      const nextMessage = dynamicStatusMessages[index];
      const isNextUpMaterial = i === 1 && nextMessage?.type === 'material' && currentMessage?.type === 'material';

      result.push({
        message: dynamicStatusMessages[index],
        position: i,
        isNextUpMaterial: isNextUpMaterial,
      });
    }

    return result;
  }, [dynamicStatusMessages, activeMessageIndex]);

  // Set up rewards for quiz mode buttons
  const { reward: testModeReward, isAnimating: isTestModeAnimating } = useReward('testModeReward', 'emoji', {
    elementCount: 20,
    spread: 30,
    elementSize: 24,
    emoji: ['📚', '✏️', '📝', '🎓', '🤓', '📖'],
  });

  const { reward: grindModeReward, isAnimating: isGrindModeAnimating } = useReward('grindModeReward', 'emoji', {
    elementCount: 20,
    spread: 30,
    elementSize: 24,
    emoji: ['🔥', '💪', '⚡', '🚀'],
  });

  // Apply file details to resources when they arrive
  useEffect(() => {
    if (!currentDetailFileId) return;

    if (fileDetails) {
      // Success case - update the resource with details
      setSelectedResources(prevResources =>
        prevResources.map(resource =>
          resource.workspace_file_id === currentDetailFileId
            ? { ...resource, fileDetails, detailsFetched: true }
            : resource,
        ),
      );
    } else if (isFileDetailError) {
      // Error case - mark as attempted but failed
      console.error(`Failed to fetch details for file ${currentDetailFileId}`);
      setSelectedResources(prevResources =>
        prevResources.map(resource =>
          resource.workspace_file_id === currentDetailFileId ? { ...resource, detailsFetched: true } : resource,
        ),
      );
    }

    // If either we got data or encountered an error, move to next file
    if (fileDetails || isFileDetailError) {
      setCurrentDetailFileId(null);
    }
  }, [fileDetails, isFileDetailError, currentDetailFileId]);

  // For browsing all files in the workspace, don't filter by chat ID
  const filesBrowserPayload: CRUDFilesPost | undefined = workspaceId ? { workspace_id: workspaceId } : undefined;

  // Get all workspace files for the file browser modal
  const { data: allWorkspaceFiles, isLoading: isLoadingAllFiles } = useFiles(
    filesBrowserPayload ? { crudPayload: filesBrowserPayload } : undefined,
  );

  function ensureResourceDetailsFetched(
    selectedResources: QuizResource[],
    currentDetailFileId: string | null,
    allWorkspaceFiles: any,
  ) {
    // Don't try to fetch if we're already fetching something
    if (currentDetailFileId) return;

    // Find a resource without details that's not temporary and hasn't had fetch attempted
    const resourceWithoutDetails = selectedResources.find(
      resource => !resource.isTemporary && !resource.detailsFetched,
    );

    if (resourceWithoutDetails) {
      const old_file = resourceWithoutDetails;
      let file =
        resourceWithoutDetails.completion_percentage &&
        resourceWithoutDetails.workspace_file_id &&
        allWorkspaceFiles?.files.find(
          (f: WorkspaceFile) => f.workspace_file_id === resourceWithoutDetails.workspace_file_id,
        );
      // If file = null, see if there's a match based on filename
      if (!file) {
        const matchingFile = allWorkspaceFiles?.files.find(
          (f: WorkspaceFile) => f.filename === resourceWithoutDetails.filename,
        );
        file = matchingFile;
      }
      if (file?.completion_percentage === 100 || old_file?.completion_percentage === 100) {
        setCurrentDetailFileId(resourceWithoutDetails.workspace_file_id);
      }
    }
  }

  // Process all non-temporary resources to fetch their details
  useEffect(() => {
    ensureResourceDetailsFetched(selectedResources, currentDetailFileId, allWorkspaceFiles);
  }, [selectedResources, currentDetailFileId, allWorkspaceFiles]);

  // All available files for browsing in the modal
  const allAvailableFiles = allWorkspaceFiles?.files?.filter(
    file => file.status === WorkspaceFileUploadStatus.FINISHED,
  );

  const handleCreateQuiz = () => {
    // Since this is triggered from the trigger button which doesn't have a file,
    // we'll just open the modal without a file
    const variant = searchParams.get('tab') === 'Quiz' ? 'quiz' : 'flashcards';
    open(variant);
  };

  const handleAddResource = () => {
    isSelectMenuOpen.setValue(true);
  };

  const handleOpenFilesModal = () => {
    setIsFilesModalOpen(true);
    isSelectMenuOpen.setValue(false);
  };

  const handleFileSelect = (file: WorkspaceFile) => {
    if (selectedResources.some(resource => resource.workspace_file_id === file.workspace_file_id)) {
      // If file is already selected, remove it
      setSelectedResources(prev => prev.filter(resource => resource.workspace_file_id !== file.workspace_file_id));
    } else {
      // If file is not selected, add it
      const newResource: QuizResource = {
        ...file,
        filename: file.filename || '',
        detailsFetched: false,
      };
      setSelectedResources([...selectedResources, newResource]);
    }
  };

  // Drag & Drop case - adding files that have already been uploaded
  useEffect(() => {
    if (!allWorkspaceFiles?.files) return;
    // GOAL: Capture files that have been dragged and dropped into the upload box by checking which files are not in selectedFiles but have a completion percentage of < 100
    const filesWithCompletionPercentageLessThan100 = allWorkspaceFiles.files.filter(
      file =>
        file.completion_percentage &&
        file.completion_percentage < 100 &&
        (file.status === WorkspaceFileUploadStatus.PENDING || file.status === WorkspaceFileUploadStatus.UPLOADING),
    );

    const filesNotInSelectedResources = filesWithCompletionPercentageLessThan100.filter(
      file =>
        !resourcesToNotAutoAdd.some(resource => resource.workspace_file_id === file.workspace_file_id) &&
        !selectedResources.some(resource => resource.workspace_file_id === file.workspace_file_id),
    );
    if (filesNotInSelectedResources.length > 0) {
      setSelectedResources(prevResources => [...prevResources, ...filesNotInSelectedResources]);
    }
  }, [allWorkspaceFiles]);

  // Drag + drop - files that have not been uploaded yet
  useEffect(() => {
    if (!allWorkspaceFiles?.files) return;
    // GOAL: Capture files that have been dragged and dropped into the upload box by checking which files are not in selectedFiles but have a completion percentage of < 100
    const filesWithCompletionPercentage0 = allWorkspaceFiles.files.filter(file => file.completion_percentage === 0);

    // Add Temporary files for each file with completion percentage 0
    const temporaryFiles = filesWithCompletionPercentage0.map(file => ({
      ...file,
      isTemporary: true,
    }));

    // Filter out files that are already in selectedResources by sha256
    let temporaryFilesNotInSelectedResources = temporaryFiles.filter(
      file => !selectedResources.some(resource => resource.sha256 === file.sha256),
    );

    // If filename contains youtube.com and is = to decoded quick, then don't add it to selectedResources
    temporaryFilesNotInSelectedResources = temporaryFilesNotInSelectedResources.filter(
      file => !file.filename.includes('youtube.com'),
    );

    // add to selectedResources
    setSelectedResources(prevResources => [...prevResources, ...temporaryFilesNotInSelectedResources]);
  }, [allWorkspaceFiles]);

  // Drag + drop - convert the old temp files to actual files
  useEffect(() => {
    if (!allWorkspaceFiles?.files) return;
    // Filter workspace files to only include files that ARE in selectedResources
    const filesInSelectedResources = allWorkspaceFiles.files.filter(file =>
      selectedResources.some(resource => resource.filename === file.filename && resource.isTemporary === true),
    );

    // Basically take each entry, and set the workspace_file_id and set isTemporary to false
    filesInSelectedResources.forEach(file => {
      const matchingResource = selectedResources.find(resource => resource.filename === file.filename);
      if (matchingResource) {
        matchingResource.workspace_file_id = file.workspace_file_id;
        matchingResource.isTemporary = false;
      }
      if (matchingResource) {
        setSelectedResources(prevResources => [
          ...prevResources.filter(resource => resource.filename !== matchingResource.filename),
          matchingResource,
        ]);
      }
    });

    // For each of the matches where the current resource is temporary, replace it with the actual file
  }, [allWorkspaceFiles]);

  useEffect(() => {
    if (selectedResources.length > 0 && searchParams.get('tab') === 'Quiz') {
      if (!isOpen) {
        const variant = searchParams.get('tab') === 'Quiz' ? 'quiz' : 'flashcards';
        open(variant);
      }
    }
  }, [selectedResources]);

  // Watch settled files and look for failed files to remove from selectedResources
  useEffect(() => {
    if (settledFiles.length > 0) {
      const failedFiles = settledFiles.filter(file => file.status === WorkspaceFileUploadStatus.FAILED);
      // Check by filename if the failed files are in selectedResources
      const failedFilesInSelectedResources = failedFiles.filter(file =>
        selectedResources.some(resource => resource.filename === file.filename),
      );
      // Remove the failed files from selectedResources
      setSelectedResources(prevResources =>
        prevResources.filter(
          resource => !failedFilesInSelectedResources.some(file => file.filename === resource.filename),
        ),
      );
    }
  }, [settledFiles]);

  const handleFileUpload = useCallback(
    async (acceptedFiles: any) => {
      try {
        // Upload the files using the chat ID
        const { result } = await uploadFiles(acceptedFiles.acceptedFiles, crudPayload);
        // Create temporary representations of files until they're processed
        const newResources: QuizResource[] = result
          .filter((file): file is typeof file & { workspace_file_id: string } => Boolean(file?.workspace_file_id))
          .map(file => ({
            workspace_file_id: file.workspace_file_id,
            filename: file.file.name,
            type: file.file.type,
            size: file.file.size,
            last_modified: file.file.lastModified,
          }));

        setSelectedResources([...selectedResources, ...newResources]);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    },
    [uploadFiles, selectedResources, workspaceId],
  );

  const removeResource = (resourceId: string) => {
    setSelectedResources(selectedResources.filter(resource => resource.workspace_file_id !== resourceId));
  };

  const handleOpenYoutubeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsYoutubeModalOpen(true);
    isSelectMenuOpen.setValue(false);
  };

  const renderUploadMenu = () => (
    <Select.Root
      w={'100%'}
      positioning={{ sameWidth: true }}
      open={isSelectMenuOpen.value}
      onOpenChange={details => isSelectMenuOpen.setValue(details.open)}
      items={['From Computer', 'From Uploaded Files', 'From Youtube']}>
      <Select.Control>
        <Select.Trigger
          borderColor="#4141410D"
          borderRadius={'md'}
          justifyContent="between"
          textAlign="center"
          display="inline-flex"
          width="auto"
          px={8}
          py={0}
          color="black"
          shadow={'sm'}
          onClick={event => {
            event.stopPropagation();
            handleAddResource();
          }}>
          <PlusIcon color="black" size={12} />
          <Select.ValueText
            fontSize="13px"
            placeholder={t('chat.dragToUpload.select.placeholder')}
            textAlign="center"
            fontWeight={500}
          />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup id="uploads">
            <FileUpload.Trigger asChild onClick={e => e.stopPropagation()}>
              <Select.Item key={'From Computer'} item={'item'} w={'100%'}>
                <HStack gap={2}>
                  <LaptopIcon color="rgba(21, 17, 43, 0.9)" size={18} />
                  <Select.ItemText fontSize={'xs'} textAlign="start">
                    {t('chat.dragToUpload.select.computer')}
                  </Select.ItemText>
                </HStack>
              </Select.Item>
            </FileUpload.Trigger>
            <Select.Item key={'From Uploaded Files'} item={'item2'} w={'100%'} onClick={handleOpenFilesModal}>
              <HStack gap={2}>
                <VectorIcon />
                <Select.ItemText fontSize={'xs'} whiteSpace={'nowrap'} textAlign="start">
                  {t('chat.dragToUpload.select.files')}
                </Select.ItemText>
              </HStack>
            </Select.Item>
            <Select.Item key={'From Youtube'} item={'item3'} w={'100%'} onClick={handleOpenYoutubeModal}>
              <HStack gap={2}>
                <YoutubeIcon />
                <Select.ItemText fontSize={'xs'} whiteSpace={'nowrap'} textAlign="start">
                  {t('chat.fileUpload.youtube.uploadFrom')}
                </Select.ItemText>
              </HStack>
            </Select.Item>
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );

  // Handle final quiz creation
  const handleQuizCreation = useCallback(() => {
    setCreatingQuiz(true);

    // Generate dynamic status messages based on selected resources and topics
    const generateDynamicStatusMessages = () => {
      const messages = [
        {
          id: 'getting-ready',
          message: 'Getting ready...',
          type: 'intro',
        },
      ];

      // Add study material messages - these will display for 4s each
      selectedResources.forEach((resource, index) => {
        const fileName = extractFileName(resource.filename);
        messages.push({
          id: `study-material-${resource.workspace_file_id}`, // Ensure unique IDs even with duplicate filenames
          message: t('quiz.quiz_view.stepper.studying', { fileName: fileName.slice(0, 40) }),
          type: 'material',
        });
      });

      // Add topic messages - these will display for 2s each
      selectedTopics.forEach((topic, index) => {
        messages.push({
          id: `topic-${index}-${topic.replace(/\s+/g, '-').toLowerCase()}`, // More unique IDs
          message: t('quiz.quiz_view.stepper.diving_into', { topic: topic.slice(0, 40) }),
          type: 'topic',
        });
      });

      // Add final stages
      messages.push(
        {
          id: 'customizing-quiz',
          message: t('quiz.quiz_view.stepper.customizing'),
          type: 'final',
        },
        {
          id: 'generating-quiz',
          message: t('quiz.quiz_view.stepper.generating'),
          type: 'final',
        },
        {
          id: 'finalizing-quiz',
          message: t('quiz.quiz_view.stepper.finalizing'),
          type: 'final',
        },
      );

      return messages;
    };

    // Use dynamic messages and start animation
    const dynamicMessages = generateDynamicStatusMessages();
    setDynamicStatusMessages(dynamicMessages);
    setActiveMessageIndex(0);

    // Map selected question types to the QuestionType enum values
    const mapQuestionTypeToEnum = (type: string): QuestionType | undefined => {
      // First convert the translated type back to English
      const englishType = reverseQuestionTypeMap[type];

      switch (englishType) {
        case 'Multiple choice':
          return QuestionType.MULTIPLE_CHOICE;
        case 'True or false':
          return QuestionType.TRUE_FALSE;
        case 'Short response':
          return QuestionType.SHORT_ANSWER;
        case 'Fill in the blank':
          return QuestionType.FILL_IN_BLANK;
        default:
          return undefined;
      }
    };

    // Create array of QuestionType enum values
    const questionTypes = selectedQuestionTypes
      .map(mapQuestionTypeToEnum)
      .filter((type): type is QuestionType => type !== undefined);

    // Extract file IDs from selected resources
    const fileIds = selectedResources.map(resource => resource.workspace_file_id);

    const generate = (variant === 'flashcards' ? generateFlashcardSet : generateQuiz) as (
      variables: GenerateQuizQuery | GenerateFlashcardQuery,
      options?: {
        onError?: (error: AxiosError) => void;
        onSuccess?: (response: GenerateQuizResponse | GenerateFlashcardResponse) => void;
      },
    ) => void;
    const generateParams =
      variant === 'flashcards'
        ? { workspace_file_ids: fileIds, topics: selectedTopics }
        : {
            workspace_file_ids: fileIds,
            topics: selectedTopics.length > 0 ? selectedTopics : undefined,
            question_types: questionTypes.length > 0 ? questionTypes : undefined,
            is_unlimited: selectedQuizMode === 'grind',
          };

    // Generate the quiz
    generate(generateParams, {
      onError: (error: AxiosError) => {
        // Reset the quiz view
        setCreatingQuiz(false);
      },
      onSuccess: (response: GenerateQuizResponse | GenerateFlashcardResponse) => {
        // Add a "Quiz Ready" message at the end
        setDynamicStatusMessages(prevMessages => {
          const newMessages = [
            ...prevMessages,
            {
              id: 'quiz-ready',
              message: t('quiz.quiz_view.stepper.quiz_ready')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              type: 'success',
            },
          ];
          if (variant === 'quiz') {
            mixpanel.track(EventName.QuizCreated, {
              quiz_id: (response as GenerateQuizResponse).quiz.quiz_id,
              question_types: questionTypes,
              quiz_mode: selectedQuizMode,
            });
          } else if (variant === 'flashcards') {
            mixpanel.track(EventName.FlashcardStarted, {
              path: window.location.pathname,
              source: 'quiz_view',
            });
          }
          // Set the active message index to show the Quiz Ready message
          // We need to do this outside the state update to avoid race conditions
          setTimeout(() => {
            setActiveMessageIndex(newMessages.length - 1);
          }, 0);

          return newMessages;
        });

        // Wait 3 seconds before redirecting
        setTimeout(() => {
          // Invalidate the quiz query
          if (variant === 'flashcards') {
            queryClient.invalidateQueries([GET_RECENT_FLASHCARDS_QUERY_KEY]);
            router.push(`/flashcards/${(response as GenerateFlashcardResponse).flashcard_set.set_id}`);
          } else {
            queryClient.invalidateQueries([GET_RECENT_QUIZES_QUERY_KEY]);
            router.push(`/quiz/${(response as GenerateQuizResponse).quiz.quiz_id}`);
          }
          close();
        }, 3000);
      },
    });
  }, [selectedResources, selectedTopics, selectedQuestionTypes, router, generateQuiz]);

  // Add function to toggle topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => (prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]));
  };

  // Add utility function to extract topics from resources
  const extractTopicsFromResources = (resources: QuizResource[]) => {
    return Array.from(
      new Set(
        resources
          .flatMap(resource => {
            const fileTopics = resource.fileDetails
              ? (resource.fileDetails as any).topics || (resource.fileDetails as any).metadata?.topics || []
              : [];
            return fileTopics;
          })
          .filter(Boolean),
      ),
    );
  };

  // Add function to handle select all/clear all topics
  const handleSelectAllTopics = () => {
    // Get all available topics from resources and loaded topics
    const allAvailableTopics = Array.from(
      new Set([...extractTopicsFromResources(selectedResources), ...(loadedTopics || [])]),
    );

    // Check if all topics are already selected
    const allTopicsSelected = allAvailableTopics.every(topic => selectedTopics.includes(topic));

    if (allTopicsSelected) {
      // If all are selected, clear all
      setSelectedTopics([]);
    } else {
      // If not all are selected, select all
      setSelectedTopics(allAvailableTopics);
    }
  };

  // Add function to toggle question type selection
  const toggleQuestionType = (type: string) => {
    setSelectedQuestionTypes(prev => {
      // Don't allow deselecting the last remaining type
      if (prev.includes(type) && prev.length === 1) {
        return prev;
      }
      return prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
    });
  };

  // Handle quiz mode selection
  const handleQuizModeSelect = (mode: 'test' | 'grind') => {
    // Trigger the reward animation for the selected button
    if (mode === 'test') {
      testModeReward();
    } else if (mode === 'grind') {
      grindModeReward();
    }

    if (mode === selectedQuizMode) {
      return;
    }

    setSelectedQuizMode(mode);
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  return (
    <>
      {!hideTrigger && (
        <UploadActionBox
          title={`${t('landing.uploadWizard.quiz.title.test')}|${t('landing.uploadWizard.quiz.title.quiz')}`}
          description={t('landing.uploadWizard.quiz.description')}
          buttonText={t('chat.dragToUpload.select.placeholder')}
          buttonIcon={<PlusIcon size={18} />}
          onClick={() => {
            handleCreateQuiz();
            mixpanel.track(EventName.QuizModalOpened, {
              path: window.location.pathname,
              source: 'home',
            });
          }}
          additionalContent={
            <img src="/images/action-box-thumbnails/quiz_no_shadow.jpeg" alt="quiz" width={120} height={120} />
          }
        />
      )}

      {/* Primary Quiz Selection Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={open => {
          if (creatingQuiz) {
            toast.error(t('quiz.generate_quiz_modal.quiz_is_being_created'));
            return;
          }
          if (!open) {
            close();
          }
        }}
        width="900px">
        {creatingQuiz ? (
          <styled.div
            minHeight={'550px'}
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
            pt={48}
            alignItems={'center'}>
            <styled.div
              position="relative"
              height={'240px'}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              overflow="visible">
              {/* Add invisible placeholders above the main container for exit animations */}
              <styled.div position="absolute" top="-100px" width="100%" overflow="visible" pointerEvents="none">
                <AnimatePresence>
                  {previousActiveMessage && (
                    <MotionStyledP
                      key={`exiting-${previousActiveMessage.id}`}
                      layoutId={`exiting-${previousActiveMessage.id}`}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{
                        opacity: 0,
                        y: -60,
                        scale: 0.85,
                      }}
                      transition={{
                        opacity: { duration: 0.6 },
                      }}
                      exit={{
                        opacity: 0,
                        y: -120,
                        filter: 'blur(6px)',
                        transition: {
                          opacity: { duration: 0.6 },
                          filter: { duration: 0.4 },
                        },
                      }}
                      fontSize={'lg'}
                      fontWeight={'medium'}
                      position="absolute"
                      width="100%"
                      textAlign="center"
                      top="0"
                      py={0}
                      my={0}>
                      {previousActiveMessage.message}
                    </MotionStyledP>
                  )}
                </AnimatePresence>
              </styled.div>

              <AnimatePresence>
                {visibleMessages.map(({ message, position, isNextUpMaterial = false }: VisibleMessage, index) => {
                  const messageId = message.id;
                  const messageType = message.type;

                  // Different animation behavior based on position
                  return (
                    <MotionStyledP
                      key={messageId}
                      layoutId={messageId}
                      fontSize={position === 0 ? '3xl' : isNextUpMaterial ? 'xl' : 'lg'}
                      fontWeight={'medium'}
                      position="absolute"
                      top={position === 0 ? '0' : `${position * (180 / 5)}px`} // Increase spacing between items
                      my={0}
                      mb={position === 0 ? 2 : 0}
                      py={0}
                      zIndex={5 - position} // Simplified z-index based on 5 visible items
                      transition={{
                        type: 'spring',
                        bounce: 0,
                        duration: 1,
                      }}
                      initial={
                        position === 0
                          ? { y: 50, opacity: 0, filter: 'none', scale: 0.92 }
                          : {
                              y: 0,
                              opacity: isNextUpMaterial
                                ? 0.7 // Higher opacity for next material message
                                : Math.max(0, 1 - position * 0.3), // Increase opacity falloff
                              filter: isNextUpMaterial
                                ? `blur(1px)` // Less blur for next material message
                                : `blur(${Math.min(position * 2, 6)}px)`, // Progressive blur
                              color: isNextUpMaterial
                                ? `rgba(0,0,0,0.8)` // Darker color for next material message
                                : `rgba(0,0,0,${0.8 - position * 0.12})`,
                            }
                      }
                      animate={
                        position === 0
                          ? {
                              y: -10,
                              opacity: 1,
                              filter: 'none',
                              scale: 1,
                              transition: {
                                type: 'spring',
                                bounce: 0.2,
                                duration: 1,
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.5, type: 'spring', bounce: 0.3 },
                              },
                            }
                          : {
                              opacity: isNextUpMaterial
                                ? 0.7 // Higher opacity for next material message
                                : Math.max(0, 1 - position * 0.3), // Increase opacity falloff
                              top: `${position * (180 / 5)}px`, // Increased spacing
                              filter: isNextUpMaterial
                                ? `blur(1px)` // Less blur for next material message
                                : `blur(${Math.min(position * 2, 6)}px)`, // Progressive blur
                              color: isNextUpMaterial
                                ? `rgba(0,0,0,0.8)` // Darker color for next material message
                                : `rgba(0,0,0,${0.8 - position * 0.12})`,
                            }
                      }
                      exit={
                        position === 0
                          ? {
                              y: -60,
                              opacity: 0,
                              scale: 0.85,
                              filter: 'blur(5px)',
                              transition: {
                                duration: 0.5,
                                y: { type: 'spring', bounce: 0, duration: 1 },
                                filter: { duration: 0.4 },
                                opacity: { duration: 0.6 },
                              },
                            }
                          : {
                              opacity: 0,
                              filter: 'blur(3px)',
                              transition: {
                                opacity: { duration: 0.4 },
                                filter: { duration: 0.3 },
                              },
                            }
                      }>
                      {position === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: position === 0 ? 1 : 0 }}
                          transition={{ duration: 0.5 }}>
                          <MotionDiv
                            background={
                              messageType === 'intro'
                                ? 'linear-gradient(90deg, #6d56fa, #9b8cfa, #6d56fa, #4a32fa, #6d56fa)'
                                : messageType === 'material'
                                  ? 'linear-gradient(90deg, #56B4FA, #56DAEF, #56B4FA, #3E94D1, #56B4FA)'
                                  : messageType === 'topic'
                                    ? 'linear-gradient(90deg, #FA7856, #FABD56, #FA7856, #D15B3E, #FA7856)'
                                    : messageType === 'success'
                                      ? 'linear-gradient(90deg, #4CAF50, #8BC34A, #4CAF50, #2E7D32, #4CAF50)'
                                      : 'linear-gradient(90deg, #6d56fa, #9b8cfa, #6d56fa, #4a32fa, #6d56fa)'
                            }
                            backgroundSize="300% auto"
                            color="transparent"
                            backgroundClip="text"
                            style={{
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              display: 'inline-block',
                            }}
                            initial={{
                              backgroundPosition: '0% center',
                              filter: 'brightness(0.2) contrast(0.8)',
                            }}
                            animate={{
                              backgroundPosition: ['0% center', '300% center'],
                              filter: ['brightness(0.2) contrast(0.8)', 'brightness(1) contrast(1)'],
                            }}
                            exit={{
                              backgroundPosition: '0% center',
                              filter: 'brightness(0.2) contrast(0.8)',
                            }}
                            transition={{
                              backgroundPosition: {
                                repeat: Infinity,
                                duration:
                                  messageType === 'topic'
                                    ? 2
                                    : messageType === 'material'
                                      ? 5
                                      : messageType === 'success'
                                        ? 7
                                        : 4,
                                ease: 'linear',
                              },
                              filter: {
                                duration: messageType === 'topic' ? 0.5 : messageType === 'success' ? 2 : 1.5,
                                ease: 'easeOut',
                              },
                            }}>
                            {message.message}
                          </MotionDiv>
                        </motion.div>
                      ) : (
                        message.message
                      )}
                    </MotionStyledP>
                  );
                })}
              </AnimatePresence>
            </styled.div>
          </styled.div>
        ) : (
          <>
            <styled.div
              py={6}
              px={6}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
              height={'100%'}
              minHeight={'550px'}>
              <styled.div display={'flex'} justifyContent={'space-between'} flexDirection={'column'} gap={4}>
                <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <styled.div display={'flex'} gap={3}>
                    {steps.map((step, index) => (
                      <StepperItem
                        key={index}
                        number={index + 1}
                        label={step.name}
                        isActive={index === currentStep}
                        isDisabled={index > currentStep}
                        onClick={() => index <= currentStep && setCurrentStep(index)}
                      />
                    ))}
                  </styled.div>
                  <styled.button cursor={'pointer'} onClick={() => close()}>
                    <XIcon size={16} />
                  </styled.button>
                </styled.div>

                <styled.div display={'flex'} flexDirection={'column'} gap={1}>
                  <styled.h3 mb={0} fontWeight={'medium'} fontSize={'xl'}>
                    {steps[currentStep]?.longName}
                  </styled.h3>
                  <styled.p fontSize={'sm'} color={'rgba(0,0,0,0.5)'}>
                    {steps[currentStep]?.description}
                  </styled.p>
                </styled.div>

                {/* Step 1: Resources */}
                {currentStep === 0 && (
                  <>
                    <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <styled.h4 fontSize={'sm'} fontWeight={'medium'}>
                        {t('quiz.quiz_view.selected_resources')}
                      </styled.h4>

                      <FileUpload.Root
                        w={'fit-content'}
                        onFileChange={acceptedFiles => {
                          setUploadKey(prev => prev + 1);
                          handleFileUpload(acceptedFiles);
                        }}
                        maxFiles={20}
                        accept={ACCEPTED_FILE_TYPES}
                        key={uploadKey}>
                        {renderUploadMenu()}
                        <FileUpload.HiddenInput />
                      </FileUpload.Root>
                    </styled.div>
                    <styled.div
                      borderColor={'rgba(0,0,0,0.0.04'}
                      borderWidth={'1px'}
                      display={'grid'}
                      gridTemplateColumns={'1fr 1fr'}
                      gridAutoRows={'max-content'}
                      gridGap={'12px'}
                      minHeight={'200px'}
                      backgroundColor={'rgba(0,0,0,0.03)'}
                      p={4}
                      rounded={'lg'}>
                      {selectedResources.length === 0 && (
                        <styled.div
                          gridColumn={'1 / -1'}
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          w={'100%'}
                          h={'100%'}
                          minHeight={'150px'}>
                          <styled.p pt={6} fontSize={'sm'} color={'rgba(0,0,0,0.5)'}>
                            {t('quiz.quiz_view.no_resources')}{' '}
                            <styled.a cursor="pointer" onClick={() => isSelectMenuOpen.setValue(true)}>
                              {t('chat.dragToUpload.select.placeholder')}
                            </styled.a>
                          </styled.p>
                        </styled.div>
                      )}
                      {selectedResources.map((resource, index) => {
                        const fileExtension = getFileExtension(resource.filename);
                        const fileName = extractFileName(resource.filename);
                        return (
                          <styled.div
                            key={index}
                            backgroundColor="white"
                            p={3}
                            height={'fit-content'}
                            rounded="md"
                            shadow="sm"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between">
                            <styled.div display="flex" alignItems="center" gap={2}>
                              <FileItemExtension extension={fileExtension} iconSize={16} fontSize="10px" />
                              <styled.span
                                fontSize="sm"
                                fontWeight="medium"
                                css={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  maxWidth: '160px',
                                  whiteSpace: 'nowrap',
                                }}>
                                {fileName}
                              </styled.span>
                            </styled.div>
                            <styled.button
                              onClick={e => {
                                e.stopPropagation();
                                setResourcesToNotAutoAdd(prev => [...prev, resource]);
                                removeResource(resource.workspace_file_id);
                              }}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              bg="transparent"
                              border="none"
                              cursor="pointer"
                              _hover={{ opacity: 0.7 }}>
                              {allWorkspaceFiles?.files ? (
                                (allWorkspaceFiles.files.find(f => f.workspace_file_id === resource.workspace_file_id)
                                  ?.completion_percentage ?? 100) < 100 ? (
                                  <styled.div display="flex" alignItems="center" gap={2}>
                                    <Badge colorScheme="green" fontSize="xs" px={2} py={1} rounded="full">
                                      {t('quiz.quiz_view.uploading')}
                                    </Badge>
                                    <XIcon size={14} />
                                  </styled.div>
                                ) : (
                                  <XIcon size={14} />
                                )
                              ) : (
                                <XIcon size={14} />
                              )}
                            </styled.button>
                          </styled.div>
                        );
                      })}
                    </styled.div>
                  </>
                )}

                {/* Step 2: Customize */}
                {currentStep === 1 && (
                  <styled.div>
                    <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <styled.h4 mb={4} fontSize="md" fontWeight="medium">
                        {t('quiz.quiz_view.select_topics')}
                      </styled.h4>
                      <styled.button
                        fontSize={'xs'}
                        cursor={'pointer'}
                        fontWeight={'medium'}
                        bg={'rgba(0,0,0,0.03)'}
                        borderRadius={'md'}
                        borderWidth={'1px'}
                        borderColor={'rgba(0,0,0,0.1)'}
                        px={3}
                        py={1}
                        _hover={{ bg: 'rgba(0,0,0,0.05)' }}
                        onClick={handleSelectAllTopics}>
                        {Array.from(
                          new Set([...extractTopicsFromResources(selectedResources), ...(loadedTopics || [])]),
                        ).every(topic => selectedTopics.includes(topic))
                          ? t('quiz.quiz_view.clear_all')
                          : t('quiz.quiz_view.select_all')}
                      </styled.button>
                    </styled.div>
                    <styled.div display="flex" flexWrap="wrap" maxHeight={'200px'} overflow={'auto'} gap={2}>
                      {/* Extract and flatten all unique topics from all resources and loaded topics */}
                      {Array.from(
                        new Set([...extractTopicsFromResources(selectedResources), ...(loadedTopics || [])]),
                      ).map((topic: string, index: number) => {
                        // Check if this topic is selected
                        const isSelected = selectedTopics.includes(topic);
                        return (
                          <styled.div
                            key={`topic-${index}`}
                            px={3}
                            py={2}
                            borderColor="#4141410D"
                            borderRadius={'md'}
                            borderWidth={'1px'}
                            fontSize={'xs'}
                            color={isSelected ? 'white' : 'rgba(0,0,0,0.7)'}
                            bg={isSelected ? '#6D56FA' : 'transparent'}
                            fontWeight="medium"
                            rounded="lg"
                            cursor="pointer"
                            _hover={{ bg: isSelected ? '#5D46EA' : 'rgba(109, 86, 250, 0.1)' }}
                            transition="all 0.2s"
                            onClick={() => toggleTopic(topic)}>
                            {topic}
                          </styled.div>
                        );
                      })}

                      {/* Show message if no topics are found */}
                      {!selectedResources.some(
                        r => (r.fileDetails as any)?.topics?.length || (r.fileDetails as any)?.metadata?.topics?.length,
                      ) && (
                        <styled.div p={4} textAlign="center" w="100%" color="gray.500">
                          {t('quiz.quiz_view.no_topics')}
                        </styled.div>
                      )}
                    </styled.div>

                    {/* Custom Topics Section */}
                    <styled.div mt={6}>
                      <styled.h4 mb={2} fontSize="sm" fontWeight="medium">
                        {t('quiz.quiz_view.custom_topics')}
                      </styled.h4>
                      <styled.textarea
                        placeholder="e.g. history, world war 2, ancient rome, scientific method, quantum physics, biology, human anatomy, environmental science, literature, poetry analysis, creative writing, algebra, calculus, computer science, programming"
                        w="100%"
                        fontSize="xs"
                        minH="80px"
                        p={3}
                        borderColor="rgba(0,0,0,0.1)"
                        borderRadius="md"
                        bg="rgba(0,0,0,0.03)"
                        _focus={{ borderColor: '#6D56FA', outline: 'none' }}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const inputText = e.target.value;
                          if (!inputText.trim()) {
                            setSelectedTopics([]);
                          }

                          // Split by comma and trim each topic
                          const newTopics = inputText
                            .split(',')
                            .map(t => t.trim())
                            .filter(t => t.length > 0);

                          // Add to selected topics without duplicates
                          setSelectedTopics(prev => {
                            const combined = [...prev];
                            newTopics.forEach(topic => {
                              if (!combined.includes(topic)) {
                                combined.push(topic);
                              }
                            });
                            return combined;
                          });
                        }}
                      />
                      <styled.p fontSize="xs" color="rgba(0,0,0,0.5)" mt={1}>
                        {t('quiz.quiz_view.separate_custom_topics')}
                      </styled.p>
                    </styled.div>
                  </styled.div>
                )}

                {/* Step 3: Settings */}
                {currentStep === 2 && (
                  <styled.div display={'flex'} flexDirection={'column'} gap={6}>
                    <styled.div display={'flex'} flexDirection={'column'} gap={2}>
                      <styled.h4 mb={0} fontSize="md" fontWeight="medium">
                        {t('quiz.quiz_view.choose_mode')}
                      </styled.h4>
                      <styled.div display={'grid'} gridTemplateColumns={'1fr 1fr'} gap={2}>
                        <styled.button
                          overflow={'hidden'}
                          fontSize={'md'}
                          fontWeight={'medium'}
                          py={5}
                          borderRadius={'md'}
                          cursor={'pointer'}
                          borderWidth={'1px'}
                          borderColor={selectedQuizMode === 'test' ? '#6D56FA' : 'rgba(0,0,0,0.1)'}
                          backgroundColor={selectedQuizMode === 'test' ? 'rgba(109, 86, 250, 0.1)' : 'transparent'}
                          color={selectedQuizMode === 'test' ? '#6D56FA' : 'inherit'}
                          display={'flex'}
                          flexDirection={'column'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          gap={2}
                          px={4}
                          onClick={() => handleQuizModeSelect('test')}
                          transition="all 0.2s"
                          position="relative"
                          _hover={{
                            backgroundColor:
                              selectedQuizMode === 'test' ? 'rgba(109, 86, 250, 0.15)' : 'rgba(0,0,0,0.03)',
                            borderColor: selectedQuizMode === 'test' ? '#6D56FA' : 'rgba(0,0,0,0.2)',
                          }}>
                          <span
                            id="testModeReward"
                            style={{
                              position: 'absolute',
                              userSelect: 'none',
                              touchAction: 'none',
                              top: '50%',
                              left: '50%',
                            }}
                          />
                          <styled.p mb={0}>{t('quiz.quiz_view.test_your_skills')}</styled.p>
                          <styled.p fontSize={'xs'} opacity={0.6} mb={0}>
                            ~ {t('quiz.quiz_view.num_questions', { num: 20 })}
                          </styled.p>
                        </styled.button>
                        <MotionStyledButton
                          overflow={'hidden'}
                          disabled={hasClickedGrindMode}
                          opacity={hasClickedGrindMode ? 0.5 : 1}
                          cursor={hasClickedGrindMode ? 'not-allowed' : 'pointer'}
                          fontSize={'md'}
                          fontWeight={'medium'}
                          py={5}
                          borderRadius={'md'}
                          borderWidth={'1px'}
                          borderColor={selectedQuizMode === 'grind' ? '#6D56FA' : 'rgba(0,0,0,0.1)'}
                          backgroundColor={selectedQuizMode === 'grind' ? 'rgba(109, 86, 250, 0.1)' : 'transparent'}
                          color={selectedQuizMode === 'grind' ? '#6D56FA' : 'inherit'}
                          display={'flex'}
                          flexDirection={'column'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          gap={2}
                          px={4}
                          _hover={{
                            backgroundColor:
                              selectedQuizMode === 'grind' ? 'rgba(109, 86, 250, 0.15)' : 'rgba(0,0,0,0.03)',
                            borderColor: selectedQuizMode === 'grind' ? '#6D56FA' : 'rgba(0,0,0,0.2)',
                          }}
                          onClick={() => {
                            if (!hasClickedGrindMode) {
                              handleQuizModeSelect('grind');
                              mixpanel.track(EventName.UnlimitedModeClicked);
                            }
                          }}
                          position="relative"
                          id="grindButton">
                          <styled.div
                            position="absolute"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            top={2}
                            right={2}
                            rounded="md"
                            bg="#6D56FA"
                            color="white">
                            Out Now
                          </styled.div>
                          <span id="grindModeReward" style={{ position: 'absolute', top: '50%', left: '50%' }} />
                          <styled.p mb={0}>{t('quiz.quiz_view.grind_away')}</styled.p>
                          <styled.p fontSize={'xs'} opacity={0.6} mb={0}>
                            {t('quiz.quiz_view.unlimited_questions')}
                          </styled.p>
                        </MotionStyledButton>
                      </styled.div>
                    </styled.div>

                    {/* Add Question Type Picker */}
                    <styled.div display={'flex'} flexDirection={'column'} gap={2}>
                      <styled.h4 mb={0} fontSize="md" fontWeight="medium">
                        {t('quiz.quiz_view.question_types')}
                      </styled.h4>
                      <styled.div display={'flex'} flexWrap={'wrap'} gap={3}>
                        {Object.values(questionTypeMap).map(type => {
                          const isSelected = selectedQuestionTypes.includes(type);
                          return (
                            <MotionStyledButton
                              layout
                              key={type}
                              py={1}
                              initial={{ paddingRight: 36, paddingLeft: 12 }}
                              animate={{
                                paddingRight: isSelected ? 36 : 12,
                                paddingLeft: 12,
                              }}
                              transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                              borderRadius={'md'}
                              borderWidth={'1px'}
                              borderColor={isSelected ? '#F0EEFF' : 'rgba(0,0,0,0.1)'}
                              backgroundColor={isSelected ? '#F0EEFF' : 'white'}
                              color={isSelected ? '#6d56fa' : 'inherit'}
                              display={'flex'}
                              alignItems={'center'}
                              overflow="hidden"
                              fontSize={'sm'}
                              whiteSpace={'nowrap'}
                              position="relative"
                              transitionProperty="colors"
                              transitionDuration="200ms"
                              cursor="pointer"
                              onClick={() => toggleQuestionType(type)}
                              _hover={{
                                backgroundColor: isSelected ? 'rgba(109, 86, 250, 0.15)' : 'rgba(0,0,0,0.03)',
                              }}>
                              <motion.span>{type}</motion.span>
                              <AnimatePresence mode="popLayout">
                                {isSelected && (
                                  <MotionCheck
                                    layout
                                    initial={{ opacity: 1, filter: 'blur(0px)', right: 12 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', right: 12 }}
                                    exit={{ opacity: 0, filter: 'blur(2px)', right: 0 }}
                                    style={{ position: 'absolute' }}
                                    size={16}
                                  />
                                )}
                              </AnimatePresence>
                            </MotionStyledButton>
                          );
                        })}
                      </styled.div>
                    </styled.div>
                  </styled.div>
                )}
              </styled.div>

              <styled.div display={'flex'} justifyContent={'space-between'} mt={4}>
                {currentStep > 0 ? (
                  <styled.button
                    cursor="pointer"
                    justifyContent="center"
                    textAlign="center"
                    display="inline-flex"
                    width="auto"
                    px={4}
                    py={2}
                    color="rgba(0,0,0,0.6)"
                    fontSize={'sm'}
                    fontWeight={'medium'}
                    onClick={() => setCurrentStep(currentStep - 1)}>
                    {t('quiz.quiz_view.button_text.back')}
                  </styled.button>
                ) : (
                  <styled.div />
                )}
                <styled.button
                  cursor="pointer"
                  borderColor="#4141410D"
                  borderRadius={'md'}
                  justifyContent="center"
                  textAlign="center"
                  display="inline-flex"
                  width="auto"
                  px={4}
                  py={2}
                  color="#6D56FA"
                  backgroundColor="#6d56fa30"
                  fontSize={'sm'}
                  fontWeight={'medium'}
                  onClick={() => {
                    if (currentStep != 2) {
                      if (currentStep === 1 && variant === 'flashcards') {
                        handleQuizCreation();
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                      if (currentStep + 1 === 1) {
                        ensureResourceDetailsFetched(selectedResources, currentDetailFileId, allWorkspaceFiles);
                        mixpanel.track(EventName.QuizViewCustomizeStepTwoClicked);
                      } else if (currentStep + 1 === 2) {
                        mixpanel.track(EventName.QuizViewSettingsStepThreeClicked);
                      }
                    } else {
                      handleQuizCreation();
                    }
                  }}
                  disabled={
                    (currentStep === 0 && selectedResources.length === 0) ||
                    (currentStep === 0 &&
                      selectedResources.some(resource =>
                        allWorkspaceFiles?.files
                          ? (allWorkspaceFiles.files.find(f => f.workspace_file_id === resource.workspace_file_id)
                              ?.completion_percentage ?? 100) < 100
                          : false,
                      )) ||
                    (currentStep === 2 && selectedQuizMode === null)
                  }
                  _disabled={{
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: 'rgba(0,0,0,0.3)',
                    cursor: 'not-allowed',
                    borderColor: 'rgba(0,0,0,0.05)',
                  }}>
                  {currentStep < steps.length - 1
                    ? currentStep === 0 && selectedResources.length === 0
                      ? t('quiz.quiz_view.button_text.add_resources')
                      : // Check if files are still uploading
                        currentStep === 0 &&
                          selectedResources.some(resource =>
                            allWorkspaceFiles?.files
                              ? (allWorkspaceFiles.files.find(f => f.workspace_file_id === resource.workspace_file_id)
                                  ?.completion_percentage ?? 100) < 100
                              : false,
                          )
                        ? t('quiz.quiz_view.button_text.wait_for_uploads')
                        : currentStep === 1 && selectedTopics.length === 0
                          ? t('quiz.quiz_view.button_text.skip_topics')
                          : t('quiz.quiz_view.button_text.next')
                    : selectedQuizMode === null
                      ? currentStep === 1 && variant === 'flashcards'
                        ? t('quiz.quiz_view.button_text.create_quiz')
                        : t('quiz.quiz_view.button_text.select_quiz_mode')
                      : t('quiz.quiz_view.button_text.create_quiz')}
                </styled.button>
              </styled.div>
            </styled.div>
          </>
        )}
      </Modal>

      {/* Modal for showing existing files */}
      <Modal width="600px" isOpen={isFilesModalOpen} onOpenChange={setIsFilesModalOpen} zIndex={1100}>
        <Dialog.Title pt={4} px={8} fontSize={'20px'}>
          <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {t('quiz.quiz_view.select_from_files')}
            <styled.button cursor={'pointer'} onClick={() => setIsFilesModalOpen(false)}>
              <XIcon size={16} />
            </styled.button>
          </styled.div>
        </Dialog.Title>
        <styled.div position="relative" px={8} mt={-4} maxH="500px" overflow="auto">
          {isLoadingAllFiles ? (
            <styled.div p={6} textAlign="center">
              {t('quiz.quiz_view.loading_files')}
            </styled.div>
          ) : !allAvailableFiles || allAvailableFiles.length === 0 ? (
            <styled.div p={6} textAlign="center">
              {t('quiz.quiz_view.no_files_found')}
            </styled.div>
          ) : (
            <styled.div>
              <FlashcardFiles
                isFilterablebyFileType={true}
                isFilterableByClass={true}
                files={allAvailableFiles}
                isLoading={isLoadingAllFiles}
                onFileClick={handleFileSelect}
                selectedFiles={selectedResources.map(resource => ({
                  workspace_file_id: resource.workspace_file_id,
                  filename: resource.filename,
                  created_at: resource.created_at || 0,
                  last_modified: resource.created_at || 0,
                  url: '', // Required by WorkspaceFile but not available in QuizResource
                  status: WorkspaceFileUploadStatus.FINISHED,
                  completion_percentage: 100,
                }))}
              />
            </styled.div>
          )}
        </styled.div>
        <styled.div px={8} pb={4} pt={1} display={'flex'} justifyContent={'center'}>
          <styled.button
            onClick={() => setIsFilesModalOpen(false)}
            py={2}
            px={4}
            w={'100%'}
            rounded={'xl'}
            shadow={'sm'}
            fontWeight="medium"
            fontSize={'sm'}
            cursor={selectedResources.length > 0 ? 'pointer' : 'not-allowed'}
            borderTopWidth={'1px'}
            color={selectedResources.length > 0 ? 'white' : 'rgba(0,0,0,0.3)'}
            borderColor={selectedResources.length > 0 ? '#FFFFF10' : 'rgba(0,0,0,0.1)'}
            display={'flex'}
            alignItems={'center'}
            gap={2}
            justifyContent={'center'}
            _hover={{
              backgroundColor: selectedResources.length > 0 ? 'rgba(109, 86, 250, 0.9)' : 'rgba(0,0,0,0.05)',
            }}
            backgroundColor={selectedResources.length > 0 ? 'rgba(109, 86, 250, 1)' : 'rgba(0,0,0,0.05)'}>
            <PlusIcon size={16} />
            <styled.div display={'flex'} alignItems={'center'} gap={1}>
              {selectedResources.length > 0 ? (
                <>
                  <span>{t('quiz.quiz_view.done_adding_resources')}</span>
                  <span>
                    ({selectedResources.length} {t('quiz.quiz_view.selected')})
                  </span>
                </>
              ) : (
                <span>{t('quiz.quiz_view.select_files_from_list')}</span>
              )}
            </styled.div>
          </styled.button>
        </styled.div>
      </Modal>

      {/* Standalone YouTube upload button with our custom state management */}
      <styled.div display={'none'}>
        <UploadYoutubeButton
          variant="primary"
          disabled={impersonated}
          isOpenOverride={isYoutubeModalOpen}
          onOpenChangeOverride={setIsYoutubeModalOpen}
          modalZIndex={1100}
          crudPayload={workspaceId ? { workspace_id: workspaceId } : undefined}
          onSuccess={data => {
            // Add the YouTube video to selected resources
            const youtubeResource: QuizResource = {
              workspace_file_id: data.workspace_file_id,
              filename: `${data.external_media_name}.youtube`,
              isTemporary: false,
              detailsFetched: false,
            };
            setSelectedResources([...selectedResources, youtubeResource]);
            setIsYoutubeModalOpen(false);
          }}
        />
      </styled.div>
    </>
  );
};

QuizView.displayName = 'QuizView';

export default QuizView;
