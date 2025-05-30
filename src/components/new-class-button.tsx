import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

interface Props {
  onClick: () => void;
  centered?: boolean;
}

export const NewClassButton = ({ onClick, centered }: Props) => {
  const { t } = useTranslation();

  return (
    <styled.button
      className={css({
        alignItems: 'center',
        fontSize: 'md',
        lineHeight: 'sm',
        px: '4',
        backgroundColor: '#F8F8F9',
        _hover: {
          backgroundColor: '#6D56FA14',
          color: '#6D56FA',
        },
        color: '#3E3C46',
        border: '1px dashed #DCDCDC',
        cursor: 'pointer',
        borderRadius: '12px',
        width: '100%',
        height: '56px',
        display: 'flex',
        fontWeight: 'medium',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: '10px',
      })}
      onClick={onClick}>
      <PlusIcon />
      <span>&nbsp;{t('class.workspace.new')}</span>
    </styled.button>
  );
};
