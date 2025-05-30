'use client';
import { useRouter } from 'next/navigation';
import { Flex, styled } from 'styled-system/jsx';
import { useImportShare } from '@/hooks/use-import-share';
import { useGetSharePreview } from '@/hooks/use-share-preview';
import { GetSharePreviewResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const SharePage: React.FC<{ params: { share_id: string } }> = ({ params: { share_id } }) => {
  const { t } = useTranslation();

  const [shareName, setShareName] = useState('');
  const [shareType, setShareType] = useState('');
  const [isConfirmImportDialogOpen, setIsConfirmImportDialogOpen] = useState(true);

  const router = useRouter();

  const {
    mutate: getSharePreview,
    isLoading: isLoadingPreview,
    error: errorPreview,
  } = useGetSharePreview((response: GetSharePreviewResponse) => {
    setShareName(response.share_name);
    setShareType(response.share_type);
  });

  useEffect(() => {
    getSharePreview(share_id);
  }, [share_id]);

  const {
    mutate: importShare,
    isLoading,
    error,
    data: response,
  } = useImportShare(response => {
    if (!response) {
      toast.error(t('share.import.failure'));
      return;
    }

    toast.success(t('share.import.success'));
    let newRoute = `/c/${response.id}`;
    if (response.type === 'class') {
      newRoute = `/classes/${response.id}`;
    } else if (response.type === 'file') {
      newRoute = `/files`;
    } else if (response.type === 'flashcard_set') {
      newRoute = `/flashcards/${response.id}`;
    }
    router.push(newRoute);
  });

  const handleConfirmImport = () => {
    setIsConfirmImportDialogOpen(false);
    importShare({ share_id });
  };

  function setImportShareModalOpen(isOpen: boolean) {
    setIsConfirmImportDialogOpen(isOpen);
    // If the modal is closed, redirect to the homepage so the user doesn't just see the empty share page
    if (!isOpen) {
      router.push('/');
    }
  }

  const renderContent = (content: React.ReactNode) => (
    <styled.section display="flex" h="100vh" w="100%" bg="#F8F8F9" overflow="clip">
      {!errorPreview && !error && shareType && shareName && (
        <ConfirmModal
          isOpen={isConfirmImportDialogOpen}
          setIsOpen={setImportShareModalOpen}
          title={t('share.import.confirm.title')}
          desc={t('share.import.confirm.description', { shareType: shareType.replace(/_/g, ' '), shareName })}
          confirmButtonText={t('common.import')}
          onConfirm={handleConfirmImport}
        />
      )}
      <Flex flexDirection="column" w="100%" h="100%" alignItems="center" justifyContent="center">
        {content}
      </Flex>
    </styled.section>
  );

  if (isLoading || isLoadingPreview) return renderContent(t('common.loading'));
  if (error) {
    const errorMessage = error instanceof Error ? error.message : t('share.import.error.unknown');
    const isNotFound = (error as any)?.response?.status === 404;
    return renderContent(isNotFound ? t('share.import.error.notFound') : `${t('common.error.base')}: ${errorMessage}`);
  } else if (errorPreview) {
    const errorMessage = errorPreview instanceof Error ? errorPreview.message : t('share.import.error.unknown');
    const isNotFound = (error as any)?.response?.status === 404;
    return renderContent(isNotFound ? t('share.import.error.notFound') : `${t('common.error.base')}: ${errorMessage}`);
  }
  return renderContent(t('share.import.importing'));
};

export default SharePage;
