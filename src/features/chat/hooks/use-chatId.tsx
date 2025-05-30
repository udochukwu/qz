import { usePathname } from 'next/navigation';

export default function useGetChatId() {
  const pathname = usePathname();
  const chatId = pathname.split('/')[2];

  return chatId;
}
