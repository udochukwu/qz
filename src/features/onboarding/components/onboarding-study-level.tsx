import { Button } from '@/components/elements/button';
import { useState } from 'react';
import { VStack, styled, Stack, HStack } from 'styled-system/jsx';
import { useSubmitOnboardingStep } from '../hooks/set-onboarding-v2-step';
import { HighschoolIcon } from './icons/highschool-icon';
import { UndergraduateIcon } from './icons/undergraduate-icon';
import { MastersIcon } from './icons/masters-icon';
import { OthersIcon } from './icons/others-icon';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';

interface Props {
  questionLength: number;
}

export const OnboardingStudyLevel = ({ questionLength }: Props) => {
  const { t } = useTranslation();

  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const { submitStep } = useSubmitOnboardingStep();
  const onConfirm = () => {
    mixpanel.track(EventName.OnboardingQuestionSubmitted, {
      question_index: '0',
      question: 'What level of study are you at?',
      answer: selectedLevel,
    });
    submitStep({ study_level: selectedLevel });
  };

  return (
    <VStack alignItems="flex-start" gap={8}>
      <VStack>
        <styled.span textTransform="uppercase" color="#6D56FA" textStyle="sm" fontWeight="medium">
          {t('newChatView.onboarding.study.step', { questionLength })}
        </styled.span>
        <styled.span color="neutral.800" textStyle="2xl" fontWeight="medium">
          {t('newChatView.onboarding.study.title')}
        </styled.span>
        <styled.p textStyle="md" textAlign="center" color="#15112BB2">
          {t('newChatView.onboarding.study.description')}
        </styled.p>
      </VStack>
      <Stack w="100%">
        {levels.map(level => (
          <StudyLevel
            key={level.id}
            {...level}
            setSelectedLevel={setSelectedLevel}
            active={level.id === selectedLevel}
          />
        ))}
      </Stack>
      <Button alignSelf="flex-end" visibility={!selectedLevel ? 'hidden' : 'visible'} onClick={onConfirm}>
        {t('common.confirm')}
      </Button>
    </VStack>
  );
};

interface StudyLevel {
  id: string;
  title: string;
  subtitle: string;
  image: (active: boolean) => JSX.Element;
}

const levels: StudyLevel[] = [
  {
    id: 'High School',
    title: 'High School',
    subtitle: 'High School',
    image: (active: boolean) => <HighschoolIcon fill={active ? '#6D56FA' : '#B2B2B2'} />,
  },
  {
    id: 'Undergraduate',
    title: 'Undergraduate',
    subtitle: 'Bachelor degree or Diploma',
    image: (active: boolean) => <UndergraduateIcon fill={active ? '#6D56FA' : '#B2B2B2'} />,
  },
  {
    id: 'Masters or MBA',
    title: 'Masters or MBA',
    subtitle: 'Studying Masters or MBA program',
    image: (active: boolean) => <MastersIcon fill={active ? '#6D56FA' : '#B2B2B2'} />,
  },
  {
    id: 'Other',
    title: 'Other',
    subtitle: "Can't find your fit",
    image: (active: boolean) => <OthersIcon fill={active ? '#6D56FA' : '#B2B2B2'} />,
  },
];

interface StudyLevelProps extends StudyLevel {
  setSelectedLevel: (id: string) => void;
  active: boolean;
}

const StudyLevel = (props: StudyLevelProps) => {
  return (
    <HStack
      w="100%"
      onClick={() => props.setSelectedLevel(props.id)}
      cursor="pointer"
      justifyContent="space-between"
      alignItems="center"
      border={props.active ? '1px solid #6D56FA' : '1px solid #e4e4e4'}
      _hover={{ bg: '#ECE9FF' }}
      borderRadius="md"
      boxShadow="0px 2px 12px 0px #EAEAEA40">
      <Stack gap={0}>
        <styled.div paddingLeft={4} color="neutral.800" textStyle="lg" fontWeight="medium">
          {props.title}
        </styled.div>
        <styled.div paddingLeft={4} color="#5b5b5b" textStyle="sm" fontWeight="medium">
          {props.subtitle}
        </styled.div>
      </Stack>
      <styled.div alignSelf="flex-end">{props.image(props.active)}</styled.div>
    </HStack>
  );
};
