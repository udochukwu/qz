import { HStack, styled } from 'styled-system/jsx';
import { QuestData } from '../types/quest-types';
import { CheckIcon, CircleIcon } from 'lucide-react';
import Link from 'next/link';
import { css } from 'styled-system/css';

interface Props {
  questKey: keyof QuestData;
  questCompleted: boolean;
}
const mapQuestKeyToTitle: Record<keyof QuestData, string> = {
  finish_on_boarding: 'Finish on boarding',
  upload_file: 'Upload first file',
  ask_a_question: 'Ask a question',
  create_class: 'Create your class',
  explainer_video: 'Watch explainer video',
};

const questNavigationMap: Record<keyof QuestData, string> = {
  finish_on_boarding: '/',
  ask_a_question: '/',
  upload_file: '/files',
  create_class: '/classes',
  explainer_video: '/',
};

export default function QuestItem({ questKey, questCompleted }: Props) {
  const questTitle = mapQuestKeyToTitle[questKey];
  const navigationPath = questNavigationMap[questKey];

  return (
    <Link
      href={navigationPath}
      className={css({
        textDecoration: 'none',
        width: '100%',
      })}
      aria-label={`Go to ${questTitle} page`}>
      <HStack
        alignSelf={'flex-start'}
        fontSize={'xs'}
        color={questCompleted ? '#6D56FA' : 'rgba(21, 17, 43, 0.5)'}
        gap={1}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        width="100%">
        {questCompleted ? <CheckIcon color="#6D56FA" size={12} /> : <CircleIcon size={12} />}
        <styled.span textDecoration={questCompleted ? 'line-through' : 'none'}>{questTitle}</styled.span>
      </HStack>
    </Link>
  );
}
