'use client';

import React from 'react';
import { motion, px } from 'framer-motion';
import { useListClasses } from '@/hooks/use-list-classes';
import WorkspaceButton from './workspace-button';
import { css } from 'styled-system/css';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { Skeleton } from '@/components/elements/skeleton';
import { PlusIcon } from 'lucide-react';
import { CreateNewWorkspaceModal } from './create-new-workspace-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Individual item animation, with dynamic delay based on index
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1, // Dynamic delay based on the item index
    },
  }),
};
interface Props {
  onClassClick?: (workspaceId: string) => void;
  selectedWorkspaceId?: string | null;
}

export const WorkspaceList = ({ onClassClick, selectedWorkspaceId = null }: Props) => {
  const { t } = useTranslation();

  const { data: workspaces, isLoading, isError, refetch } = useListClasses();
  const isCreateModalOpen = useBoolean();

  // Check URL parameters for modal trigger
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('createWorkspace') === 'true') {
      isCreateModalOpen.setTrue();

      // Remove the parameter from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('createWorkspace');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  if (isError) {
    return <ErrorRetry error={t('class.workspace.error', { count: 2 })} retry={refetch} />;
  }
  if (isLoading) {
    return (
      <motion.section
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '5',
          width: 'full',
        })}
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div key={index} custom={index}>
            <Skeleton
              className={css({
                height: '120px',
                width: '100%',
                borderRadius: '12px',
              })}
            />
          </motion.div>
        ))}
      </motion.section>
    );
  }

  return (
    <>
      <CreateNewWorkspaceModal
        isOpen={isCreateModalOpen.value}
        setIsOpen={isCreateModalOpen.setValue}
        selectOnCreate={onClassClick}
      />
      <motion.div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '5',
          width: '100%',
        })}
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {workspaces?.classes?.map((workspace, index) => (
          <motion.div key={workspace.workspace_id} variants={itemVariants} custom={index}>
            <WorkspaceButton
              {...workspace}
              isSelected={selectedWorkspaceId === workspace.workspace_id}
              onClassClick={onClassClick}
            />
          </motion.div>
        ))}

        <motion.button
          className={css({
            justifyContent: 'start',
            alignItems: 'center',
            display: 'flex',
            gap: '12px',
            padding: '28px 40px',
            fontSize: '18px',
            lineHeight: '1.2',
            fontWeight: '600',
            backgroundColor: 'rgba(26, 12, 108, 0.06)',
            _hover: {
              backgroundColor: 'rgba(26, 12, 108, 0.12)',
            },
            color: '#15112B',
            height: '120px',
            cursor: 'pointer',
            borderRadius: '12px',
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='rgba(109, 86, 250, 0.3)' stroke-width='4' stroke-dasharray='10%2c14' stroke-dashoffset='37' stroke-linecap='square'/%3e%3c/svg%3e\")",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          })}
          style={workspaces?.classes.length === 0 ? { maxWidth: '50%' } : {}}
          onClick={() => isCreateModalOpen.setTrue()}
          variants={itemVariants}
          custom={(workspaces?.classes?.length || 0) + 1}>
          <PlusIcon />
          <span>{t('class.workspace.new')}</span>
        </motion.button>
      </motion.div>
    </>
  );
};
