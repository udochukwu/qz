import { SearchIcon } from 'lucide-react';
import { Input, InputProps } from './elements/input';
import { css } from 'styled-system/css';
import { useTranslation } from 'react-i18next';

interface SearchProps extends InputProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export function Search({ search, onSearchChange, ...rest }: SearchProps) {
  const { t } = useTranslation();

  const wrapperClass = css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  });

  const iconClass = css({
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'quizard.black',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  });

  const inputClass = css({
    textStyle: 'xs',
    paddingLeft: '32px',
    width: '100%',
    borderColor: '#e7e8ea',
    '&::placeholder': {
      color: 'quizard.black',
    },
  });

  return (
    <div className={wrapperClass}>
      <div className={iconClass}>
        <SearchIcon size={16} />
      </div>
      <Input
        type="text"
        value={search}
        placeholder={t('common.search')}
        onChange={e => onSearchChange(e.target.value)}
        className={inputClass}
        {...rest}
      />
    </div>
  );
}
