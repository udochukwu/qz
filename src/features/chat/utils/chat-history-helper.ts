import {
  ChatMessageProps,
  SelectedNode,
  ChatHistoryMessagesProps,
  ResourceChunk,
  MessageStatus,
  TemporaryMessageIds,
} from '@/types';
import { queryClient } from '@/providers/Providers';

function traverseUpwards(messageId: string, chatHistoryMessages: ChatMessageProps[]): ChatMessageProps[] {
  const node = chatHistoryMessages.find(msg => msg.message_id === messageId);
  if (!node) return [];

  const parentNode = chatHistoryMessages.find(msg => msg.message_id === node.parent_message_id);
  const siblings = chatHistoryMessages.filter(msg => msg.parent_message_id === node.parent_message_id);
  const siblingIds = siblings.map(sibling => sibling.message_id);

  const nodeWithSiblings = { ...node, siblings_node_ids: siblingIds };

  if (!parentNode) return [nodeWithSiblings];

  const history = traverseUpwards(parentNode.message_id, chatHistoryMessages);
  history.push(nodeWithSiblings);
  return history;
}

function getInitialChatHistoryMessages(chatHistoryMessages: ChatMessageProps[]): {
  initialMessages: ChatMessageProps[];
  selectedNodes: SelectedNode[];
} {
  const lastNode = chatHistoryMessages[chatHistoryMessages.length - 1];
  if (!lastNode) return { initialMessages: [], selectedNodes: [] };

  const initialMessages = traverseUpwards(lastNode.message_id, chatHistoryMessages);
  const selectedNodes = initialMessages.map(node => {
    let selected_child: string | undefined = undefined; // Use `undefined` instead of `null`
    if (node.siblings_node_ids && node.siblings_node_ids.length > 1) {
      const index = node.siblings_node_ids.indexOf(node.message_id);
      if (index > -1) {
        selected_child = node.siblings_node_ids[index];
      }
    }
    return { message_id: node.parent_message_id, selected_child };
  });

  return { initialMessages, selectedNodes };
}

export function getChatHistoryMessages(
  chatHistoryMessages: ChatMessageProps[],
  selectedNodes: SelectedNode[],
): ChatMessageProps[] {
  try {
    const findMessageById = (id: string): ChatMessageProps | undefined => {
      return chatHistoryMessages.find(message => message.message_id === id);
    };

    const addChildNodes = (
      nodeId: string,
      messages: ChatMessageProps[],
      selectedMap: Map<string | null, string>,
    ): ChatMessageProps[] => {
      const node = findMessageById(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }

      const selectedChildId = selectedMap.get(nodeId);
      let childNodes: ChatMessageProps[] = [];

      if (selectedChildId) {
        // If there is a selected child, follow that path exclusively
        childNodes = addChildNodes(selectedChildId, messages, selectedMap);
      } else {
        // If no selected child, proceed with adding the most recent child if any
        const children = messages.filter(msg => msg.parent_message_id === nodeId);
        if (children.length > 0) {
          const mostRecentChild = children.reduce((prev, current) =>
            prev.created_at > current.created_at ? prev : current,
          );
          childNodes = addChildNodes(mostRecentChild.message_id, messages, selectedMap);
        }
      }

      const parentNode = messages.find(msg => msg.message_id === node.parent_message_id);
      let siblingsNodeIds = parentNode
        ? messages.filter(msg => msg.parent_message_id === parentNode.message_id).map(msg => msg.message_id)
        : [];
      //for siblingsNodeIds if there parentNode is not found, then the node is a root node, so we add all the root nodes as siblings
      if (siblingsNodeIds.length === 0) {
        siblingsNodeIds = messages.filter(msg => !msg.parent_message_id).map(msg => msg.message_id);
      }

      const newNode = { ...node, siblings_node_ids: siblingsNodeIds };
      return [newNode, ...childNodes];
    };

    const { initialMessages, selectedNodes: initialSelectedNodes } = getInitialChatHistoryMessages(chatHistoryMessages);

    if (selectedNodes.length === 0) {
      return initialMessages;
    }

    const selectedMap = new Map<string | null, string>();
    initialSelectedNodes.forEach(node => {
      if (node.selected_child) {
        selectedMap.set(node.message_id!, node.selected_child);
      }
    });

    selectedNodes.forEach(node => {
      if (node.selected_child) {
        selectedMap.set(node.message_id!, node.selected_child);
      }
    });

    let rootNodes = chatHistoryMessages.filter(
      msg => !msg.parent_message_id || !findMessageById(msg.parent_message_id),
    );

    if (rootNodes.length === 0) {
      throw new Error('No root nodes found in chat history');
    }

    rootNodes.forEach(node => {
      node.siblings_node_ids = rootNodes.map(rootNode => rootNode.message_id);
    });

    const selectedRootNode = rootNodes.find(node => selectedMap.get(null) === node.message_id) || rootNodes[0];

    if (!selectedRootNode) {
      throw new Error('Selected root node not found');
    }

    const history = addChildNodes(selectedRootNode.message_id, chatHistoryMessages, selectedMap);
    return history;
  } catch (error) {
    console.error('Error in getChatHistoryMessages:', error);
    // You might want to return an empty array or some default value in case of an error
    return [];
  }
}
export const updateChatHistory = {
  appendToLastMessage: (chatId: string, delta: string, message_id: string) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = [...oldData.messages];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0) {
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          message: newMessages[lastIndex].message + delta,
        };
      }
      //Set the correct IDs for the new message
      if (newMessages[lastIndex].message_id !== message_id) {
        newMessages[lastIndex].message_id = message_id;
        //Update the children of the parent message
        const parentMessage = newMessages.find(msg => msg.message_id === newMessages[lastIndex].parent_message_id);
        if (parentMessage) {
          //if TemporaryMessageIds.AI , replace the message_id with the new message_id
          const newChildren = parentMessage.children.map(child =>
            child === TemporaryMessageIds.AI ? message_id : child,
          );
          parentMessage.children = newChildren;
        }
      }
      return { ...oldData, messages: newMessages };
    });
  },

  appendMessage: (chatId: string, message: ChatMessageProps) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      // Update the parent message to include this new message's ID in its children list
      const updatedMessages = oldData.messages.map(msg => {
        if (msg.message_id === message.parent_message_id) {
          return {
            ...msg,
            children: msg.children ? [...msg.children, message.message_id] : [message.message_id],
          };
        }
        return msg;
      });

      return { ...oldData, messages: [...updatedMessages, message] };
    });
  },

  setMessageStream: (chatId: string, isStreaming: boolean) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }
      let newData = { ...oldData, messages: oldData.messages.map(msg => ({ ...msg, isStreaming })) };
      return newData;
    });
  },

  removeMessage: (chatId: string, messageId: string) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = oldData.messages.filter(msg => msg.message_id !== messageId);
      return { ...oldData, messages: newMessages };
    });
  },
  addChunksToMessageId: (chatId: string, message_id: string, resource_chunks: ResourceChunk[]) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = oldData.messages.map(msg => {
        if (msg.message_id === message_id) {
          return { ...msg, resource_chunks };
        }
        return msg;
      });
      return { ...oldData, messages: newMessages };
    });
  },
  //Set last message status
  setLastMessageStatus: (chatId: string, status: MessageStatus) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = [...oldData.messages];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0) {
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          status,
        };
      }
      return { ...oldData, messages: newMessages };
    });
  },

  setChatTitle: (chatId: string, chatTitle: string) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      return { ...oldData, chat_desc: chatTitle };
    });
  },

  setCopilotData: (chatId: string, message_id: string, copilot: any) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = oldData.messages.map(msg => {
        if (msg.message_id === message_id) {
          return { ...msg, copilot };
        }
        return msg;
      });
      return { ...oldData, messages: newMessages };
    });
  },

  replaceTemporaryMessageId: (chatId: string, oldMessageId: string, newMessageId: string) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      const newMessages = oldData.messages.map(msg => {
        if (msg.message_id === oldMessageId) {
          return { ...msg, message_id: newMessageId };
        }
        return msg;
      });

      return { ...oldData, messages: newMessages };
    });
  },

  setProRequired: (chatId: string, pro_required: boolean) => {
    queryClient.setQueryData<ChatHistoryMessagesProps>(['chatHistory', chatId], (oldData): ChatHistoryMessagesProps => {
      if (!oldData) {
        throw new Error('Chat history not found, chatId: ' + chatId);
      }

      return { ...oldData, pro_required: pro_required };
    });
  },
};
