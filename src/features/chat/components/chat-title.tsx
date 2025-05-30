import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import { css } from 'styled-system/css';
import { WorkspaceFile, WorkspaceFileUploadStatus } from '@/features/files-pdf-chunks-sidebar/types/types';
import { Box, HStack, styled } from 'styled-system/jsx';
import { GetFilesResponse } from '@/features/files-pdf-chunks-sidebar/types/api-types';
import { WhiteYoutubeIcon, YoutubeIcon } from '@/features/files-pdf-chunks-sidebar/youtube-icon';
import generatePastelColor from '@/utils/generate-pastel-color';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export default function CourseTitle({
  chat_name,
  is_class_chat,
  fileList,
  workspace_id,
}: {
  chat_name: string;
  is_class_chat: boolean;
  workspace_id: string;
  fileList: GetFilesResponse | undefined;
}) {
  const { t } = useTranslation();

  const files = fileList?.files ?? [];
  //Files uploading to current workspace
  const uploadingFilesToCurrentWorkspace = files.filter(file => file.status === WorkspaceFileUploadStatus.UPLOADING);
  const successFilesCurrentWorkspace = files.filter(file => file.status === WorkspaceFileUploadStatus.FINISHED);

  const { emoji, title, subtitle } = getChatText(chat_name, successFilesCurrentWorkspace, is_class_chat, t);
  const color = generatePastelColor(workspace_id);
  const colorBackground = color.replace(')', ',0.1)').replace('rgb', 'rgba');
  const colorBorder = color.replace(')', ',0.4)').replace('rgb', 'rgba');

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="6"
      flex={1}
      h="full"
      w="80%"
      margin="auto"
      justifyContent="center">
      <Box display="flex" flexDir="column" alignItems="center" gap="2">
        <Box color="black" textAlign="center" fontSize="2xl" lineHeight="2xl">
          <span
            className={css({
              fontWeight: 'normal',
            })}>
            {t('chat.courseTitle.title')}
          </span>
          <br />
          <HStack
            gap="2"
            alignItems="center"
            justifyContent="center"
            borderRadius={'xl'}
            style={{ backgroundColor: colorBackground, borderColor: colorBorder }}
            border={'1px solid'}
            p={1.5}
            w={'fit-content'}
            mx={'auto'}
            mt={2}>
            <Box borderRadius={'lg'} style={{ backgroundColor: color }} color="white" p={'1'}>
              {emoji}
            </Box>
            <styled.span
              fontWeight={'semibold'}
              fontSize={'lg'}
              display={'block'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
              color={'#3E3C48'}
              maxW={'600px'}>
              {title}
            </styled.span>
          </HStack>
        </Box>
        <styled.span color="gray.500" textAlign="center" fontSize="base" lineHeight="base" mt="2">
          {subtitle}
        </styled.span>
        {uploadingFilesToCurrentWorkspace.length > 0 && (
          <Box
            mt="4"
            p="4"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="#faebcc"
            display="block"
            alignItems="center"
            color="#8a6d3b"
            backgroundColor="#fcf8e3"
            maxW="600px">
            <styled.span fontWeight="semibold">{t('common.warning')}: </styled.span>
            <styled.span>
              {t('chat.courseTitle.fileUpload', { count: uploadingFilesToCurrentWorkspace.length })}
            </styled.span>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function getChatText(
  chatName: string,
  successFilesCurrentWorkspace: WorkspaceFile[],
  isClass: boolean,
  t: TFunction<'translation', undefined>,
) {
  const DefaultIcon = getClassNameAndIcon()[0];
  let emoji: LucideIcon | JSX.Element = <DefaultIcon size={30} />;
  let title: string = '';
  let subtitle: string = t('chat.courseTitle.text.subtitle.default');

  if (isClass) {
    const [ExtractEmoji, extractedTitle] = getClassNameAndIcon(chatName);
    emoji = <ExtractEmoji size={30} />;
    title = extractedTitle;
  } else {
    if (successFilesCurrentWorkspace.length === 1) {
      //Get file name:
      title = successFilesCurrentWorkspace[0].filename.slice(
        0,
        successFilesCurrentWorkspace[0].filename.lastIndexOf('.'),
      );
      emoji =
        successFilesCurrentWorkspace[0].filename.slice(
          successFilesCurrentWorkspace[0].filename.lastIndexOf('.') + 1,
        ) === 'youtube' ? (
          <WhiteYoutubeIcon size={30} />
        ) : (
          emoji
        );
      subtitle = t('chat.courseTitle.text.subtitle.one');
    } else {
      title = `${successFilesCurrentWorkspace.length} files`;
      subtitle = t('chat.courseTitle.text.subtitle.otherLength');
    }
  }

  return { emoji, title, subtitle };
}
