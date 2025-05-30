'use client';

import { SpinningIcon } from '@/components/spinning-icon';
import { useIngestVideo } from '@/features/upload-youtube/hooks/use-ingest-video';
import { useRouter } from 'next13-progressbar';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { styled } from 'styled-system/jsx';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';

interface QuickFlashcardsProps {
  decodedUrl: string;
}

const video_msg_array = ['Creating flashcards with the video...'];
// File types users can quickly create flashcards with, not including YouTube
const acceptedFileTypesToFileName: { [key: string]: string } = {
  pdf: 'PDF',
  doc: 'Word Document',
  docx: 'Word Document',
  ppt: 'PowerPoint',
  pptx: 'PowerPoint',
};

export function QuickFlashcards({ decodedUrl }: QuickFlashcardsProps) {
  const [msg, setMsg] = useState('Creating flashcards...');

  const { mutateAsync: uploadVideo } = useIngestVideo({ chat_id: null });
  const { uploadFiles } = useOnUploadFileController({});

  const fetchFileFromProxy = async (url: string) => {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url.trim())}`;
    const blob = await fetch(proxyUrl).then(res => res.blob());
    const file_ext = url.split('.').pop() || 'pdf';
    const fileName = url.split('/').pop()?.split('?')[0].split('#')[0] || `New file.${file_ext}`;
    // make sure it ends with the file extension
    const finalName = fileName.includes('.') ? fileName : `${fileName}.${file_ext}`;
    return new File([blob], finalName, { type: blob.type });
  };

  const { mutateAsync: uploadFileAndRedirect } = useCreateChat(
    async (data: { chat_id: string }) => {
      const file = await fetchFileFromProxy(decodedUrl);
      const { hasUpgradeError, result } = await uploadFiles([file], { chat_id: data.chat_id });
      if (hasUpgradeError) {
        toast.error('An error occurred while creating flashcards. Please try again.');
        return;
      }
      const workspaceFileId = result?.[0]?.workspace_file_id;
      if (workspaceFileId) {
        mixpanel.track(EventName.FlashcardStarted, {
          path: window.location.pathname,
          source: 'flashcard_quick_upload',
        });
        router.push(`/f/${workspaceFileId}`);
      } else {
        toast.error('An error occurred while creating flashcards. Please try again.');
      }
    },
    undefined,
    false,
  );

  const { mutateAsync: uploadVideoAndRedirect } = useCreateChat(
    async (data: { chat_id: string }) => {
      // note: need to create a chat first then upload the video because the BE expects a chat_id or workspace_id
      const result = await uploadVideo({ video_url: decodedUrl.trim(), chat_id: data.chat_id });
      const workspaceFileId = result?.data?.workspace_file_id;

      if (workspaceFileId) {
        mixpanel.track(EventName.FlashcardStarted, {
          path: window.location.pathname,
          source: 'flashcard_quick_upload',
        });
        router.push(`/f/${workspaceFileId}`);
      } else {
        toast.error('An error occurred while creating flashcards. Please try again.');
      }
    },
    undefined,
    false,
  );

  const router = useRouter();

  useEffect(() => {
    const uploadFileAndStartCreatingFlashcards = async () => {
      const fileType: string = decodedUrl.split('.').pop()?.toLowerCase() || '';
      const isValidFileUrl: boolean = Object.keys(acceptedFileTypesToFileName).includes(fileType);
      if (isValidFileUrl) {
        console.log(`Creating flashcards with the ${acceptedFileTypesToFileName[fileType]}...`);
        setMsg(`Creating flashcards with the ${acceptedFileTypesToFileName[fileType]}...`);

        await uploadFileAndRedirect({});
      } else {
        console.log('Creating flashcards with the video...');
        setMsg(video_msg_array[Math.floor(Math.random() * video_msg_array.length)]);

        await uploadVideoAndRedirect({});
      }
    };

    uploadFileAndStartCreatingFlashcards();
  }, [decodedUrl]);

  return (
    <styled.section
      display="flex"
      h="100vh"
      w="100%"
      flexDir="column"
      bg="#F8F8F9"
      overflow="clip"
      alignItems="center"
      textAlign={'center'}
      justifyContent="center">
      <SpinningIcon />
      <styled.h3 textStyle="lg" fontWeight="bold" color="#202020">
        {msg}
      </styled.h3>
    </styled.section>
  );
}
