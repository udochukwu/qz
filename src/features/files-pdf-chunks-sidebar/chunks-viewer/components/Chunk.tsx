import { ResourceChunk, isSubtitleChunk, isDocumentChunk } from '@/types';
import { Box, Flex, HStack } from 'styled-system/jsx';
import { extractFileName } from '../../files-manager/util/extract-file-name';
import ChunkButton from '@/components/chunk-button';
import { MathpixMarkdown } from 'mathpix-markdown-it';
import { styled } from 'styled-system/jsx';
import { useHandleChunkClick } from '@/hooks/use-handle-chunk-click';
import { secondsIntoHHMMSS } from '../../utils/convert-seconds';
import { IconButton } from '@/components/elements/icon-button';
import { Expand, MessageCircleMoreIcon } from 'lucide-react';
import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import Image from 'next/image';
import XRegExp from 'xregexp';
import { Tooltip } from '@/components/elements/tooltip';
import { useTranslation } from 'react-i18next';

interface Template {
  header: string;
  format: (match: string) => string;
}

const replaceBrackets = (text: string, template: Template) => {
  let processedText = text;
  let matches = [];

  if (processedText.includes(template.header)) {
    matches = XRegExp.matchRecursive(text, '{', '}', 'g', {
      unbalanced: 'skip',
    });

    for (let match of matches) {
      processedText = processedText.replace('\\' + template.header + '{' + match + '}', template.format(match));
    }
  }

  return processedText;
};

const preprocessMarkdown = (text: string) => {
  // Rules
  // - \[ needs "\n" before it
  // - \section*{...} needs to be replaced with ## (with matching { ... })
  // - \subsection*{...} needs to be replaced with ### (with matching { ... })
  // - \title{...} needs to be replaced with # (with matching { ... })
  // - \author{...} needs to be replaced with Author: (with matching { ... })
  // - \begin{tabular}{...} .... \end{tabular} needs "\n" before and after
  // - Ensure "\n\n" is in front of ![...](...)
  // - Ensure ``` don't have any neighboring "\n"

  let matches = [];
  let processedText = text;
  // \[ needs "\n" before it
  processedText = processedText.replace(/([^\n])\\\[/g, '$1\n\\[');

  // \section*{...} needs to be replaced with ## (with matching { ... })
  const sectionTemplate: Template = {
    header: 'section*',
    format: match => `\n ## ${match}\n`,
  };
  processedText = replaceBrackets(processedText, sectionTemplate);

  // \subsection*{...} needs to be replaced with ### (with matching { ... })
  const subsectionTemplate: Template = {
    header: 'subsection*',
    format: match => `\n ### ${match}\n`,
  };
  processedText = replaceBrackets(processedText, subsectionTemplate);

  // \title{...} needs to be replaced with # (with matching { ... })
  const titleTemplate: Template = {
    header: 'title',
    format: match => `\n # ${match}\n`,
  };

  processedText = replaceBrackets(processedText, titleTemplate);

  // \author{...} needs to be replaced with Author: (with matching { ... })
  const authorTemplate: Template = {
    header: 'author',
    format: match => `\n Author: ${match}\n`,
  };

  processedText = replaceBrackets(processedText, authorTemplate);

  // \begin{tabular}{...} .... \end{tabular} needs "\n" before and after
  matches = XRegExp.matchRecursive(text, '\\\\begin\\{tabular\\}', '\\\\end{tabular}', 'g', {
    unbalanced: 'skip',
  });

  for (let match of matches) {
    processedText = processedText.replace(
      '\\begin{tabular}' + match + '\\end{tabular}',
      `\n\\begin{tabular}${match}\\end{tabular}\n`,
    );
  }

  // Ensure "\n\n" is in front of ![...](...)
  processedText = processedText.replace(/(\S)(\!\[(?:[^\]]*)\]\((?:[^)]*)\))/g, '$1\n\n$2');

  // Ensure ``` don't have any neighboring "\n"
  processedText = processedText.replace(/\n+\s*```/g, '```');
  processedText = processedText.replace(/```\s*\n+/g, '```');

  return processedText;
};

export default function Chunk(resource_chunk: ResourceChunk) {
  const { t } = useTranslation();

  const fileName = extractFileName(resource_chunk.ws_file_name);

  let chunkTitleIndicator = '';
  let videoTimeIndicator = null;
  if (isSubtitleChunk(resource_chunk, resource_chunk.metadata)) {
    videoTimeIndicator = (
      <styled.div alignItems="center" display="flex">
        {secondsIntoHHMMSS(resource_chunk.metadata.start_time)}
        <svg
          width="16"
          height="2"
          viewBox="0 0 16 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 4px', verticalAlign: 'middle' }}>
          <path d="M0 1.48828H16" stroke="black" />
        </svg>
        {secondsIntoHHMMSS(resource_chunk.metadata.end_time)}
      </styled.div>
    );
  }
  if (isDocumentChunk(resource_chunk, resource_chunk.metadata)) {
    chunkTitleIndicator = `Page #${resource_chunk.metadata.page_number + 1}`;
  }

  const handleChunkClicked = useHandleChunkClick(resource_chunk.chunk_id);

  const onExpand = () => handleChunkClicked('chunk_sidebar');

  const { mutate: createChat } = useCreateChat();

  const onCreateChat = () => createChat({ workspace_file_ids: [resource_chunk.ws_file_id] });

  return (
    <Flex
      w="100%"
      h="100%"
      bg="white"
      p={4}
      rounded="lg"
      shadow="md"
      flexDirection="column"
      onClick={onExpand}
      cursor="pointer">
      <HStack alignItems="center" justifyContent={'space-between'} width="100%">
        <Flex alignItems="center" gap={2} px={2}>
          <ChunkButton chunk_id={resource_chunk.chunk_id} />
          <styled.span fontWeight="600" fontSize="15px" color={'quizard.black'}>
            {fileName}
          </styled.span>
        </Flex>
        <styled.span fontWeight="normal" fontSize="15px" color="grey">
          {chunkTitleIndicator}
        </styled.span>
      </HStack>
      <styled.span fontSize="sm" overflowY="hidden" color="rgba(21, 17, 43, 0.7)">
        <MathpixMarkdown
          text={
            isSubtitleChunk(resource_chunk, resource_chunk.metadata)
              ? preprocessMarkdown(resource_chunk.chunk).replace(/\n/g, ' ')
              : preprocessMarkdown(resource_chunk.chunk)
          }
        />
      </styled.span>
      {isSubtitleChunk(resource_chunk, resource_chunk.metadata) && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={4}
          h="70px"
          overflow={'hidden'}
          gap={2}
          backgroundColor={'rgba(109, 86, 250, 0.09)'}
          border={'1px solid rgba(76, 48, 224, 0.05))'}
          rounded="lg"
          mt={2}>
          <styled.div fontSize="md" color="black" fontWeight={'medium'}>
            {videoTimeIndicator}
          </styled.div>
          {resource_chunk.metadata.video_thumbnail_url && (
            <Image
              style={{ borderRadius: '5px', maxWidth: '95px' }}
              width={10}
              height={10}
              layout="responsive"
              src={resource_chunk.metadata.video_thumbnail_url}
              alt="video thumbnail"
            />
          )}
        </Flex>
      )}
      <HStack justifyContent="space-between" gap={2} mt={2}>
        <Box
          //4C30E0 8% opacity is rgba(76, 48, 224, 0.08)
          bgColor={'rgba(76, 48, 224, 0.08)'}
          color={'#4C30E0'}
          rounded="md"
          fontWeight="medium"
          px={1}
          py={0.75}
          border={'1px solid rgba(76, 48, 224, 0.04)'}
          fontSize="sm">
          {t('files.pdf.chunk.topicCard')}
        </Box>
        <Box>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton variant="ghost" onClick={onCreateChat} minW={7}>
                <MessageCircleMoreIcon size={20} color="grey" />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>
                {t('files.pdf.chunk.chatWith')} {resource_chunk.ws_file_name}
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton variant="ghost" onClick={onExpand} minW={7}>
                <Expand size={20} color="grey" />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>{t('common.expand')}</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </Box>
      </HStack>
    </Flex>
  );
}
