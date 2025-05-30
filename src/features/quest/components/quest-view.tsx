import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { StarIcon } from './star-icon';
import { useEffect, useState } from 'react';
import { Box, HStack, styled, VStack } from 'styled-system/jsx';
import * as Progress from '@/components/elements/styled/progress';
import { useGetQuest } from '../hooks/use-get-quest';
import { QuestData } from '../types/quest-types';
import QuestItem from './quest-item';
import { useTranslation } from 'react-i18next';

export default function QuestView() {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(true);
  const { data, isLoading } = useGetQuest();
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (data) {
      const questData = data.quest_data;
      // Filter out explainer_video from the quest data
      const filteredQuestData = Object.entries(questData).reduce<Record<keyof QuestData, boolean>>(
        (acc, [key, value]) => {
          if (key !== 'explainer_video') {
            acc[key as keyof QuestData] = value;
          }
          return acc;
        },
        {} as Record<keyof QuestData, boolean>,
      );

      const totalQuests = Object.keys(filteredQuestData).length;
      const completedQuests = Object.values(filteredQuestData).filter(Boolean).length;
      const percentage = parseFloat(((completedQuests / totalQuests) * 100).toFixed(2));
      setPercentage(percentage);
    }
  }, [data]);

  if (data === undefined || data.quest_completed) return null;

  return (
    <>
      <VStack mt={3} rounded={'md'} pb={3.5} bg={'#6D56FA'} px={4}>
        <HStack justifyContent={'space-between'} pt={3.5}>
          <HStack gap={1}>
            <StarIcon />
            <styled.span fontSize={'14px'} color={'white'} fontWeight={'semibold'}>
              {t('class.menu.sidebar.quest.title')}
            </styled.span>
          </HStack>
          <styled.button _hover={{ cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDownIcon size={14} color="white" /> : <ChevronUpIcon size={14} color="white" />}
          </styled.button>
        </HStack>
        <Progress.Root value={percentage}>
          <Progress.Track bgColor="rgba(255,255,255,0.12)" h={'0.3rem'}>
            <Progress.Range bgColor="#FFFFFF !important" />
          </Progress.Track>
        </Progress.Root>
        <styled.span alignSelf={'flex-start'} color={'white'} fontSize={'xs'} fontWeight={'light'}>
          {percentage}% {t('common.done').toLocaleLowerCase()}{' '}
        </styled.span>
      </VStack>
      {isExpanded && (
        <VStack
          bgColor={'#FFFFFF'}
          boxShadow={'0px 2px 12px 0px rgba(226, 226, 226, 0.25),0px 0px 0px 5px rgba(109, 86, 250, 0.03);'}
          rounded={'md'}
          mt={-2}
          px={4}
          py={4}
          border={'1px solid #e9e6fe'}>
          {data?.quest_data &&
            Object.entries(data.quest_data)
              .filter(([key]) => key !== 'explainer_video') // Filter out explainer_video
              .map(([key, value], index) => {
                return <QuestItem key={index} questKey={key as keyof QuestData} questCompleted={value} />;
              })}
        </VStack>
      )}
    </>
  );
}
