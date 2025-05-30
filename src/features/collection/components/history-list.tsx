import React, { useState } from 'react';
import { useChatHistory } from '../hooks/use-chat-history';
import { Skeleton } from '@/components/elements/skeleton';
import { HStack, styled, VStack } from 'styled-system/jsx';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { Table } from '@/components/elements/table';
import { HistoryRow } from './history-row';
import { format } from 'date-fns';
import { Search } from '@/components/search';
import { FilterByType } from '@/features/files-pdf-chunks-sidebar/files-manager/components/files-list/component/filter-by-type';
import { ChatHistory } from '../history-api-types';
import { PenIcon } from './pen-icon';
import { Button } from '@/components/elements/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next13-progressbar';
import { useTranslation } from 'react-i18next';
export const HistoryList = () => {
  const { t } = useTranslation();

  const { data: history, isLoading: isChatHistoryLoading, isError, refetch } = useChatHistory();
  const classnamesArray = extractUniqueClass(history ?? []);
  const [search, setSearch] = useState<string>('');
  const [classfilter, setClassfilter] = useState<string>('Class');
  const router = useRouter();
  const onFilterByClassTypeChange = (classes: string[]) => {
    const [selectedClass] = classes;
    setClassfilter(selectedClass);
  };

  const filteredChats = filterChats(search, history, classfilter);
  const datetoday = format(new Date(), 'EEEE, MMMM d, yyyy');
  if (isError) {
    return <ErrorRetry error={t('collection.history.list.error')} retry={refetch} />;
  }

  const LoadingSkeleton = () => (
    <VStack w="100%" h={'100%'} gap={6}>
      <HStack w="100%">
        <Skeleton w="100%" h="40px"></Skeleton>
      </HStack>
      <Skeleton w="100%" h="100%" />
    </VStack>
  );
  const EmptyHistory = () => (
    <VStack w="100%" gap={6} h={'100%'} display="flex" flexDir="column" justifyContent="center" textAlign={'center'}>
      <PenIcon />
      <VStack gap={1}>
        <styled.span fontWeight={500} fontSize={'3xl'} color={'#15112b'}>
          {t('collection.history.list.empty.title')}
        </styled.span>
        <styled.span fontWeight={400} fontSize={'lg'} color={'rgba(21, 17, 43, 0.5)'}>
          {t('collection.history.list.empty.description')}
        </styled.span>
      </VStack>
      <Button variant={'solid'} size={'sm'} backgroundColor={'#15112b'}>
        <PlusIcon size={24} />
        <styled.span
          fontWeight={500}
          fontSize={'xs'}
          onClick={() => {
            router.push('/');
          }}>
          {t('common.newChat')}
        </styled.span>
      </Button>
    </VStack>
  );
  return (
    <>
      {isChatHistoryLoading ? (
        <LoadingSkeleton />
      ) : history?.length === 0 ? (
        <EmptyHistory />
      ) : (
        <VStack w="100%" h="100%" gap={6}>
          <HStack w="100%">
            <Search search={search} onSearchChange={setSearch} />
            <FilterByType
              placeholderValue={t('common.class', { count: 1 })}
              types={classnamesArray}
              onFilterChange={onFilterByClassTypeChange}
            />
          </HStack>
          <styled.div flex={1} overflow="hidden" w={'100%'}>
            <Table.Root bgColor="white" borderRadius={12} h="100%" display="flex" flexDirection="column">
              <Table.Head w="100%">
                <Table.Row
                  h={75}
                  borderTopRadius={12}
                  _hover={{ backgroundColor: 'white' }}
                  display="flex"
                  alignItems="end">
                  <Table.Header width="70%" pl={5} overflowX={'hidden'} whiteSpace="nowrap" textOverflow="ellipsis">
                    <styled.span fontWeight={500} color="fg.default" textStyle="lg" textWrap={'nowrap'}>
                      {t('common.today')} - {datetoday}
                    </styled.span>
                  </Table.Header>
                  <Table.Header width="35%" lineHeight="1.75rem">
                    {t('common.class', { count: 1 })}
                  </Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body flex={1} overflowY="auto">
                {filteredChats?.map((chatHistory, idx) => (
                  <HistoryRow key={chatHistory.chat_id} chatHistory={chatHistory} idx={idx} />
                ))}
              </Table.Body>
            </Table.Root>
          </styled.div>
        </VStack>
      )}
    </>
  );

  function filterChats(query: string, chats: ChatHistory[] | undefined, classfilter: string) {
    return (
      chats
        ?.filter(chat =>
          (chat.description.toLowerCase() + ' ' + chat.last_message.toLowerCase()).includes(query.toLowerCase()),
        )
        .filter(chat => {
          if (classfilter && classfilter !== 'Class') {
            return chat.class_name === classfilter;
          }
          return true;
        }) ?? []
    );
  }
  function extractUniqueClass(chatList: ChatHistory[]): string[] {
    const set: Set<string> = new Set();

    chatList.forEach(chatList => {
      if (chatList.class_name) {
        set.add(chatList.class_name);
      }
    });

    return Array.from(set);
  }
};
