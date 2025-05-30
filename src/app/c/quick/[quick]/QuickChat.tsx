'use client';

import { SpinningIcon } from '@/components/spinning-icon';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { useIngestVideo } from '@/features/upload-youtube/hooks/use-ingest-video';
import { useRouter } from 'next13-progressbar';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { styled } from 'styled-system/jsx';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import { useOnUploadFileController } from '@/features/files-pdf-chunks-sidebar/hooks/use-on-upload-file-controller';

interface QuickChatProps {
  decodedUrl: string;
}

const video_msg_array = [
  'Creating a chat with the video...',
  // 'One of as have watch the video... Give me a moment to create a chat...',
  // 'Trying to understand this accent... Just a moment...',
];
// File types users can start a quick chat with, not including YouTube
const acceptedFileTypesToFileName: { [key: string]: string } = {
  pdf: 'PDF',
  doc: 'Word Document',
  docx: 'Word Document',
  ppt: 'PowerPoint',
  pptx: 'PowerPoint',
};

export function QuickChat({ decodedUrl }: QuickChatProps) {
  const [msg, setMsg] = useState('Creating a chat...');
  const { t } = useTranslation();

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

  const { mutateAsync: createChatForFile } = useCreateChat(async (data: { chat_id: string }) => {
    // fetch the file using the proxy, then upload it
    const file: File = await fetchFileFromProxy(decodedUrl);
    await uploadFiles([file], { chat_id: data.chat_id });
  });

  const { mutateAsync: createChatForVideo } = useCreateChat(async (data: { chat_id: string }) => {
    await uploadVideo({ video_url: decodedUrl.trim(), chat_id: data.chat_id });
  });
  const router = useRouter();

  useEffect(() => {
    const processFile = async () => {
      try {
        const { chat_id } = await createChatForFile({});
        console.log('Chat created with ID:', chat_id);
        console.log('Uploading file:', decodedUrl);
        const fileType: string = decodedUrl.split('.').pop() || '';
        //get params from current url
        const url = new URL(window.location.href);
        const customReferer = url.searchParams.get('customReferer') ?? '';
        mixpanel.track(EventName.QuickChatCreated, {
          chat_id: chat_id,
          file_url: decodedUrl,
          file_type: fileType,
          customReferer: customReferer,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error(t('chat.quick.error'));
        //Route to home page when there is an error
        router.push('/');
      }
    };

    const processVideo = async () => {
      try {
        const { chat_id } = await createChatForVideo({});
        console.log('Chat created with ID:', chat_id);
        console.log('Uploading video:', decodedUrl);
        //get params from current url
        const url = new URL(window.location.href);
        const customReferer = url.searchParams.get('customReferer') ?? '';
        mixpanel.track(EventName.QuickChatCreated, {
          chat_id: chat_id,
          video_url: decodedUrl,
          file_type: 'youtube',
          customReferer: customReferer,
        });
      } catch (error) {
        console.error('Error processing video:', error);
        toast.error(t('chat.quick.error'));
        //Route to home page when there is an error
        router.push('/');
      }
    };

    const downloadFileAndStartChat = async () => {
      const fileType: string = decodedUrl.split('.').pop() || '';
      const isValidFileUrl: boolean = Object.keys(acceptedFileTypesToFileName).includes(fileType);
      if (isValidFileUrl) {
        console.log(`Creating a chat with the ${acceptedFileTypesToFileName[fileType]}...`);
        setMsg(`Creating a chat with the ${acceptedFileTypesToFileName[fileType]}...`);
        processFile();
      } else {
        console.log('Creating a chat with the video...');
        setMsg(video_msg_array[Math.floor(Math.random() * video_msg_array.length)]);
        processVideo();
      }
    };

    downloadFileAndStartChat();
  }, [decodedUrl, createChatForVideo]);

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
