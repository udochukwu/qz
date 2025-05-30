import { useRouter } from 'next13-progressbar';
import { MENU_TAB } from '../types';
import { HStack, styled } from 'styled-system/jsx';
import { FlashcardIcon } from './flashcard-icon';
import { ReactElement, useEffect } from 'react';
import { ChatIcon } from './chat-icon';
import { useViewTypeStore } from '@/stores/view-type-store';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

const tabs: { label: string; icon: (color: string) => ReactElement; key: MENU_TAB }[] = [
  {
    label: 'common.chats',
    icon: (color: string) => <ChatIcon color={color} />,
    key: MENU_TAB.CHATS,
  },
  {
    label: 'common.flashcards',
    icon: (color: string) => <FlashcardIcon color={color} />,
    key: MENU_TAB.FLASHCARDS,
  },
];

interface MenuTabProps {
  workspace: { workspace_id: string; class_name: string } | undefined;
}

export default function MenuTab({ workspace }: MenuTabProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const { switchView, currentView } = useViewTypeStore();
  const pathname = usePathname();

  useEffect(() => {
    const patharray = pathname.split('/');
    if (patharray.length === 3) {
      if (patharray[1] === 'flashcards') {
        switchView(MENU_TAB.FLASHCARDS);
      }
    }
  }, [pathname]);

  return (
    <HStack borderRadius="10px" p="6px" alignItems="center" bg="#F8F8F9" borderWidth={1} borderColor="#5F5F5F0F">
      {tabs.map(({ label, icon, key }) => {
        const isSelected = currentView === key;
        return (
          <HStack
            key={key}
            onClick={() => {
              if (workspace === undefined) {
                router.push('/');
              }
              switchView(key);
            }}
            cursor="pointer"
            justifyContent="center"
            alignItems="center"
            flex={1}
            p="8px"
            bg={isSelected ? 'white' : 'unset'}
            borderRadius="10px"
            borderColor="#E2E2E280"
            borderWidth={isSelected ? 1 : 0}>
            {icon(isSelected ? '#3E3C46' : '#868492')}
            <styled.p fontWeight="500" fontSize="14px" m="0" color={isSelected ? '#3E3C46' : '#868492'}>
              {t(label)}
            </styled.p>
          </HStack>
        );
      })}
    </HStack>
  );
}
