import { chunkRegex } from './chunk-regex';

export default function getMessageWithNoChunks(message: string): string {
  return message.replace(new RegExp(chunkRegex, 'g'), '');
}
