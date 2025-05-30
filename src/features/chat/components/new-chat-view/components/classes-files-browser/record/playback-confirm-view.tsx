import React, { useState, useEffect } from 'react';
import { Box, styled } from 'styled-system/jsx';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import { IconButton } from '@/components/elements/icon-button';
import { Button } from '@/components/elements/button';
import { PlayIcon, PauseIcon, CheckIcon } from 'lucide-react';
import { Input } from '@/components/elements/input';
import { Select } from '@/components/elements/select';
import { useListClasses } from '@/hooks/use-list-classes';
import { IngestAudioPayload, IngestAudioResponse } from './types';
import { languages } from './languages';
import { useFileDelete } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-delete-file';
import { useIngestAudio } from './hooks/use-ingest-audio';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface PlaybackConfirmViewProps {
  audioBlob: Blob | (() => Promise<Blob>) | null;
  file_id: string;
  workspace_file_id: string;
  workspace_id?: string;
  onDelete: () => void;
  onSaved?: (r: IngestAudioResponse) => void;
  setUploadHadErrors?: (value: boolean) => void;
}

// replaces all spaces and slashes in a string with hyphens
const cleanFileName = (name: string) => {
  return name.replace(/[\s/\\]+/g, '-');
};

const PlaybackConfirmView: React.FC<PlaybackConfirmViewProps> = ({
  audioBlob,
  onDelete,
  setUploadHadErrors,
  file_id,
  workspace_file_id,
  onSaved,
  workspace_id,
}) => {
  const { t } = useTranslation();

  const defaultName = cleanFileName(t('files.list.recording.unsaved.name') + new Date().toLocaleDateString());
  const { mutateAsync: uploadFile, isLoading, isSuccess } = useIngestAudio();
  const router = useRouter();
  const [nameOfRecording, setNameOfRecording] = useState(defaultName);
  const { data: classList, isLoading: isClassesLoading, isError: isErrorClasses } = useListClasses();
  const [selectedClass, setSelectedClass] = useState<string | undefined>(workspace_id);
  const [langcode, setLangcode] = useState<string>('en');
  const {
    deleteFileMutation: { mutateAsync: deleteFilePost },
  } = useFileDelete({});

  const langsForSelect = languages.map(lang => ({
    label: `${lang.language} - ${lang.flag}`,
    value: `${lang.code}`,
  }));
  const handleConfirmSave = async ({ file_id, filename, workspace_id, length, langcode }: IngestAudioPayload) => {
    if (file_id) {
      try {
        const r = await uploadFile({ file_id, filename, workspace_id, length, langcode });
        if (onSaved) {
          onSaved(r);
        }
      } catch (error) {
        console.error('Error uploading file', error);
        if (setUploadHadErrors) {
          setUploadHadErrors(true);
        }
      }
    } else {
      console.error('File id not found');
    }
  };
  const recorderControls = useVoiceVisualizer();
  const {
    isPausedRecordedAudio,
    togglePauseResume,
    duration,
    currentAudioTime,
    setPreloadedAudioBlob,
    isPreloadedBlob,
  } = recorderControls;

  useEffect(() => {
    let load = async () => {
      if (audioBlob && !isPreloadedBlob) {
        if (typeof audioBlob === 'function') {
          let blob = await audioBlob();
          setPreloadedAudioBlob(blob);
        } else {
          setPreloadedAudioBlob(audioBlob);
        }
      }
    };

    if (audioBlob && !isPreloadedBlob) {
      load();
    }
  }, [audioBlob, isPreloadedBlob, setPreloadedAudioBlob]);

  const getClassListItems = () => {
    if (classList && classList.classes.length > 0) {
      return classList.classes.map(item => ({
        label: item.class_name,
        value: item.workspace_id,
      }));
    }
    return [];
  };

  const handleClassValueChange = ({ value }: { value: string[] }) => {
    setSelectedClass(value[0]);
  };

  const handleLanguageValueChange = ({ value }: { value: string[] }) => {
    setLangcode(value[0]);
  };

  const handleDelete = async () => {
    await deleteFilePost({ workspace_file_id, force: true });
    onDelete();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <styled.div
      display="flex"
      flexDirection="column"
      alignItems="center"
      backgroundColor="white"
      p={7}
      gap={5}
      borderRadius="md"
      minW={'25vw'}
      boxShadow="lg">
      {audioBlob && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          px={2}
          gap={2}
          bg="#6D56FA1F"
          borderRadius="md"
          position="relative"
          minW="100%">
          <IconButton variant="ghost" size="lg" rounded={'full'} bg="#6D56FA" onClick={togglePauseResume}>
            {!isPausedRecordedAudio ? (
              <PauseIcon color="white" fill="white" />
            ) : (
              <PlayIcon color="white" fill="white" style={{ marginLeft: 2 }} />
            )}
          </IconButton>
          <Box flex={1}>
            <VoiceVisualizer
              height={100}
              width={'100%'}
              barWidth={5}
              gap={1}
              mainBarColor="#6D56FA"
              secondaryBarColor="#6D56FA80"
              defaultAudioWaveIconColor="#6D56FA"
              isProgressIndicatorShown={true}
              isProgressIndicatorTimeShown={false}
              isProgressIndicatorTimeOnHoverShown={false}
              controls={recorderControls}
              isControlPanelShown={false}
              isDownloadAudioButtonShown={true}
            />
          </Box>
          <Box py={1} rounded={'2xl'} px={2} bg="#6D56FA" color="white" fontSize={'sm'}>
            {currentAudioTime ? formatDuration(currentAudioTime) : formatDuration(duration)}
          </Box>
        </Box>
      )}
      <Box w="full">
        <Input
          value={nameOfRecording === defaultName ? '' : nameOfRecording}
          onChange={e => setNameOfRecording(e.target.value)}
          placeholder={nameOfRecording}
          w="full"
          mb={2}
        />
        {classList && !isClassesLoading && !isErrorClasses && classList.classes.length > 0 && (
          <Select.Root
            width="100%"
            positioning={{ sameWidth: true }}
            onValueChange={handleClassValueChange}
            defaultValue={workspace_id ? [workspace_id] : []}
            items={getClassListItems()}
            mb={2}>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t('common.select.class')} />
              </Select.Trigger>
              <Select.Positioner bottom={'100%'} top={'auto'}>
                <Select.Content maxH="300px" overflowY="auto" scrollbarColor={'rgba(0, 0, 0, 0.2) transparent'}>
                  <Select.ItemGroup id="class">
                    {getClassListItems().map((item, index) => (
                      <Select.Item key={index} item={item}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Control>
          </Select.Root>
        )}
        {/* Add selector for language */}
        <Select.Root
          width="100%"
          positioning={{ sameWidth: true }}
          onValueChange={handleLanguageValueChange}
          items={langsForSelect}>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={t('common.select.language')} />
            </Select.Trigger>
            <Select.Positioner bottom={'100%'} top={'auto'}>
              <Select.Content maxH="300px" overflowY="auto" scrollbarColor={'rgba(0, 0, 0, 0.2) transparent'}>
                <Select.ItemGroup id="language">
                  <Select.ItemGroupLabel>{t('common.select.language')}</Select.ItemGroupLabel>
                  {langsForSelect.map((item, index) => (
                    <Select.Item key={index} item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Select.Control>
        </Select.Root>
      </Box>
      <styled.div display="flex" gap={4} justifyContent={'space-between'} w={'full'}>
        <Button variant="ghost" py={2} px={4} size="sm" color={'red'} fontWeight={'500'} onClick={handleDelete}>
          {t('files.list.recording.unsaved.delete')}
        </Button>
        <Button
          variant="solid"
          bg={'quizard.black'}
          py={1}
          px={3}
          size="sm"
          fontWeight={'500'}
          loading={isLoading}
          onClick={() => {
            handleConfirmSave({
              file_id,
              filename: nameOfRecording,
              workspace_id: selectedClass,
              langcode,
              length: Math.ceil(duration),
            });
          }}>
          {isSuccess ? t('common.saved') : t('common.save')}
        </Button>
      </styled.div>
    </styled.div>
  );
};

export default PlaybackConfirmView;
