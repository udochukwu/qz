import axiosClient from '@/lib/axios';
import { MessageSuggestion } from '../types';
import useGetChatId from './use-chatId';
import { useQuery } from 'react-query';

const fetchMessageSuggestion = async (chatId: string): Promise<MessageSuggestion[]> => {
  const res = await axiosClient.get<MessageSuggestion[]>(`/chat/${chatId}/suggestion`);
  return res?.data;
};

export const useChatSuggestion = () => {
  const chatId = useGetChatId();
  return useQuery<MessageSuggestion[], Error>(['chatSuggestion', chatId], () => fetchMessageSuggestion(chatId!), {
    refetchOnWindowFocus: false,
  });
};
