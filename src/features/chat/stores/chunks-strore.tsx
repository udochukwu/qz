import { ResourceChunk, ResourceChunkWithMessageId } from '@/types';
import { create } from 'zustand';

interface ChunksStore {
  all_resource_chunks: { [message_id: string]: ResourceChunk[] };
  chunk_name_map: { [chunk_id: string]: number };
  lastChunkNumber: number;
  appendChunks: (message_id: string, resource_chunks: ResourceChunk[]) => void;
  resetChunksStore: () => void;
  getChunkName: (chunk_id: string) => number;
  getChunk: (chunk_id: string) => ResourceChunk[];
}

const useChunksStore = create<ChunksStore>((set, get) => ({
  all_resource_chunks: {},
  chunk_name_map: {},
  lastChunkNumber: 0,

  appendChunks: (message_id, resource_chunks) => {
    set(state => {
      const existingChunks = state.all_resource_chunks[message_id] || [];

      // Filter out duplicates and assign names to new chunks
      const newChunks = resource_chunks
        .filter(chunk => !existingChunks.some(existingChunk => existingChunk.chunk_id === chunk.chunk_id))
        .map(chunk => {
          // Only assign a new name if the chunk doesn't already have one
          if (!state.chunk_name_map[chunk.chunk_id]) {
            state.chunk_name_map[chunk.chunk_id] = state.lastChunkNumber + 1;
            state.lastChunkNumber += 1;
          }

          return {
            ...chunk,
            chunkName: state.chunk_name_map[chunk.chunk_id],
          };
        });

      if (!newChunks.length) return state;

      return {
        ...state,
        all_resource_chunks: {
          ...state.all_resource_chunks,
          [message_id]: [...existingChunks, ...newChunks],
        },
        chunk_name_map: state.chunk_name_map,
        lastChunkNumber: state.lastChunkNumber,
      };
    });
  },

  getChunkName: (chunk_id: string) => {
    return get().chunk_name_map[chunk_id] || 0;
  },

  getChunk: (chunk_id: string) => {
    const chunks = get().all_resource_chunks;
    for (const messageChunks of Object.values(chunks)) {
      const matchingChunk = messageChunks.find(chunk => chunk.chunk_id === chunk_id);
      if (matchingChunk) {
        return [matchingChunk];
      }
    }
    return [];
  },

  resetChunksStore: () => {
    set(() => ({
      all_resource_chunks: {},
      chunk_name_map: {},
      lastChunkNumber: 0,
    }));
  },
}));

export default useChunksStore;
