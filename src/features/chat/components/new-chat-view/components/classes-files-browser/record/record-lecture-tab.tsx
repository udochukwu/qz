import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UploadActionBox from '@/components/upload-action-box';
import { RecordIconSmall } from '../components/record-icon';
import RecordingView from './recording-view';
import { IngestAudioResponse } from './types';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { styled } from 'styled-system/jsx';

export default function RecordLecture() {
  const { t } = useTranslation();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isRecording = searchParams.get('recording') === 'true';
  const updateUrlParams = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  const handleRecordClick = () => {
    updateUrlParams('recording', 'true');
  };

  const handleDeleteRecording = () => {
    updateUrlParams('recording', 'false');
  };
  const onSaved = (r: IngestAudioResponse) => {
    updateUrlParams('recording', 'false');
    mixpanel.track(EventName.SaveRecordedLecture, {
      path: window.location.pathname,
      source_action: 'home_modal',
    });
    if (r.workspace_id) {
      router.push(`/classes/${r.workspace_id}`);
    } else {
      router.push('/files');
    }
  };

  return (
    <>
      <UploadActionBox
        title={`${t('landing.uploadWizard.recordLecture.title')}|${t('landing.uploadWizard.recordLecture.description')}`}
        description={t('newChatView.classesFileBrowser.recordLecture.description')}
        buttonText={t('newChatView.classesFileBrowser.recordLecture.title')}
        buttonIcon={<RecordIconSmall size={3} />}
        onClick={handleRecordClick}
        additionalContent={
          <img src="/images/action-box-thumbnails/microphone.jpg" alt="record-lecture-tab" width={120} height={120} />
        }
      />
      {isRecording && <RecordingView onDelete={handleDeleteRecording} onSaved={onSaved} />}
    </>
  );
}
