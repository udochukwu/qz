import React, { useState, useEffect } from 'react';
import { styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { XIcon, InfoIcon, Download } from 'lucide-react';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import PlaybackConfirmView from './playback-confirm-view';
import EnhancedVoiceVisualizer from './enhanced-voice-visualizer';
import { useUploadAudio } from './hooks/use-upload-audio';
import { AudioFileResponse, IngestAudioPayload, IngestAudioResponse } from './types';
import { Alert } from '@/components/elements/alert';
import { Button } from '@/components/elements/button';
import { useIngestAudio } from './hooks/use-ingest-audio';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { useUpgradePlanModalStore } from '@/features/paywall/stores/upgrade-plan-modal';
import { useTranslation } from 'react-i18next';

interface RecordingViewProps {
  onDelete: () => void;
  onSaved: (r: IngestAudioResponse) => void;
  workspace_id?: string;
}

const RecordingView: React.FC<RecordingViewProps> = ({ onDelete, onSaved, workspace_id }) => {
  const { t } = useTranslation();

  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isProcessingRecordedAudio, setIsProcessingRecordedAudio] = useState(false);
  const { mutateAsync: uploadAudio, isError: isGettingUploadError, error: uploadError } = useUploadAudio();
  const [audioData, setAudioData] = useState<AudioFileResponse>();
  const [uploadHadErrors, setUploadHadErrors] = useState(false);
  const durationRef = React.useRef(0);
  const { mutateAsync: uploadFile } = useIngestAudio();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const { setIsOpen, setReferrer, setCloseCallback } = useUpgradePlanModalStore();

  const {
    deleteFileMutation: { mutateAsync: deleteFilePost },
  } = useFileDelete({});

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isGettingUploadError) {
      setIsRecordingMode(true);
    }
  }, [countdown, isGettingUploadError]);

  useEffect(() => {
    const filename = `Recording on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.webm`;
    const getUploadUrl = async () => {
      try {
        const response = await uploadAudio({ filename, file_type: 'audio/webm' });
        setAudioData(response);
      } catch (error: any) {
        if (error instanceof Error && error.message !== 'Upgrade required') {
          setUploadHadErrors(true);
        }
        if (error.message === 'Upgrade required') {
          setIsRecordingMode(false);
          setIsProcessingRecordedAudio(false);
          setReferrer('recording-limit');
          setIsOpen(true);
          setIsPaywallOpen(true);
          setCloseCallback(() => {
            onDelete();
          });
        }
      }
    };
    getUploadUrl();
  }, []);

  const handleExitClick = () => {
    setIsExitDialogOpen(true);
  };

  const handleExitConfirm = async () => {
    setIsExitDialogOpen(false);
    if (audioData) {
      await deleteFilePost({ workspace_file_id: audioData!.workspace_file_id, force: true });
    }
    onDelete();
  };

  const handleRecordingComplete = (blob: Blob, uploadError: boolean) => {
    setRecordedBlob(blob);
    setIsRecordingMode(false);
    setIsProcessingRecordedAudio(false);
    if (uploadError) {
      setUploadHadErrors(true);
    }
  };

  const handleSaveLocally = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded_audio.webm';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    setUploadHadErrors(false);
    onDelete();
  };
  if (isPaywallOpen) {
    return (
      <styled.div
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#6D56FACC"
        backdropFilter="blur(8px)"
        pb={5}
        zIndex={3}
      />
    );
  }
  return (
    <styled.div
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#6D56FACC"
      backdropFilter="blur(8px)"
      pb={5}
      zIndex={3}>
      <styled.div
        position="absolute"
        top={5}
        px={5}
        justifyContent={isRecordingMode ? 'space-between' : 'right'}
        width="full"
        display={'flex'}>
        <styled.span fontSize="3xl" fontWeight="bold" color="white" mb={4} display={isRecordingMode ? 'block' : 'none'}>
          {t('newChatView.classesFileBrowser.recordLecture.view.title')}
        </styled.span>

        <IconButton variant="ghost" size="lg" onClick={handleExitClick}>
          <XIcon color="white" style={{ width: '30px', height: '30px' }} />
        </IconButton>
      </styled.div>

      {countdown > 0 ? (
        <styled.span fontSize={'9xl'} fontWeight="bold" color="white">
          {countdown}
        </styled.span>
      ) : isRecordingMode ? (
        <EnhancedVoiceVisualizer onRecordingComplete={handleRecordingComplete} uploadUrl={audioData?.upload_url} />
      ) : uploadHadErrors ? (
        <styled.div display="flex" flexDirection="column" alignItems="center" p={7} gap={5}>
          <Alert.Root>
            <Alert.Icon asChild>
              <InfoIcon color="red" />
            </Alert.Icon>
            <Alert.Content>
              <Alert.Title>
                <styled.span fontSize={'md'} color="red">
                  {t('newChatView.classesFileBrowser.recordLecture.view.error.title')}
                </styled.span>
              </Alert.Title>
              <Alert.Description>
                <styled.p>{t('newChatView.classesFileBrowser.recordLecture.view.error.description')}</styled.p>
                <styled.p>{t('newChatView.classesFileBrowser.recordLecture.view.error.saveOnDevice.title')}</styled.p>
              </Alert.Description>
              <styled.div mt={2}>
                <Button onClick={handleSaveLocally}>
                  <Download size={16} />
                  <span>{t('newChatView.classesFileBrowser.recordLecture.view.error.saveOnDevice.submit')}</span>
                </Button>
                <Button variant="ghost" onClick={() => setUploadHadErrors(false)} ml={2}>
                  {t('common.cancel')}
                </Button>
              </styled.div>
            </Alert.Content>
          </Alert.Root>
        </styled.div>
      ) : isGettingUploadError ? (
        <styled.div display="flex" flexDirection="column" alignItems="center" p={7} gap={5}>
          <Alert.Root>
            <Alert.Icon asChild>
              <InfoIcon />
            </Alert.Icon>
            <Alert.Content>
              <Alert.Title>
                <styled.span fontSize={'md'}>
                  {t('newChatView.classesFileBrowser.recordLecture.view.error.title')}
                </styled.span>
              </Alert.Title>
              <Alert.Description>
                <styled.p>{(uploadError as { message?: string })?.message}</styled.p>
                <styled.p>{t('newChatView.classesFileBrowser.recordLecture.view.error.tryAgain')}</styled.p>
              </Alert.Description>
              <styled.div mt={2}>
                <Button onClick={onDelete}>
                  <span>{t('common.close')}</span>
                </Button>
              </styled.div>
            </Alert.Content>
          </Alert.Root>
        </styled.div>
      ) : (
        recordedBlob && (
          <PlaybackConfirmView
            file_id={audioData!.file_id}
            workspace_file_id={audioData!.workspace_file_id}
            workspace_id={workspace_id}
            audioBlob={recordedBlob}
            onDelete={onDelete}
            onSaved={onSaved}
            setUploadHadErrors={setUploadHadErrors}
          />
        )
      )}

      <ConfirmModal
        isOpen={isExitDialogOpen}
        setIsOpen={setIsExitDialogOpen}
        title={t('newChatView.classesFileBrowser.recordLecture.view.confirm.title')}
        desc={t('newChatView.classesFileBrowser.recordLecture.view.confirm.description')}
        confirmButtonText={t('common.exit')}
        onConfirm={handleExitConfirm}
      />
    </styled.div>
  );
};

export default RecordingView;
