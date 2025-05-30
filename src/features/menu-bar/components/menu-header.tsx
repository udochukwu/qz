import { UnstuckLogo } from '@/components/unstuck-logo';
import { Box, Flex, HStack, styled } from 'styled-system/jsx';
import { useRouter } from 'next13-progressbar';
import { Button } from '@/components/elements/button';
import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import { useGetFileDetail } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-file';
import generatePastelColor from '@/utils/generate-pastel-color';
import { usePathname } from 'next/navigation';
interface MenuHeaderProps {
  workspace: { workspace_id: string; class_name: string } | undefined;
  currentFlashcardId?: string;
}

export default function MenuHeader({ workspace, currentFlashcardId }: MenuHeaderProps) {
  const { data } = useGetFileDetail(currentFlashcardId!!);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogoClick = () => {
    router.push('/');
  };
  const handleClassClick = () => {
    router.push(`/classes/${workspace?.workspace_id}`);
  };

  return (
    <Box
      display="flex"
      width="full"
      textSizeAdjust="16px"
      fontWeight="semibold"
      color="#73726F"
      alignItems="center"
      justifyContent={'space-between'}
      py={2.5}
      px={4}
      borderBottom={workspace ? '1px solid token(colors.gray.4)' : '0px'}>
      <styled.div onClick={workspace ? handleClassClick : handleLogoClick} w={'full'} _hover={{ cursor: 'pointer' }}>
        {workspace ? (
          <ClassTitle workspace={workspace} />
        ) : currentFlashcardId ? (
          <Flex alignItems="center">
            <styled.img src="/icons/ic_star-circle.svg" alt="" height="40px" width="39px" />
            <styled.p width="170px" truncate m="0" fontSize="18px" fontWeight="600" color="#3E3C46" ml="2.5">
              {data?.filename}
            </styled.p>
          </Flex>
        ) : (
          <styled.div
            _hover={{
              opacity: pathname === '/' ? 1 : 0.5,
            }}
            transition={'opacity 0.2s ease-in-out'}>
            <UnstuckLogo />
          </styled.div>
        )}
      </styled.div>
    </Box>
  );
}

function ClassTitle({ workspace }: MenuHeaderProps) {
  const color = generatePastelColor(workspace?.workspace_id!);
  const [ExtractEmoji, extractTitle] = getClassNameAndIcon(workspace?.class_name);
  return (
    <HStack maxWidth="full">
      <Button
        justifyContent={'center'}
        size={'sm'}
        px={2}
        cursor={'pointer'}
        variant={'ghost'}
        bgColor={'#F3F3F3'}
        border={'1px solid rgba(239, 239, 240, 1)'}
        style={{
          color: color,
        }}
        _hover={{
          bgColor: 'transparent',
        }}>
        {<ExtractEmoji strokeWidth={2} />}
      </Button>
      <styled.span
        fontWeight={'medium'}
        fontSize={'lg'}
        color={'#3E3C46'}
        maxWidth="calc(100% - 3rem)"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        display="block">
        {extractTitle}
      </styled.span>
    </HStack>
  );
}
