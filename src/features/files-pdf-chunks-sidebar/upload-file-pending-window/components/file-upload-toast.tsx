import React, { useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { styled } from 'styled-system/jsx';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
const FileUploadToast = ({
  file,
  createChat,
  toastId,
  onDismiss,
}: {
  file: any;
  createChat: any;
  onDismiss: any;
  toastId: any;
}) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <styled.div display="grid" gridTemplateAreas='"message close"' gridTemplateColumns="1fr auto">
      <styled.span gridArea="message">
        <span>{t('files.pdf.upload.message.title', { filename: file.filename })}</span>
        <styled.button
          gridArea="button"
          color="#0c7ce5"
          border="none"
          borderRadius="4px"
          cursor="pointer"
          backgroundColor="transparent"
          transition="background-color 0.2s"
          onClick={() => {
            if (searchParams.get('tab') === 'Flashcards') {
              mixpanel.track(EventName.FlashcardStarted, {
                path: window.location.pathname,
                source: 'upload_toast',
              });
              router.push(`/f/${file.workspace_file_id}`);
              return;
            }

            createChat({ workspace_file_ids: [file.workspace_file_id] });
            toast.dismiss(toastId);
            onDismiss();
            mixpanel.track(EventName.ChatStartedFromUploadToast, {
              fileId: file.workspace_file_id,
            });
          }}>
          {searchParams.get('tab') === 'Flashcards' || pathname.startsWith('/f') || pathname.startsWith('/flashcards')
            ? t('files.pdf.upload.message.flashcards_submit')
            : t('files.pdf.upload.message.submit')}
        </styled.button>
      </styled.span>
      <styled.button
        gridArea="close"
        background="transparent"
        border="none"
        cursor="pointer"
        padding="4px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        onClick={() => {
          onDismiss();
          toast.dismiss(toastId);
        }}>
        <XIcon size={16} />
      </styled.button>
    </styled.div>
  );
};

export default FileUploadToast;
