import { API } from '@/lib/API';
import { AuthorTypes, MessageStatus, ResourceChunk, TemporaryMessageIds } from '@/types';
import { useUserStore } from '@/stores/user-store';
import axiosClient from '@/lib/axios';
import useChatStore from '../stores/chat-store';
import { queryClient } from '@/providers/Providers';
import pRetry from 'p-retry';
import { CompactFileSuggestion, CompactSuggestion, FeedbackData, UseSendNewMessageResponse } from '../types';
import { updateChatHistory } from '../utils/chat-history-helper';
import useNewMessageStore from '@/features/chat/stores/new-message-stroe';
import { invalidateQuests } from '@/features/quest/utils/invalidate_quests';

const fetchAddNewMessage = async (
  message: string,
  setFeedbackData: (feedback_data: FeedbackData) => void,
  chatId: string,
  parent_message_id: string | null,
  message_id: string,
  suggestion?: CompactFileSuggestion | CompactSuggestion,
) => {
  const url = API + '/chat';
  const body = {
    chat_id: chatId,
    message: message,
    parent_message_id: parent_message_id,
    message_id: message_id,
    suggestion: suggestion,
  };

  //fix this
  const session = axiosClient.getSessionToken();
  const fetchAddNewMessage = async () => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': session,
        },
        body: JSON.stringify(body),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (response.body) {
            return response.body.getReader();
          } else {
            throw new Error('Error streaming response');
          }
        })
        .then(reader => {
          let partialData = '';
          let response_chatID = ''; // Initialize inside Promise
          let be_message_id = '';
          const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
            if (done) {
              resolve(response_chatID); // Resolve the Promise with the chat_id
              return;
            }
            // Since we've already checked if done is true, we can safely assert that value is not undefined here.
            // This is safe within this specific logic, because done being false implies value has data.
            const chunk = new TextDecoder('utf-8').decode(value!); // Use the non-null assertion operator (!) here
            const lines = (partialData + chunk).split('\n');
            partialData = lines.pop() || '';
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const data = JSON.parse(line.replace('data:', ''));
                if (data.message_id) {
                  be_message_id = data.message_id;
                  updateChatHistory.replaceTemporaryMessageId(chatId, TemporaryMessageIds.AI, be_message_id);
                }
                if (data.message) {
                  updateChatHistory.appendToLastMessage(chatId, data.message, be_message_id);
                }
                response_chatID = data.chat_id;
                if (data.resource_chunks) {
                  updateChatHistory.addChunksToMessageId(chatId, be_message_id, data.resource_chunks);
                }
                if (data.feedback) {
                  setFeedbackData(data.feedback);
                }
                if (data.chat_desc) updateChatHistory.setChatTitle(chatId, data.chat_desc);
                if (data.copilot) updateChatHistory.setCopilotData(chatId, be_message_id, data.copilot);
                if (data.pro_required) updateChatHistory.setProRequired(chatId, data.pro_requred);
              }
            }
            return reader.read().then(processText);
          };

          return reader.read().then(processText);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  return pRetry(fetchAddNewMessage, {
    retries: 2, // Retry twice
    minTimeout: 500, // 500ms delay before retrying
    onFailedAttempt: error => {
      console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
    },
  });
};

export const useSendNewMessage = (): UseSendNewMessageResponse => {
  const { setLoading, setFeedbackData } = useNewMessageStore();
  const { username } = useUserStore();
  const addToSelectedNodes = useChatStore(state => state.addToSelectedNodes);
  const askForBotMessage = async (
    message: string,
    chatId: string,
    parent_message_id: string | null,
    message_id: string,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => {
    setLoading(true);
    const ai_shell_message = {
      message: '',
      author: {
        name: 'Unstuck',
        type: AuthorTypes.AI,
      },
      isStreaming: true,
      message_id: TemporaryMessageIds.AI,
      parent_message_id: message_id,
      created_at: Math.floor(Date.now() / 1000),
      children: [],
      status: MessageStatus.SENDING,
    };
    updateChatHistory.appendMessage(chatId, ai_shell_message);

    try {
      await fetchAddNewMessage(message, setFeedbackData, chatId!, parent_message_id, message_id, suggestion);
      invalidateQuests('ask_a_question');
      updateChatHistory.setLastMessageStatus(chatId, MessageStatus.SUCCESS);
    } catch (error) {
      updateChatHistory.setLastMessageStatus(chatId, MessageStatus.ERROR);
    } finally {
      updateChatHistory.setMessageStream(chatId, false);
      queryClient.invalidateQueries(['chatSuggestion']);
      queryClient.invalidateQueries('subscriptionStatus');
      setLoading(false);
      if (parent_message_id === null) {
        queryClient.invalidateQueries('side-bar');
      }
    }
  };

  const onMessageSend = async (
    message: string,
    chatId: string,
    parent_message_id: string | null,
    message_id: string,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => {
    const user_message = {
      message: message,
      author: {
        name: username,
        type: AuthorTypes.USER,
      },
      message_id: message_id,
      parent_message_id: parent_message_id,
      created_at: Math.floor(Date.now() / 1000),
      children: [],
      status: MessageStatus.SUCCESS,
    };
    addToSelectedNodes({ message_id: parent_message_id, selected_child: message_id });
    updateChatHistory.appendMessage(chatId, user_message);
    return askForBotMessage(message, chatId, parent_message_id, message_id, suggestion);
  };

  const regenerateQuestion = async (
    question: string,
    chatId: string,
    parent_message_id: string | null,
    message_id: string,
    failed_message_id: string,
  ) => {
    updateChatHistory.removeMessage(chatId, failed_message_id);
    return askForBotMessage(question, chatId, parent_message_id, message_id);
  };

  return {
    onMessageSend,
    regenerateQuestion,
  };
};
