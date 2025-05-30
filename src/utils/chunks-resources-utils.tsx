import { ResourceChunk } from '@/types';

// Function to retrieve all ResourceChunk objects from an array of ResourceChunkWithMessageId, doesnt include duplicate chunks IDS
export function retrieveUniqueChunksListFromResourceChunks(message_id_to_chunks: {
  [message_id: string]: ResourceChunk[];
}): ResourceChunk[] {
  if (!message_id_to_chunks) {
    return [];
  }
  // Use a Map to track unique chunks by their id
  const uniqueChunksMap = new Map<string, ResourceChunk>();

  // Iterate over each message_id and its associated chunks
  Object.values(message_id_to_chunks).forEach(chunks => {
    // Iterate over each chunk
    chunks.forEach(chunk => {
      // Add the chunk to the Map if it doesn't already exist
      if (!uniqueChunksMap.has(chunk.chunk_id)) {
        uniqueChunksMap.set(chunk.chunk_id, chunk);
      }
    });
  });

  // Convert the Map values to an array and return it
  return Array.from(uniqueChunksMap.values());
}
