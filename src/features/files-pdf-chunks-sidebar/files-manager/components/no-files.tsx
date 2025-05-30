import { VStack, styled } from 'styled-system/jsx';
import { EmptyFilesIcon } from './files-list/empty-files-icon';
import { useTranslation } from 'react-i18next';

interface Props {
  isSearch?: boolean;
}

export const NoFiles = ({ isSearch = false }: Props) => {
  const { t } = useTranslation();

  return (
    <VStack
      justify="center"
      alignItems="center"
      h="100%"
      width="70%"
      mx="auto"
      color="gray.500"
      fontSize="md"
      textAlign="center"
      gap={4}
      py={4}>
      <img src="/images/action-box-thumbnails/empty_folder.jpg" alt="folder for files" width={80} height={80} />
      <styled.span fontSize={'lg'} fontWeight={'medium'}>
        {isSearch ? t('files.list.noFiles.noFilesFound') : t('files.list.noFiles.noFilesUploaded')}
      </styled.span>
      <styled.span fontSize={'sm'} color={'#888693'} fontWeight={'normal'}>
        {isSearch ? t('files.list.noFiles.instructions.search') : t('files.list.noFiles.instructions.noSearch')}
      </styled.span>
    </VStack>
  );
};
