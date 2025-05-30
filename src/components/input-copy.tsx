import { Input } from './elements/input';
import { Button } from '@/components/elements/button';
import { useBoolean } from '@/hooks/use-boolean';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

interface Props {
  input: string;
}

export function InputCopy({ input }: Props) {
  const { t } = useTranslation();
  const isCopied = useBoolean();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    isCopied.setTrue();
    setTimeout(() => {
      isCopied.setFalse();
    }, 5000);
  };
  const wrapperClass = css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  });

  const inputClass = css({
    width: '100%',
    paddingRight: '150px', // Make room for the button
    overflow: 'hidden',
    whiteSpace: 'nowrap', // Prevent text wrapping
    textOverflow: 'ellipsis',
    borderRadius: '6px',
  });

  const buttonClass = css({
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '6px',
  });
  return (
    <div className={wrapperClass}>
      <Input
        textStyle={'sm'}
        color={'#838383'}
        value={input}
        className={inputClass}
        w={'600px'}
        height={'58px'}
        readOnly
      />
      <Button
        onClick={() => {
          !isCopied.value && copyToClipboard();
        }}
        className={buttonClass}
        size={'xs'}
        height={'37px'}
        backgroundColor={'#6D56FA'}
        marginLeft={'10px'}
        marginRight={'10px'}
        fontSize={'sm'}
        display={'flex'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'5px'}>
        <styled.p marginBottom={0} fontWeight={400}>
          {isCopied.value ? t('common.copy') : t('common.copyLink')}
        </styled.p>
        <styled.div marginLeft={'5px'} height={'15px'}>
          <Copy />
        </styled.div>
      </Button>
    </div>
  );
}
