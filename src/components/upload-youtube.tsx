import { Input } from './elements/input';
import { Button } from '@/components/elements/button';
import { css } from 'styled-system/css';
import { SpinningIcon } from './spinning-icon';
import { useTranslation } from 'react-i18next';

interface Props {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onUpload: () => void;
}

export function UploadYoutube({ input, isLoading, onChange, onUpload }: Props) {
  const { t } = useTranslation();
  const wrapperClass = css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingX: '20px',
  });

  const inputClass = css({
    width: '100%',
    paddingRight: '80px', // Make room for the button
    borderColor: '#E8E8E8',
  });

  const buttonClass = css({
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#6D56FA',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload();
  };

  return (
    <form onSubmit={handleSubmit} className={wrapperClass}>
      <Input
        textStyle={'sm'}
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        value={input}
        className={inputClass}
        w={'565px'}
        height={'58px'}
        onChange={e => onChange(e.target.value)}
      />
      <Button
        type="submit"
        className={buttonClass}
        size={'xs'}
        fontSize={'sm'}
        fontWeight={400}
        height={'37px'}
        marginRight={'30px'}>
        {isLoading ? <SpinningIcon /> : t('common.upload')}
      </Button>
    </form>
  );
}
