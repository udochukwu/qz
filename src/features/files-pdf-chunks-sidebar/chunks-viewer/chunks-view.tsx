import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import Chunk from './components/Chunk';
import { Flex, Stack, styled } from 'styled-system/jsx';
import { ResourceChunk } from '@/types';
import { Skeleton } from '@/components/elements/skeleton';
import { retrieveUniqueChunksListFromResourceChunks } from '@/utils/chunks-resources-utils';
import { useFiles } from '../hooks/files/use-files';
import { WorkspaceFileUploadStatus } from '../types/types';
import { CRUDFilesPost } from '../types/api-types';
import OnboardingInfoModal from '@/components/onboarding-modal';
import { FolderOpen } from 'lucide-react';
import React from 'react';
import useNewMessageStore from '@/features/chat/stores/new-message-stroe';
import { useTranslation } from 'react-i18next';

interface ChunkProps {
  all_resource_chunks: { [message_id: string]: ResourceChunk[] };
  crudPayload: CRUDFilesPost;
}

// Memoized Skeleton component since it's static
const LoadingSkeleton = React.memo(() => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <Stack gap="3.5" width="full">
      <Skeleton h="220px" />
      <Skeleton h="220px" />
      <Skeleton h="220px" />
    </Stack>
  </motion.div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Animation variants (static object)
const chunkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

// Memoized EmptyState component
const EmptyState = React.memo(({ fileList }: { fileList: any[] | undefined }) => {
  const { t } = useTranslation();

  return (
    <Flex justifyContent="center" alignItems="center" height="100%" flexDir="row">
      {fileList && fileList.length > 0 ? (
        <p>{t('files.pdf.chunk.empty.title')}</p>
      ) : (
        <styled.div alignItems="center" justifyContent="center" fontSize={18} mt={2} color="#15112B99">
          <p>{t('files.pdf.chunk.empty.description')}</p>
        </styled.div>
      )}
    </Flex>
  );
});

EmptyState.displayName = 'EmptyState';

export default function ChunksView({ all_resource_chunks, crudPayload }: ChunkProps) {
  const { t } = useTranslation();

  const { data: pendingFileList } = useFiles({ crudPayload });
  const isNewMessageLoading = useNewMessageStore(state => state.isNewMessageLoading);
  // Move reverseObject inside component and memoize it
  const reverseObject = useCallback((object: { [key: string]: any[] }) => {
    const new_object: { [key: string]: any[] } = {};
    for (const key in object) {
      new_object[key] = [...object[key]].reverse();
    }
    return new_object;
  }, []);

  // Memoize complex computations
  const reversedChunksMessages = useMemo(
    () => reverseObject(all_resource_chunks),
    [all_resource_chunks, reverseObject],
  );

  const allChunks = useMemo(
    () => retrieveUniqueChunksListFromResourceChunks(reversedChunksMessages),
    [reversedChunksMessages],
  );

  const fileList = useMemo(
    () => pendingFileList?.files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED),
    [pendingFileList?.files],
  );

  const showSkeleton = useMemo(() => {
    return isNewMessageLoading && allChunks.length === 0 && fileList && fileList?.length > 0;
  }, [allChunks.length, fileList, isNewMessageLoading]);

  // Memoize the reversed chunks
  const reversedAllChunks = useMemo(() => [...allChunks].reverse(), [allChunks]);
  return (
    <Flex w="100%" flexDirection="column" h="calc(100vh - 130px)">
      <Flex flexDirection="column" overflowY="scroll" gap={3} scrollbarWidth="none" p={1}>
        <OnboardingInfoModal title={t('files.pdf.chunk.aboutReferences')} guideId="show_about_references">
          <FolderOpen style={{ marginTop: 2, minWidth: '20px' }} color="#15112B80" />
          <styled.div fontSize={14} color="#15112B99">
            <styled.p>{t('files.pdf.chunk.title')}</styled.p>
            <styled.p>{t('files.pdf.chunk.description')}</styled.p>
          </styled.div>
        </OnboardingInfoModal>

        {showSkeleton ? (
          <LoadingSkeleton />
        ) : allChunks.length === 0 ? (
          <EmptyState fileList={fileList} />
        ) : (
          reversedAllChunks.map((chunk, index) => (
            <motion.div
              key={`chunk-${index}`}
              variants={chunkVariants}
              initial="hidden"
              animate="visible"
              custom={index}>
              <Chunk {...chunk} />
            </motion.div>
          ))
        )}
      </Flex>
    </Flex>
  );
}
