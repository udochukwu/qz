import { DEFAULT_CLASS_EMOJI } from '@/features/chat/consts/class-name';
import { Emoji, emojis, emojiToLucideIconMap } from '@/lib/class-emojis';
import { LucideIcon } from 'lucide-react';

export function getClassNameAndIcon(className?: string): [LucideIcon, string] {
  const [extractEmoji, extractTitle] = getClassNameAndEmoji(className);
  return [emojiToLucideIconMap[extractEmoji as Emoji], extractTitle];
}

export function getClassNameAndEmoji(className?: string): [string, string] {
  if (!className || typeof className !== 'string') {
    return [DEFAULT_CLASS_EMOJI, ''];
  }

  const parts = className.trim().split(/\s+/);
  const emoji = parts[0];
  const title = parts.slice(1).join(' ');

  if (isEmoji(emoji)) {
    return [emoji, title];
  } else {
    return [DEFAULT_CLASS_EMOJI, className];
  }
}
function isEmoji(str: string): boolean {
  return (emojis as readonly string[]).includes(str);
}
