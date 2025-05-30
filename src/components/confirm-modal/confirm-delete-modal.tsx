import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import { ConfirmModalProps } from '@/components/confirm-modal/confirm-modal-type';
import { Trash2Icon, UserRoundXIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
interface Props extends ConfirmModalProps {
  name?: string;
  entityType: 'file' | 'class' | 'chat' | 'account';
}
export const ConfirmDeleteModal = ({ name, entityType, ...rest }: Props) => {
  const { t } = useTranslation();

  name = name === '' ? 'Untitled ' + entityType.charAt(0).toUpperCase() + entityType.slice(1) : name;
  const title =
    entityType === 'account' ? t('chat.delete.title.account') : t('chat.delete.title.otherEntity', { name });
  const desc =
    entityType === 'account'
      ? t('chat.delete.description.account')
      : t('chat.delete.description.otherEntity', { entityType });
  return (
    <ConfirmModal
      title={title}
      Icon={entityType === 'account' ? UserRoundXIcon : Trash2Icon}
      desc={desc}
      contentProps={{ alignItems: 'center', maxWidth: '400px', textAlign: 'center' }}
      {...rest}
      confirmButtonText={t('common.delete')}
    />
  );
};
