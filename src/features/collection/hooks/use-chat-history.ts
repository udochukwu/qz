import { ChatHistory } from '@/features/collection/history-api-types';
import axiosClient from '@/lib/axios';
import { useQuery } from 'react-query';
const getChatHistory = async () => {
  const res = await axiosClient.get('/chat/history', { params: { chats_offset: 0 } });
  return res?.data;
};

export const useChatHistory = () => {
  return useQuery<ChatHistory[]>(['chat-history'], getChatHistory);
};
