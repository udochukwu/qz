import React, { useCallback, useEffect, useState } from 'react';
import { styled, VStack } from 'styled-system/jsx';
import { useGenerateFlashcard } from '@/features/flashcard/hooks/use-generate-flashcard';
import GeneratingFlashcardLoader from '@/features/flashcard/components/generating-flashcard-loader';
import { useRouter } from 'next13-progressbar';
import { ErrorRetry } from '../user-feedback/error-retry';
import { useTranslation } from 'react-i18next';
import { useUpgradePlanModalStore } from '../paywall/stores/upgrade-plan-modal';
import { Button } from '@/components/elements/button';

interface Props {
  selelectedFilename: string;
  fileId: string;
}

export const FileView = ({ fileId }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { mutate: generateFlashcardset, isLoading, isError } = useGenerateFlashcard();
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const { setIsOpen, setReferrer } = useUpgradePlanModalStore();
  const generateFlashcardSet = useCallback(async () => {
    generateFlashcardset(
      { workspace_file_ids: [fileId] },
      {
        onSuccess(data) {
          router.push(`/flashcards/${data.flashcard_set?.set_id}`);
        },
        onError(error) {
          if (error?.response?.status && error?.response?.status === 426) {
            setErrorStatus(error?.response?.status);
            setIsOpen(true);
            setReferrer('flashcard-limit');
          }
        },
      },
    );
  }, [fileId]);

  useEffect(() => {
    generateFlashcardSet();
  }, []);

  if (errorStatus === 426) {
    return (
      <VStack alignItems="center" justifyContent="center" height="100vh">
        <styled.h1>{t('flashcards.limit.message')}</styled.h1>
        <styled.h1>{t('flashcards.limit.upgrade')}</styled.h1>
        <Button onClick={() => setIsOpen(true)}>{t('flashcards.limit.button')}</Button>
      </VStack>
    );
  }
  if (isError) {
    return <ErrorRetry error={t('flashcards.error')} retry={generateFlashcardSet} />;
  }

  return (
    <>
      <styled.div height={'100vh'} style={{ overflow: 'scroll' }}>
        {isLoading ? <GeneratingFlashcardLoader /> : null}
      </styled.div>
    </>
  );
};
