import axiosClient from '@/lib/axios';
import useChunksStore from '@/features/chat/stores/chunks-strore';
import { ChatHistoryMessagesProps, ResourceChunk } from '@/types';
import { useQuery } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import useGetChatId from './use-chatId';
import useNewMessageStore from '../stores/new-message-stroe';

const fetchChatHistory = async (chatId: string): Promise<ChatHistoryMessagesProps> => {
  const res = await axiosClient.get<ChatHistoryMessagesProps>(`/chat/${chatId}`);
  return res?.data;
};
export const useChatHistory = () => {
  const chatId = useGetChatId();
  const appendChunks = useChunksStore(state => state.appendChunks);
  const isMessageStreaming = useNewMessageStore(state => state.isNewMessageLoading);
  const { data, isLoading, refetch, isError } = useQuery<ChatHistoryMessagesProps, Error>(
    ['chatHistory', chatId],
    () => fetchChatHistory(chatId!),
    {
      enabled: !!chatId && !isMessageStreaming,
      refetchOnWindowFocus: false,
      onError: (e: Error) => {
        sendErrorMessage(e);
      },
      onSuccess: (data: ChatHistoryMessagesProps) => {
        // use regex to extract chunk ids from the resource_chunks
        // uuidv4 regex is from https://stackoverflow.com/questions/136505/searching-for-uuids-in-text-with-regex
        const regex = /<chunk>([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})<\/chunk>/g;
        const chunk_ids = data.messages
          .map(m => m.message.match(regex))
          .map(matches => matches?.map(m => m.replace(/<\/?chunk>/g, '')))
          .filter(Boolean) as string[][];

        let id2chunk: { [key: string]: ResourceChunk } = {};
        data.messages.forEach(m => {
          if (m.resource_chunks) {
            m.resource_chunks.forEach(c => {
              id2chunk[c.chunk_id] = c;
            });
          }
        });

        let resourceChunks = chunk_ids.map(matches => matches.map(id => id2chunk[id]));
        resourceChunks = resourceChunks.map(chunks => chunks.filter(Boolean)); // remove undefined from the array
        resourceChunks = resourceChunks.filter(chunks => chunks.length > 0); // remove empty arrays

        const messagesWithChunks = data.messages.filter(m => !!m.resource_chunks).slice(0, resourceChunks.length);
        messagesWithChunks.forEach((m, i) => {
          appendChunks(m.message_id, resourceChunks[i]);
        });
      },
    },
  );

  return { data, isError, isLoading, refetch };
};
