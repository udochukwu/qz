import { Button } from '@/components/elements/button';

interface Props {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export const ActionButton = ({ icon, text, onClick }: Props) => {
  return (
    <Button
      outline={'none'}
      justifyContent={'flex-start'}
      w={'100%'}
      h={'44px'}
      size={'sm'}
      px={2}
      fontWeight={500}
      color={'rgb(21, 17, 43)'}
      cursor={'pointer'}
      variant={'ghost'}
      bgColor={'transparent'}
      onClick={onClick}
      _hover={{
        bgColor: 'rgba(21, 17, 43,0.1)',
      }}>
      {icon}
      {text}
    </Button>
  );
};
