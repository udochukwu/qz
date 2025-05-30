import { SelectedNode } from '@/types';
import { create } from 'zustand';

interface chatStore {
  selectedNodes: SelectedNode[];
  addToSelectedNodes: (nodes: SelectedNode) => void;
  setSelectedNodes: (nodes: SelectedNode[]) => void;
}
const useChatStore = create<chatStore>(set => ({
  selectedNodes: [],
  // Add a new node to the selected nodes, if the message_id already exists,
  // it will be overwritten with the new selected_child
  addToSelectedNodes: (node: SelectedNode) =>
    set(state => ({
      // Filter out any node that has the same message_id as the new node
      selectedNodes: [
        ...state.selectedNodes.filter(n => n.message_id !== node.message_id),
        node, // Add the new node at the end of the array
      ],
    })),
  setSelectedNodes: (nodes: SelectedNode[]) => set(() => ({ selectedNodes: nodes })),
}));

export default useChatStore;
