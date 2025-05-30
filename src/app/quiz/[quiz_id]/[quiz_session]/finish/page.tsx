'use client';

import { styled } from 'styled-system/jsx';
import { useGetQuizSession } from '@/features/quiz/hooks/use-get-quiz-session';
import { useGetQuiz } from '@/features/quiz/hooks/use-get-quiz';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { useReward } from 'react-rewards';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { motion } from 'framer-motion';
import { useFiles } from '@/features/files-pdf-chunks-sidebar/hooks/files/use-files';
import QuizView from '@/features/quiz/components/quiz-view';
import {
  BookOpen,
  BookOpenCheck,
  BookOpenCheckIcon,
  BookXIcon,
  CheckIcon,
  PlayIcon,
  PlusIcon,
  Trash,
  Undo2Icon,
} from 'lucide-react';
import { Select } from '@/components/elements/select';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/modal/modal';
import { useDeleteQuiz } from '@/features/quiz/hooks/use-delete-quiz';
import { StarIcon } from '@/components/icons/StarIcon';
import { QuestionMarkIcon } from '@/components/icons/QuestionMarkIcon';
import { AchievementIcon } from '@/components/icons/AchievementIcon';
import Marquee from 'react-fast-marquee';
import { useQuizViewStore } from '@/features/quiz/stores/quiz-view-store';

interface QuizSessionQuestion {
  quiz_session_id: string;
  question_id: string;
  submitted_answer: string;
  is_correct: boolean;
  custom_ai_explanation: string | null;
  submitted_at_utc: number;
}

type QuizSession = {
  [key: string]: QuizSessionQuestion | null;
};

const keyframes = {
  slide: {
    '0%': { left: '-100%' },
    '100%': { left: '100%' },
  },
};

const RewardConfig = {
  '20': {
    type: 'emoji' as const,
    elementId: 'sadReward',
    config: {
      elementCount: 30,
      spread: 75,
      lifetime: 100,
      decay: 0.9,
      emoji: ['😢', '😔', '📚'], // Sad + study emoji
    },
  },
  '40': {
    type: 'emoji' as const,
    elementId: 'tryingReward',
    config: {
      elementCount: 30,
      spread: 75,
      lifetime: 100,
      decay: 0.9,
      emoji: ['💪', '📝', '🎯'], // Effort and progress emoji
    },
  },
  '60': {
    type: 'emoji' as const,
    elementId: 'goodReward',
    config: {
      elementCount: 30,
      spread: 75,
      lifetime: 100,
      decay: 0.9,
      emoji: ['👍', '⭐', '💡'], // Good job emoji
    },
  },
  '80': {
    type: 'emoji' as const,
    elementId: 'greatReward',
    config: {
      elementCount: 30,
      spread: 75,
      lifetime: 100,
      decay: 0.9,
      emoji: ['🎉', '🌟', '🏆'], // Achievement emoji
    },
  },
  '100': {
    type: 'emoji' as const,
    elementId: 'legendReward',
    config: {
      elementCount: 30,
      spread: 75,
      lifetime: 100,
      decay: 0.9,
      emoji: ['👑', '🎯', '🌈'], // Champion emoji
    },
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, filter: 'blur(5px)', y: 3 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5, type: 'spring', bounce: 0 } },
};

export default function FinishPage() {
  const router = useRouter();
  const params = useParams();
  const { open, setSelectedFiles } = useQuizViewStore();
  const { data: fileList } = useFiles();
  const { t } = useTranslation();
  const quizId = params.quiz_id as string;
  const quizSessionId = params.quiz_session as string;
  const [missedQuestions, setMissedQuestions] = useState<QuizSessionQuestion[]>([]);
  const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);
  const { mutate: deleteQuiz, isLoading: isDeletingQuiz } = useDeleteQuiz();
  const { data: quizSession, isLoading: isQuizSessionLoading } = useGetQuizSession(quizId, quizSessionId);
  const { data: quiz, isLoading: isQuizLoading } = useGetQuiz(quizId, quizSessionId);

  function openQuiz(variant?: 'quiz' | 'flashcards') {
    if (!variant) variant = 'quiz';
    if (!fileList) return;
    const filesInQuiz = fileList?.files.filter(file => quiz?.workspace_file_ids.includes(file.workspace_file_id));
    const missedTopics = Object.values(quiz?.questions || {})
      .filter(question => missedQuestions.some(q => q.question_id === question.question_id))
      .map(question => question.topic);

    open(variant, filesInQuiz as any, missedTopics, true);
  }

  const formatTimeSpent = (startTime: number) => {
    const timeSpentMs = new Date().getTime() - startTime;
    const hours = Math.floor(timeSpentMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeSpentMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const timeSpent = formatTimeSpent(
    parseInt(localStorage.getItem(`quiz_timer_start_${quizId}_${quizSessionId}`) || Date.now().toString()),
  );

  const [results, setResults] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    percentage: 0,
  });

  // Add reward hooks for each score range
  const { reward: reward20 } = useReward('sadReward', RewardConfig['20'].type, RewardConfig['20'].config);
  const { reward: reward40 } = useReward('tryingReward', RewardConfig['40'].type, RewardConfig['40'].config);
  const { reward: reward60 } = useReward('goodReward', RewardConfig['60'].type, RewardConfig['60'].config);
  const { reward: reward80 } = useReward('greatReward', RewardConfig['80'].type, RewardConfig['80'].config);
  const { reward: reward100 } = useReward('legendReward', RewardConfig['100'].type, RewardConfig['100'].config);

  const getScoreMessage = (percentage: number): string => {
    if (percentage <= 20) return t('quiz.finish.score_messages.very_low');
    if (percentage <= 40) return t('quiz.finish.score_messages.low');
    if (percentage <= 60) return t('quiz.finish.score_messages.medium');
    if (percentage <= 80) return t('quiz.finish.score_messages.high');
    return t('quiz.finish.score_messages.perfect');
  };

  useEffect(() => {
    if (quiz && quizSession && !isQuizLoading && !isQuizSessionLoading && fileList) {
      let totalQuestions = Object.keys(quiz.questions).length || 0;
      if (quiz.is_unlimited) totalQuestions -= 3; // Unlimited quizzes return +3 questions

      const filteredIncorrectQuestions = Object.values(quizSession)
        .filter(
          (answer): answer is QuizSessionQuestion =>
            answer !== null && typeof answer === 'object' && 'is_correct' in answer,
        )
        .filter(answer => answer.is_correct === false);

      setMissedQuestions(filteredIncorrectQuestions);

      // Filter out null values and count correct answers
      const correctAnswers = Object.values(quizSession)
        .filter(
          (answer): answer is QuizSessionQuestion =>
            answer !== null && typeof answer === 'object' && 'is_correct' in answer,
        )
        .filter(answer => answer.is_correct).length;

      // Log Questions that were answered incorrectly

      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      setResults({ totalQuestions, correctAnswers, percentage });

      mixpanel.track(EventName.QuizFinished, {
        quiz_id: quizId,
        quiz_session_id: quizSessionId,
        percentage_score: percentage,
      });
      // Trigger the appropriate reward based on percentage
      setTimeout(() => {
        if (percentage <= 20) reward20();
        else if (percentage <= 40) reward40();
        else if (percentage <= 60) reward60();
        else if (percentage <= 80) reward80();
        else reward100();
      }, 500);
    }
  }, [quiz, quizSession, isQuizLoading, isQuizSessionLoading, fileList]);

  const handleDeleteQuiz = async () => {
    setIsDeleteQuizModalOpen(false);
    deleteQuiz(quizId);
    await router.push('/?tab=Quiz');
  };

  if (isQuizLoading || isQuizSessionLoading) {
    return <styled.div height="100vh" display="flex" alignItems="center" justifyContent="center"></styled.div>;
  }

  return (
    <styled.div height="100vh" overflow={'auto'} pb={10} position={'relative'} width="full" backgroundColor="#F8F8F8">
      <QuizView hideTrigger />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'flex',
          marginTop: '1.5rem',
          gap: '1.5rem',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          maxWidth: '64rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <motion.div style={{ width: '100%' }}>
          <styled.div
            w={'full'}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <styled.div w={'full'} fontWeight={'semibold'} fontSize={'2xl'}>
              {quiz?.title}
            </styled.div>
            <styled.div display={'flex'} justifyContent={'end'} gap={2} w={'full'} alignItems={'center'}>
              <Select.Root
                positioning={{ sameWidth: false, placement: 'bottom-end' }}
                width="fit-content"
                items={['back', 'delete']}
                onValueChange={({ value }) => {
                  if (value[0] === 'delete') {
                    setIsDeleteQuizModalOpen(true);
                  } else if (value[0] === 'back') {
                    router.push(`/quiz/${quizId}`);
                  }
                }}>
                <Select.Control>
                  <Select.Trigger
                    bg="rgba(0, 0, 0, 0.05)"
                    h="full"
                    color="black"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="xl"
                    transition="background-color 0.2s ease-in-out"
                    borderWidth={0}
                    _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
                    px={2}
                    py={'10.2px'}>
                    <Select.ValueText>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Select.ValueText>
                  </Select.Trigger>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content maxH="12rem" overflowY="scroll">
                    <Select.ItemGroup>
                      <Select.Item
                        item={'back'}
                        display="flex"
                        alignItems="center"
                        fontWeight={'medium'}
                        fontSize={'sm'}
                        px={4}
                        cursor="pointer"
                        transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out">
                        <Select.ItemText display="flex" alignItems="center" gap={2}>
                          <Undo2Icon size={16} />
                          {t('quiz.finish.actions.back_to_quiz')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        item={'delete'}
                        display="flex"
                        alignItems="center"
                        fontWeight={'medium'}
                        fontSize={'sm'}
                        px={4}
                        cursor="pointer"
                        transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                        _hover={{ bg: 'rgba(0, 0, 0, 0.05)', color: 'red' }}>
                        <Select.ItemText display="flex" alignItems="center" gap={2}>
                          <Trash size={16} />
                          {t('quiz.quiz_preview.delete_quiz.title')}
                        </Select.ItemText>
                      </Select.Item>
                    </Select.ItemGroup>
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
              <styled.button
                display={'flex'}
                cursor={'pointer'}
                alignItems={'center'}
                gap={2}
                fontWeight={'medium'}
                fontSize={'sm'}
                color={'white'}
                bg={'rgba(109, 86, 250, 1)'}
                rounded={'xl'}
                transition={'all 0.2s ease-in-out'}
                _hover={{ opacity: 0.9 }}
                _active={{ scale: 0.99 }}
                onClick={() => {
                  mixpanel.track(EventName.QuizModalOpened, {
                    path: window.location.pathname,
                    source: 'quiz_finish',
                  });
                  openQuiz();
                }}
                px={4}
                py={2}
                position="relative"
                overflow="hidden">
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(65deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 6,
                    repeatDelay: 6,
                    type: 'spring',
                    bounce: 0,
                  }}
                />
                <styled.div position="relative" zIndex={1} display="flex" alignItems="center" gap={2}>
                  <PlayIcon fill={'white'} size={15} />
                  {t('quiz.finish.actions.new_quiz')}
                </styled.div>
              </styled.button>
            </styled.div>
          </styled.div>
        </motion.div>

        <motion.div style={{ width: '100%' }} variants={item}>
          <motion.div
            style={{ width: '100%', borderRadius: '16px' }}
            initial={{ background: 'radial-gradient(circle, white 100%, #6D56FA 200%)' }}
            animate={{
              background: 'radial-gradient(circle, white 70%, #6D56FA 200%)',
              transition: { delay: 0, duration: 3, ease: 'easeInOut' },
            }}>
            <styled.div
              w={'full'}
              maxW={'5xl'}
              mx={'auto'}
              shadow={'sm'}
              borderColor={'rgba(109, 86, 250, 0.2)'}
              borderWidth={'1px'}
              borderRadius={'2xl'}>
              <styled.div
                mx={'auto'}
                maxWidth={'lg'}
                w={'full'}
                p={10}
                gap={1.5}
                textAlign={'center'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}>
                <StarIcon />
                <styled.div pb={0} opacity={0.6} fontSize={'2xl'} fontWeight={'medium'}>
                  {getScoreMessage(results.percentage)}
                </styled.div>
                <styled.div fontWeight={'bold'} fontSize="5xl">
                  {results.percentage}%
                </styled.div>
                <styled.div w={'full'} display={'flex'} flexDirection={'row'} gap={1}>
                  <styled.div
                    rounded={'full'}
                    backgroundColor="#00B389"
                    style={{ width: `${results.percentage}%` }}
                    height={'10px'}
                  />
                  <styled.div
                    rounded={'full'}
                    backgroundColor="#FF6258"
                    style={{ width: `${100 - results.percentage}%` }}
                    height={'10px'}
                  />
                </styled.div>
                <styled.div
                  fontSize={'xs'}
                  fontWeight={'medium'}
                  display={'flex'}
                  flexDirection={'row'}
                  opacity={0.7}
                  w={'full'}
                  justifyContent={'space-between'}>
                  <styled.div>
                    {results.correctAnswers} {t('quiz.finish.stats.correct')}
                  </styled.div>
                  <styled.div>
                    {missedQuestions.length} {t('quiz.finish.stats.incorrect')}
                  </styled.div>
                </styled.div>
                <styled.div mt={4}>
                  <styled.div fontWeight="semibold" opacity={0.7} mb={2} textAlign={'center'}>
                    {t('quiz.finish.stats.missed_topics')}
                  </styled.div>
                  <styled.div
                    w="full"
                    flexDirection={'row'}
                    gap={2}
                    flexWrap={'wrap'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}>
                    {missedQuestions.slice(0, 6).map(question => (
                      <styled.div
                        key={question.question_id}
                        rounded={'full'}
                        fontSize={'xs'}
                        w={'fit-content'}
                        fontWeight={'medium'}
                        color="rgba(255, 13, 13, 1)"
                        borderColor="rgba(255, 13, 13, 0.16)"
                        borderWidth={'1px'}
                        backgroundColor="rgba(255, 13, 13, 0.08)"
                        px={2}
                        py={1}>
                        {quiz?.questions[question.question_id]?.topic}
                      </styled.div>
                    ))}
                    {missedQuestions.length > 6 && (
                      <styled.div fontSize={'sm'} fontWeight={'medium'} color="rgba(255, 13, 13, 1)">
                        {t('quiz.finish.stats.more_topics', { count: missedQuestions.length - 6 })}
                      </styled.div>
                    )}
                  </styled.div>
                </styled.div>
              </styled.div>
            </styled.div>
          </motion.div>
        </motion.div>

        <motion.div variants={item} style={{ width: '100%' }}>
          <styled.div
            mb={-6}
            w={'full'}
            display={'flex'}
            gap={4}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'start'}>
            <styled.div whiteSpace={'nowrap'} fontWeight="medium">
              {t('quiz.finish.title')}
            </styled.div>
            <styled.hr rounded={'full'} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)' }} />
          </styled.div>
        </motion.div>

        <motion.div variants={item} style={{ width: '100%' }}>
          <styled.div
            display={'grid'}
            alignItems={'end'}
            gridTemplateColumns={'repeat(2, 1fr)'}
            gap={2}
            w={'full'}
            maxW={'5xl'}
            mx={'auto'}>
            <styled.div>
              <styled.div
                px={3}
                textAlign={'center'}
                pt={1.5}
                pb={5}
                transform={'translateY(15px)'}
                color={'rgba(255, 13, 13, 1)'}
                roundedTopLeft={'2xl'}
                fontSize={'xs'}
                fontWeight={'medium'}
                roundedTopRight={'2xl'}
                shadow={'sm'}
                borderWidth={'1px'}
                borderColor={'rgba(255, 13, 13, 0.3)'}
                w={'full'}
                backgroundColor={'rgba(255, 13, 13, 0.2)'}
                position={'relative'}
                zIndex={1}>
                {t('quiz.finish.actions.review_message', { count: missedQuestions.length })}
              </styled.div>
              <styled.div
                shadow={'sm'}
                borderWidth={'1px'}
                borderColor={'rgba(0, 0, 0, 0.1)'}
                backgroundColor={'#6D56FA'}
                rounded={'2xl'}
                color={'white'}
                overflow={'hidden'}
                p={6}
                position={'relative'}
                zIndex={2}>
                <styled.div maxW={'500px'} display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
                  {missedQuestions.length > 0 && (
                    <Marquee speed={25} autoFill gradient gradientColor={'#6D56FA'} gradientWidth={100}>
                      {missedQuestions.map(question => {
                        return (
                          <styled.div
                            rounded={'full'}
                            backgroundColor="rgba(255, 255, 255, 0.1)"
                            borderColor="rgba(255, 255, 255, 0.4)"
                            borderWidth={'1px'}
                            shadow={'sm'}
                            px={2}
                            py={1}
                            ml={2}
                            mb={3}
                            key={question.question_id}
                            fontSize={'xs'}
                            fontWeight={'medium'}>
                            {quiz?.questions[question.question_id]?.topic}
                          </styled.div>
                        );
                      })}
                    </Marquee>
                  )}
                </styled.div>
                <styled.div></styled.div>
                <styled.div display="grid" mt={0} mb={1} gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                  <styled.div lineHeight={'1.2'} fontSize="2xl" fontWeight="semibold">
                    {t('quiz.finish.actions.create_quiz')}
                  </styled.div>
                  <styled.div display={'flex'} alignItems={'center'} justifyContent={'end'}>
                    <QuestionMarkIcon />
                  </styled.div>
                </styled.div>
                <styled.button
                  mt={4}
                  color="black"
                  rounded="xl"
                  py={2}
                  cursor={'pointer'}
                  fontSize="sm"
                  fontWeight="medium"
                  backgroundColor="white"
                  transition={'all 0.2s ease-in-out'}
                  _hover={{ opacity: 0.9 }}
                  _active={{ scale: 0.99 }}
                  onClick={() => {
                    mixpanel.track(EventName.QuizModalOpened, {
                      path: window.location.pathname,
                      source: 'quiz_finish',
                    });
                    openQuiz();
                  }}
                  w="full">
                  {t('quiz.finish.actions.start_quiz', { count: missedQuestions.length })}
                </styled.button>
              </styled.div>
            </styled.div>
            <styled.div
              h={'calc(100% - 15px)'}
              borderWidth={'1px'}
              borderColor={'rgba(0, 0, 0, 0.1)'}
              backgroundColor={'white'}
              rounded={'2xl'}
              color={'rgba(0, 0, 0, 0.8)'}
              overflow={'hidden'}
              p={6}
              position={'relative'}
              zIndex={2}>
              <styled.div display="grid" h={'full'} gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                <styled.div display={'flex'} flexDirection={'column'} h={'full'} justifyContent={'space-between'}>
                  <styled.div display={'flex'} flexDirection={'column'} gap={2}>
                    <styled.div color={'#6D56FA'}>{t('quiz.finish.actions.flashcards')}</styled.div>
                    <styled.div lineHeight={'1.2'} fontSize="2xl" fontWeight="semibold">
                      {t('quiz.finish.actions.keep_practicing')}{' '}
                      <styled.span color={'#6D56FA'}>
                        {quiz?.questions[missedQuestions[0]?.question_id]?.topic}
                      </styled.span>
                      <styled.span
                        display={'inline-flex'}
                        alignItems={'center'}
                        fontSize={'xs'}
                        justifyContent={'center'}
                        aspectRatio={1}
                        bg={'rgba(109, 86, 250, 0.1)'}
                        color={'rgba(109, 86, 250, 1)'}
                        borderWidth={'1px'}
                        borderColor={'rgba(109, 86, 250, 0.3)'}
                        rounded={'full'}
                        height={7}
                        ml={1}
                        transform={'translateY(-4px)'}
                        width={7}>
                        <styled.span transform={'translateX(-1px)'}>+{missedQuestions.length}</styled.span>
                      </styled.span>
                    </styled.div>
                    <styled.div position={'absolute'} bottom={-4} right={4}>
                      <AchievementIcon />
                    </styled.div>
                  </styled.div>
                  <styled.button
                    rounded="xl"
                    py={2}
                    px={4}
                    fontSize="sm"
                    fontWeight="medium"
                    w={'fit-content'}
                    bg={'rgba(109, 86, 250, 0.1)'}
                    color={'rgba(109, 86, 250, 1)'}
                    whiteSpace={'nowrap'}
                    transition={'all 0.2s ease-in-out'}
                    cursor={'pointer'}
                    _hover={{ opacity: 0.9 }}
                    _active={{ scale: 0.99 }}
                    onClick={() => {
                      mixpanel.track(EventName.FlashcardStarted, {
                        path: window.location.pathname,
                        source: 'quiz_finish',
                      });
                      openQuiz('flashcards');
                    }}>
                    {t('quiz.finish.actions.create_flashcards')}
                  </styled.button>
                </styled.div>
              </styled.div>
            </styled.div>
          </styled.div>
        </motion.div>
      </motion.div>
      <Modal isOpen={isDeleteQuizModalOpen} onOpenChange={setIsDeleteQuizModalOpen} width="400px">
        <styled.div mt={-4} p={6} display="flex" flexDirection="column" gap={3}>
          <styled.h2 fontSize="lg" fontWeight="semibold" m={0}>
            {t('quiz.quiz_preview.delete_quiz.title')}
          </styled.h2>
          <styled.p fontSize="md" color="gray.700" m={0}>
            {t('quiz.quiz_preview.delete_quiz.description')}
          </styled.p>
          <styled.div display="flex" gap={3}>
            <styled.button
              flex={1}
              py={2}
              px={4}
              borderRadius="lg"
              borderWidth={1}
              borderColor="rgba(0, 0, 0, 0.2)"
              shadow="sm"
              color="black"
              fontWeight="medium"
              fontSize="sm"
              cursor="pointer"
              _hover={{ bg: '#00000005' }}
              onClick={() => setIsDeleteQuizModalOpen(false)}>
              {t('quiz.quiz_preview.delete_quiz.cancel')}
            </styled.button>
            <styled.button
              flex={1}
              py={2}
              px={4}
              borderRadius="lg"
              bg="#EF4444"
              color="white"
              fontWeight="medium"
              fontSize="sm"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              gap={2}
              _hover={{ bg: '#DC2626' }}
              onClick={handleDeleteQuiz}>
              <Trash size={16} />
              {t('quiz.quiz_preview.delete_quiz.confirm')}
            </styled.button>
          </styled.div>
        </styled.div>
      </Modal>
    </styled.div>
  );
}
