import { WorkspaceClass } from '@/types';
import { HStack, styled } from 'styled-system/jsx';
import { TrashIcon, PenLineIcon, UploadIcon } from 'lucide-react';
import { IconButton } from '@/components/elements/icon-button';
import { Button } from '@/components/elements/button';
import { useRenameWorkspaceModalStore } from '@/features/class/stores/rename-workspace-modal';
import { RenameWorkspaceModal } from '../../rename-workspace-modal';
import { useDeleteWorkspace } from '@/features/class/hooks/use-delete-workspace';
import { ConfirmDeleteModal } from '@/components/confirm-modal/confirm-delete-modal';
import { useBoolean } from '@/hooks/use-boolean';
import { ShareWorkspaceModal } from '../../share-workspace-modal';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import generatePastelColor from '@/utils/generate-pastel-color';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/elements/tooltip';
import { css } from 'styled-system/css';
interface Props {
  workspace: WorkspaceClass;
}

export default function WorkSpaceHeader({ workspace }: Props) {
  const { t } = useTranslation();

  const { mutate: deleteWorkspacePost, isLoading } = useDeleteWorkspace();
  const { setIsOpen: setWorkspaceModalOpen } = useRenameWorkspaceModalStore();
  const isDeleteModalOpen = useBoolean();
  const isShareModalOpen = useBoolean();
  const deleteWorkspace = async () => {
    await deleteWorkspacePost({ workspace_id: workspace.workspace_id });
    isDeleteModalOpen.setFalse();
  };

  const [ExtractIcon, extractTitle] = getClassNameAndIcon(workspace.class_name);
  const ClassColor = generatePastelColor(workspace.workspace_id);

  return (
    <>
      <RenameWorkspaceModal workspace_id={workspace.workspace_id} class_name={workspace.class_name} />
      <ConfirmDeleteModal
        isLoading={isLoading}
        name={workspace.class_name}
        entityType="class"
        isOpen={isDeleteModalOpen.value}
        setIsOpen={isDeleteModalOpen.setValue}
        onConfirm={deleteWorkspace}
      />
      <ShareWorkspaceModal
        workspace_id={workspace.workspace_id}
        setIsOpen={isShareModalOpen.setValue}
        isOpen={isShareModalOpen.value}
      />
      <styled.div alignItems="center" w="full" bgColor="#F8F8F8" shadow="shadow" py="10" px="4%">
        <styled.div display="flex" flexDir="row" alignItems="center" gap="2" justifyContent="space-between" w="full">
          <styled.span display="flex" alignItems="center" color="#6E6B7B" fontWeight="600" fontSize="2xl">
            <ExtractIcon color={ClassColor} strokeWidth={2} />
            <span>&nbsp;</span>
            {extractTitle}
            <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 5 } }}>
              <Tooltip.Trigger asChild>
                <IconButton
                  aria-label={t('common.renameWithParameter', { name: t('common.class', { count: 1 }) })}
                  variant="ghost"
                  size="sm"
                  marginRight={1}
                  onClick={() => setWorkspaceModalOpen(true)}
                  _hover={{ bgColor: 'inherit' }}>
                  <PenLineIcon color="#363636" />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Positioner>
                <Tooltip.Content
                  bgColor={'white'}
                  borderRadius={'sm'}
                  color={'#484846'}
                  fontSize={'sm'}
                  fontWeight={600}
                  px={4}
                  whiteSpace={'pre-line'}
                  textWrap={'nowrap'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  lineHeight={1}
                  boxShadow={
                    '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03),-14px 0px 6px -2px rgba(16, 24, 40, 0.03)'
                  }>
                  <Tooltip.Arrow
                    className={css({
                      '--arrow-size': '8px',
                      '--arrow-background': 'white',
                    })}>
                    <Tooltip.ArrowTip />
                  </Tooltip.Arrow>
                  {t('common.renameWithParameter', { name: t('common.class', { count: 1 }) })}
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Tooltip.Root>
          </styled.span>
          <HStack color="#646464" fontWeight="normal" fontSize="sm">
            <styled.button
              cursor={'pointer'}
              onClick={() => isDeleteModalOpen.setTrue()}
              marginRight={'8px'}
              color="#363636"
              _hover={{ color: '#FA5656' }}>
              <TrashIcon size={'20px'} />
            </styled.button>
            <Button
              backgroundColor="#6D56FA"
              variant={'solid'}
              size={'xs'}
              rounded={'lg'}
              px={'15px'}
              py={'15px'}
              onClick={() => isShareModalOpen.setTrue()}>
              <styled.span marginRight={'5px'}>{t('common.share')}</styled.span>
              <UploadIcon />
            </Button>
          </HStack>
        </styled.div>
      </styled.div>
    </>
  );
}
