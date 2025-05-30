import { useListClasses } from '@/hooks/use-list-classes';
import { styled } from 'styled-system/jsx';
import { WorkspaceClass } from '@/types';
import { NewClassButton } from '@/components/new-class-button';
import { Grid } from 'styled-system/jsx';
import { ClassButton } from '@/components/class-button';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import OnboardingInfoModal from '@/components/onboarding-modal';
import { ClipboardIcon } from 'lucide-react';
import { CreateNewWorkspaceModal } from '@/features/class/components/create-new-workspace-modal';
import { useBoolean } from '@/hooks/use-boolean';
import generatePastelColor from '@/utils/generate-pastel-color';
import { useTranslation } from 'react-i18next';

interface ClassesListProps {
  onSelectClass?: (classItem: WorkspaceClass) => void;
  selectedClass?: WorkspaceClass | null;
}

export default function ClassesList({ onSelectClass, selectedClass }: ClassesListProps) {
  const { t } = useTranslation();

  const { data: classesList } = useListClasses();
  const classes: WorkspaceClass[] = classesList?.classes ?? [];
  const { mutate: createChat } = useCreateChat();
  const isCreateWorkspaceModalOpen = useBoolean(false);

  const onClick = (classItem: WorkspaceClass) => {
    createChat({ workspace_id: classItem.workspace_id });
  };

  const onCreateClass = () => {
    isCreateWorkspaceModalOpen.setTrue();
  };

  return (
    <>
      <CreateNewWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen.value}
        setIsOpen={isCreateWorkspaceModalOpen.setValue}
      />
      <div>
        {/* <styled.span fontWeight="400" fontSize="14px" color="#15112BB2" verticalAlign="top">
          {classes.length === 0
            ? t('newChatView.classesFileBrowser.list.instruction.noClass')
            : t('newChatView.classesFileBrowser.list.instruction.otherClass')}
        </styled.span> */}
        <Grid columns={classes.length === 1 ? 1 : 2} maxH="210px" overflow="auto" mt="16px">
          {classes.map(classItem => (
            <ClassButton
              key={classItem.workspace_id}
              class_name={classItem.class_name}
              onClick={() => onClick(classItem)}
              color={generatePastelColor(classItem.workspace_id)}
              isSelected={selectedClass?.workspace_id === classItem.workspace_id}
            />
          ))}
        </Grid>
        <styled.div marginTop="25px">
          <NewClassButton centered={true} onClick={onCreateClass} />
        </styled.div>
        <OnboardingInfoModal title={t('class.workspace.aboutClasses')} guideId="show_about_classes" mt="!24px">
          <ClipboardIcon style={{ marginTop: 2, minWidth: '20px' }} color="#5B586B" />
          <styled.div fontSize={14} color="#5B586B" fontWeight="400">
            <styled.p marginBottom="18px">{t('newChatView.classesFileBrowser.list.title')}</styled.p>
            <styled.p>{t('newChatView.classesFileBrowser.list.description')}</styled.p>
          </styled.div>
        </OnboardingInfoModal>
      </div>
    </>
  );
}
