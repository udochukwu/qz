import { HStack, styled } from 'styled-system/jsx';
import { FlashcardIcon } from './flashcard-icon';
import generatePastelColor from '@/utils/generate-pastel-color';
import { lightenHexColor, rgbStringToHex } from '@/utils/helpers';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { FileItemExtension } from '@/components/file-extension/file-item-extension';
import { extractFileName } from '@/features/files-pdf-chunks-sidebar/files-manager/util/extract-file-name';
import { css } from 'styled-system/css';
import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next13-progressbar';

interface FlashcardItemProps {
  data: FlashcardSets;
}

export default function FlashcardSetItem({ data }: FlashcardItemProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const textColor = generatePastelColor(data.set_id);
  const bg = lightenHexColor(rgbStringToHex(textColor), 80);
  const iconColor = lightenHexColor(rgbStringToHex(textColor), 8);
  const fileExtension = getFileExtension(data.file_names?.[0]);
  const fileName = extractFileName(data.file_names?.[0]);

  return (
    <styled.div
      onClick={() => {
        router.push(`/flashcards/${data?.set_id}`);
      }}
      cursor="pointer"
      w="full"
      p="4px"
      pb="10px"
      borderRadius="6px"
      bg="#F8F8F9"
      border="1px solid #5F5F5F0F">
      <styled.div
        style={{
          backgroundColor: bg,
        }}
        position="relative"
        borderRadius="4px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        h="92px">
        <styled.span
          className={css({
            position: 'absolute',
            top: '4px',
            right: '4px',
            px: '8px',
            py: '4px',
            zIndex: 1,
            backgroundColor: 'white',
            borderRadius: '4px',
            fontSize: '8px',
          })}>{`${data.number_of_flashcards} ${t('flashcards.flashset.terms')}`}</styled.span>
        <FlashcardIcon color={iconColor} width="20" height="20" />
        <styled.p
          mt="6px"
          mb="0"
          fontWeight="500"
          fontSize="14px"
          style={{
            color: textColor,
            zIndex: 1,
          }}>
          {data.name}
        </styled.p>
      </styled.div>
      <HStack justifyContent="space-between" mt="11px" px="1.5" alignItems="center">
        <styled.p
          color="#3E3C46"
          m="0"
          fontWeight="500"
          fontSize="12px"
          maxWidth="80%"
          textWrap="nowrap"
          textOverflow="ellipsis"
          overflowX="clip">
          {fileName}
        </styled.p>
        <FileItemExtension width="18px" height="18px" iconSize={15} fontSize="6.9px" extension={fileExtension} />
      </HStack>
    </styled.div>
  );
}
