import React, { useEffect, useRef, useCallback, useState } from 'react';
import { styled } from 'styled-system/jsx';
import SiriWave from 'siriwave';
import { IconButton } from '@/components/elements/icon-button';
import { StopCircleIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { BlockBlobClient } from '@azure/storage-blob';
import { Spinner } from '@/components/elements/spinner';
import { useTranslation } from 'react-i18next';

interface EnhancedVoiceVisualizerProps {
  uploadUrl: string | undefined;
  onRecordingComplete: (audioBlob: Blob, streamingUploadError: boolean) => void;
}

interface ChunkUpload {
  chunk: Blob;
  blockId: string;
  retries: number;
}

const MAX_RETRIES = 1;
const RETRY_DELAY = 1000; // 1 second
const UPLOAD_THRESHOLD = 1024 * 50; // around every 2.5 seconds worth of data

const EnhancedVoiceVisualizer: React.FC<EnhancedVoiceVisualizerProps> = ({ uploadUrl, onRecordingComplete }) => {
  const { t } = useTranslation();

  const [paused, setPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [errored, setErrored] = useState(false);
  const [uploading, setUploading] = useState(false);
  const recordingRef = useRef(false);
  const siriWaveRef = useRef<HTMLDivElement>(null);
  const siriWaveInstanceRef = useRef<SiriWave | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const blockBlobClientRef = useRef<BlockBlobClient | null>(null);
  const blockIdCounter = useRef(0);
  const chunksRef = useRef<Blob[]>([]);
  const uploadQueueRef = useRef<ChunkUpload[]>([]);
  const uploadedBlockIdsRef = useRef<string[]>([]); // New ref to store uploaded block IDs
  const isUploadingRef = useRef(false);
  const [uploadingAfterStop, setUploadingAfterStop] = useState(false);
  const accumulatedDataRef = useRef<Blob[]>([]);
  const accumulatedSizeRef = useRef<number>(0);

  const accumulateAndEnqueueData = (data: Blob) => {
    accumulatedDataRef.current.push(data);
    accumulatedSizeRef.current += data.size;

    if (accumulatedSizeRef.current >= UPLOAD_THRESHOLD) {
      const accumulatedBlob = new Blob(accumulatedDataRef.current, { type: 'audio/webm' });
      enqueueChunk(accumulatedBlob);

      // Reset accumulated data
      accumulatedDataRef.current = [];
      accumulatedSizeRef.current = 0;
    }
  };
  const finalizeAccumulatedData = () => {
    if (accumulatedDataRef.current.length > 0) {
      const finalBlob = new Blob(accumulatedDataRef.current, { type: 'audio/webm' });
      enqueueChunk(finalBlob);

      // Reset accumulated data
      accumulatedDataRef.current = [];
      accumulatedSizeRef.current = 0;
    }
  };

  const uploadChunk = async (chunkUpload: ChunkUpload): Promise<boolean> => {
    try {
      if (!uploadUrl) {
        setErrored(true);
        return false;
      }
      if (!blockBlobClientRef.current) {
        blockBlobClientRef.current = new BlockBlobClient(uploadUrl);
      }

      await blockBlobClientRef.current.stageBlock(chunkUpload.blockId, chunkUpload.chunk, chunkUpload.chunk.size);
      return true;
    } catch (error) {
      console.error('Error uploading chunk:', error);
      return false;
    }
  };

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (recordingRef.current) {
      event.preventDefault();
      return 'You are currently recording audio. Are you sure you want to leave?';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const processUploadQueue = async () => {
    if (isUploadingRef.current) return;
    isUploadingRef.current = true;
    setUploading(true);

    while (uploadQueueRef.current.length > 0) {
      const chunkUpload = uploadQueueRef.current[0];
      const success = await uploadChunk(chunkUpload);
      if (success) {
        uploadedBlockIdsRef.current.push(chunkUpload.blockId);
        uploadQueueRef.current.shift(); // Remove the successfully uploaded chunk
        await commitBlockList();
      } else {
        chunkUpload.retries++;
        if (chunkUpload.retries >= MAX_RETRIES) {
          console.error(`Failed to upload chunk after ${MAX_RETRIES} attempts`);
          uploadQueueRef.current.shift(); // Remove the failed chunk
        } else {
          // Move the chunk to the end of the queue for retry
          uploadQueueRef.current.push(uploadQueueRef.current.shift()!);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    isUploadingRef.current = false;
    setUploading(false);
    if (!recordingRef.current) {
      await finalizeUpload();
    }
  };
  const commitBlockList = async () => {
    try {
      if (blockBlobClientRef.current && uploadedBlockIdsRef.current.length > 0) {
        await blockBlobClientRef.current.commitBlockList(uploadedBlockIdsRef.current);
      }
    } catch (error) {
      console.error('Error committing block list:', error);
    }
  };

  const generateBlockId = (counter: number): string => {
    // Pad the counter to ensure consistent length
    const paddedCounter = counter.toString().padStart(6, '0');
    // Convert to base64 and remove padding characters
    return btoa(paddedCounter).replace(/=/g, '');
  };
  const enqueueChunk = (chunk: Blob) => {
    const blockId = generateBlockId(blockIdCounter.current++);
    uploadQueueRef.current.push({ chunk, blockId, retries: 0 });
    processUploadQueue();
  };

  const finalizeUpload = async () => {
    try {
      if (blockBlobClientRef.current) {
        // Final commit in case there are any remaining blocks
        await commitBlockList();
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setUploadingAfterStop(false);
        onRecordingComplete(audioBlob, false);
      }
    } catch (error) {
      console.error('Error finalizing upload:', error);
      onRecordingComplete(new Blob(chunksRef.current, { type: 'audio/webm' }), true);
    }
  };

  const initAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      siriWaveInstanceRef.current = new SiriWave({
        container: siriWaveRef.current!,
        cover: true,
        height: 300,
        style: 'ios',
      });
      siriWaveInstanceRef.current.start();

      const updateVisualizer = () => {
        if (!paused) {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average amplitude
          const sum = dataArray.reduce((acc, value) => acc + value, 0);
          const averageAmplitude = sum / dataArray.length / 255;

          // Apply some scaling to make the visualization more dynamic
          const scaledAmplitude = Math.pow(averageAmplitude, 0.8) * 3.5;

          siriWaveInstanceRef.current?.setAmplitude(scaledAmplitude);
        }
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        var options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        var options = { mimeType: 'video/webm; codecs=vp9' };
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        var options = { mimeType: 'video/webm' };
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        var options = { mimeType: 'video/mp4' };
      } else {
        var options = { mimeType: 'audio/mp3' };
      }
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          accumulateAndEnqueueData(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        recordingRef.current = false;
        finalizeAccumulatedData();
      };

      setIsInitialized(true);
      startRecording();
    } catch (err) {
      console.error('Error initializing audio:', err);
      setErrored(true);
    }
  }, [uploadUrl]);

  const startRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      blockIdCounter.current = 0;
      mediaRecorderRef.current.start(1000); // Start recording and fire ondataavailable every 1 second
      recordingRef.current = true;
      setPaused(false);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1000);
      }, 1000);
    } else {
      console.warn('Cannot start recording. Recorder not initialized or already recording.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      recordingRef.current = false;
      setPaused(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (uploadQueueRef.current.length > 0) {
        setUploadingAfterStop(true);
      }
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setPaused(true);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setPaused(false);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1000);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    initAudio();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      stopRecording();
      siriWaveInstanceRef.current?.stop();
    };
  }, [initAudio, stopRecording]);

  // Expose methods to start and stop recording for debugging purposes
  useEffect(() => {
    (window as any).startRecording = startRecording;
    (window as any).stopRecording = stopRecording;
    (window as any).pauseRecording = pauseRecording;
    (window as any).resumeRecording = resumeRecording;

    return () => {
      delete (window as any).startRecording;
      delete (window as any).stopRecording;
      delete (window as any).pauseRecording;
      delete (window as any).resumeRecording;
    };
  }, [startRecording, stopRecording, pauseRecording, resumeRecording]);

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <styled.div width="full">
        <styled.div>
          <styled.div
            flexDirection={'row'}
            display={paused ? 'flex' : 'none'}
            rounded={'lg'}
            w="100%"
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}>
            <styled.span fontSize="6xl" color="white">
              {t('newChatView.classesFileBrowser.recordLecture.view.enchancedVoiceVisualizer.title')}
            </styled.span>
          </styled.div>
          <styled.div display={paused || uploadingAfterStop || errored ? 'none' : 'block'} ref={siriWaveRef} />
          {errored && (
            <styled.div w={'full'} justifyContent={'center'} display={'flex'}>
              <styled.div
                bg="white"
                p={3}
                position={'absolute'}
                flexDirection={'row'}
                display={'flex'}
                rounded={'lg'}
                border={'1px solid red'}
                w="80%"
                alignContent={'center'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={3}>
                <styled.span fontSize="xl" color="red">
                  {t('newChatView.classesFileBrowser.recordLecture.view.enchancedVoiceVisualizer.error')}
                </styled.span>
              </styled.div>
            </styled.div>
          )}
          {uploadingAfterStop && (
            <styled.div
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              p={2}
              rounded="md"
              fontSize="md"
              color="gray.600"
              display="flex"
              alignItems="center"
              justifyContent="center">
              <Spinner size="sm" color="gray.600" width="20px !important" height="20px !important" mr={2} />
              <span>{t('newChatView.classesFileBrowser.recordLecture.view.enchancedVoiceVisualizer.description')}</span>
            </styled.div>
          )}
        </styled.div>
      </styled.div>
      <styled.div
        bg="white"
        p={3}
        pr={5}
        pl={1}
        position={'absolute'}
        bottom={5}
        left={5}
        flexDirection={'row'}
        display={'flex'}
        rounded={'lg'}
        alignContent={'center'}
        justifyContent={'center'}
        alignItems={'center'}>
        <IconButton variant="ghost" py={2} px={4} size="md" color="white" onClick={stopRecording}>
          <StopCircleIcon
            color="red"
            size={24}
            style={{
              width: '30px',
              height: '30px',
            }}
          />
        </IconButton>
        {paused ? (
          <IconButton variant="ghost" py={2} px={2} size="md" color="white" onClick={resumeRecording} mr={3}>
            <PlayIcon
              color="#15112B6B"
              size={24}
              style={{
                width: '20px',
                height: '20px',
              }}
            />
          </IconButton>
        ) : (
          <IconButton variant="ghost" py={2} px={2} size="md" color="white" onClick={pauseRecording} mr={3}>
            <PauseIcon
              color="#15112B6B"
              size={24}
              style={{
                width: '20px',
                height: '20px',
              }}
            />
          </IconButton>
        )}
        <styled.span fontSize="xl" color="#000000B2">
          {formatDuration(recordingTime)}
        </styled.span>
      </styled.div>
    </>
  );
};

export default EnhancedVoiceVisualizer;
