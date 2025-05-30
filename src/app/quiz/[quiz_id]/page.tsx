'use client';

import { styled } from 'styled-system/jsx';
import { useGetQuiz } from '@/features/quiz/hooks/use-get-quiz';
import { useStartQuizSession } from '@/features/quiz/hooks/use-start-quiz-session';
import { useGetQuizSessions } from '@/features/quiz/hooks/use-get-quiz-sessions';
import { useDeleteQuizQuestion } from '@/features/quiz/hooks/use-delete-quiz-question';
import { useParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Play, Shuffle, History, Trash } from 'lucide-react';
import { Modal } from '@/components/modal/modal';
import { Dialog } from '@/components/elements/dialog';
import { Select } from '@/components/elements/select';
import MessageRendererV2 from '@/features/chat/components/message-rendererengine';
import { useTranslation } from 'react-i18next';
import { Quiz } from '@/features/quiz/types/quiz';
import QuizQuestionCard from '@/features/quiz/components/quiz-question-card';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { useDeleteQuiz } from '@/features/quiz/hooks/use-delete-quiz';
import { queryClient } from '@/providers/Providers';
import { GET_RECENT_QUIZES_QUERY_KEY } from '@/features/quiz/hooks/use-get-recent-quizes';
import { UnlimitedBadge } from '@/components/elements/unlimited-badge';
import { motion } from 'framer-motion';
import { TIMER_KEY } from '@/features/quiz/hooks/use-quiz-timer';
const StyledMotionDiv = motion(styled.div);

export default function QuizPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const quizId = params.quiz_id as string;
  const { mutate: startQuizSession, isLoading: isStartingQuizSession } = useStartQuizSession();
  const { mutate: deleteQuizQuestion, isLoading: isDeletingQuizQuestion } = useDeleteQuizQuestion();
  const { data: quizFromServer, isLoading: isQuizLoading } = useGetQuiz(quizId);
  const [quiz, setQuiz] = useState<Quiz | null>();
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [isShuffleModalOpen, setIsShuffleModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const { data: quizSessions, isLoading: isQuizSessionsLoading } = useGetQuizSessions(quizId);
  const { mutate: deleteQuiz, isLoading: isDeletingQuiz } = useDeleteQuiz();
  const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);

  useEffect(() => {
    if (quizFromServer) {
      setQuiz(quizFromServer);
    }
  }, [quizFromServer]);

  useEffect(() => {
    if (quizId) {
      mixpanel.track(EventName.QuizOpened, {
        quiz_id: quizId,
      });
    }
  }, [quizId]);

  // Extract unique topics from quiz questions
  const quizTopics = quiz ? Array.from(new Set(Object.values(quiz.questions).map(question => question.topic))) : [];

  const handleDeleteQuiz = async () => {
    setIsDeleteQuizModalOpen(false);
    deleteQuiz(quizId);
    await router.push('/?tab=Quiz');
  };

  const handleDeleteQuestion = (questionId: string) => {
    setDeleteQuestionId(null);
    deleteQuizQuestion({ quiz_id: quizId, question_id: questionId });
    setQuiz(prev => {
      if (!prev) return null;
      const newQuiz = { ...prev } as Quiz;
      newQuiz.questions[questionId].active = false;
      return newQuiz;
    });
    mixpanel.track(EventName.QuizQuestionDeleted, {
      quiz_id: quizId,
      question_id: questionId,
      question_type: quiz?.questions[questionId].question_type,
    });
  };

  // Function to get sorted questions
  const getSortedQuestions = () => {
    if (!quiz) return [];
    return Object.values(quiz.questions).filter(question => question.active);
  };

  const handleQuizNavigation = () => {
    if (quiz?.is_unlimited) {
      if (latestQuizSession) {
        mixpanel.track(EventName.QuizSessionCreatedOrStarted, {
          quiz_id: quizId,
          quiz_session_id: latestQuizSession.quiz_session_id,
          infinite: true,
        });
        localStorage.removeItem(`${TIMER_KEY}${quizId}_${latestQuizSession.quiz_session_id}`);
        router.push(
          `/quiz/${quizId}/${latestQuizSession.quiz_session_id}/${Object.keys(latestQuizSession.progress).length + 1}`,
        );
      } else {
        startQuizSession({ query: { shuffle_questions: true }, quiz_id: quizId });
      }
    } else {
      setIsShuffleModalOpen(true);
    }
  };

  const toggleAnswer = (questionId: string) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleTakeQuiz = (shouldShuffle: boolean) => {
    setIsShuffleModalOpen(false);
    startQuizSession({ query: { shuffle_questions: shouldShuffle }, quiz_id: quizId });
    mixpanel.track(EventName.QuizSessionCreatedOrStarted, {
      quiz_id: quizId,
      shuffle_questions: shouldShuffle,
    });
  };

  if (!quiz || isQuizSessionsLoading) return;

  // Don't change this
  const latestQuizSession = quizSessions && quizSessions.length > 0 ? quizSessions[0] : null;

  return (
    <styled.div overflow="hidden" position="relative">
      <Modal isOpen={isShuffleModalOpen} onOpenChange={setIsShuffleModalOpen} width="400px">
        <styled.div mt={-4} p={6} display="flex" flexDirection="column" gap={3}>
          <styled.h2 fontSize="lg" fontWeight="semibold" m={0}>
            {t('quiz.question_order.title')}
          </styled.h2>
          <styled.p fontSize="md" color="gray.700" m={0}>
            {t('quiz.question_order.body')}
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
              onClick={() => handleTakeQuiz(false)}>
              {t('quiz.question_order.keep_order')}
            </styled.button>
            <styled.button
              flex={1}
              py={2}
              px={4}
              borderRadius="lg"
              bg="#6D56FA10"
              color="#6D56FA"
              fontWeight="medium"
              fontSize="sm"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              gap={2}
              _hover={{ bg: '#6D56FA20' }}
              onClick={() => handleTakeQuiz(true)}>
              <Shuffle size={16} />
              {t('quiz.question_order.shuffle')}
            </styled.button>
          </styled.div>
        </styled.div>
      </Modal>

      <Modal isOpen={deleteQuestionId !== null} onOpenChange={() => setDeleteQuestionId(null)} width="400px">
        <styled.div mt={-4} p={6} display="flex" flexDirection="column" gap={3}>
          <styled.h2 fontSize="lg" p={0} fontWeight="semibold" m={0}>
            {t('quiz.quiz_preview.delete_question.title')}
          </styled.h2>
          <styled.p fontSize="md" color="gray.700" m={0}>
            {t('quiz.quiz_preview.delete_question.description')}
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
              onClick={() => setDeleteQuestionId(null)}>
              {t('quiz.quiz_preview.delete_question.cancel')}
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
              onClick={() => deleteQuestionId && handleDeleteQuestion(deleteQuestionId)}>
              <Trash size={16} />
              {t('quiz.quiz_preview.delete_question.delete')}
            </styled.button>
          </styled.div>
        </styled.div>
      </Modal>

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

      <StyledMotionDiv position="absolute" bottom={12} left={0} w="full" display="flex" justifyContent="center">
        <styled.div
          position="absolute"
          top={0}
          left={0}
          inset={0}
          w="full"
          h="100px"
          background="linear-gradient(to top, #F8F8F8 70%, transparent 100%)"
          zIndex={300}
          pointerEvents="none"
          transition="opacity 0.2s ease-in-out"
        />
        <styled.div
          display="flex"
          p={1}
          backgroundColor="#FFFFFF80"
          backdropFilter="blur(3px)"
          shadow="sm"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          alignItems="center"
          justifyContent="center"
          gap={1}
          zIndex={301}
          transition="opacity 0.3s ease-in-out 0.15s, transform 0.3s ease-in-out 0.15s">
          {!quiz.is_unlimited && (
            <styled.button
              onClick={() => setIsShuffleModalOpen(true)}
              _hover={{ bg: '#6D56FA95' }}
              transition="background-color 0.1s ease-in-out"
              bg="#6D56FA"
              color="white"
              cursor="pointer"
              px={10}
              py={2}
              borderRadius="lg"
              fontSize={'sm'}
              fontWeight={'semibold'}
              display="flex"
              alignItems="center"
              gap={2}>
              <Play size={16} fill="white" strokeWidth={0} />
              {t('quiz.quiz_view.take_quiz')}
            </styled.button>
          )}
          {quiz.is_unlimited && (
            <styled.button
              onClick={handleQuizNavigation}
              _hover={{ bg: '#6D56FA95' }}
              transition="background-color 0.1s ease-in-out"
              bg="#6D56FA"
              color="white"
              cursor="pointer"
              px={10}
              py={2}
              borderRadius="lg"
              fontSize={'sm'}
              fontWeight={'semibold'}
              display="flex"
              alignItems="center"
              gap={2}>
              <Play size={16} fill="white" strokeWidth={0} />
              <styled.span>
                {latestQuizSession && Object.keys(latestQuizSession.progress).length > 0
                  ? t('quiz.quiz_view.resume_quiz')
                  : t('quiz.quiz_view.take_quiz')}
              </styled.span>
            </styled.button>
          )}
          {!quiz.is_unlimited && quizSessions && quizSessions?.length > 0 && (
            <Select.Root
              positioning={{ sameWidth: true }}
              width="11rem"
              items={Object.keys(quiz.questions).map((_, index) => String(index + 1))}
              onValueChange={({ value }) => {
                router.push(`/quiz/${quizId}/${value[0]}/1`);
              }}>
              <Select.Control>
                <Select.Trigger
                  bg="#00000010"
                  _hover={{ bg: '#00000020' }}
                  cursor="pointer"
                  py={2}
                  h="fit-content"
                  borderRadius="lg"
                  fontSize={'sm'}
                  fontWeight={'semibold'}
                  borderWidth={0}
                  display={quizSessions && quizSessions?.length > 0 ? 'flex' : 'none'}
                  alignItems="center"
                  justifyContent={'center'}
                  gap={2}>
                  <Select.ValueText
                    whiteSpace={'nowrap'}
                    display="flex"
                    alignItems="center"
                    borderWidth={0}
                    color="black"
                    gap={2}
                    placeholder={t('quiz.quiz_view.previous_attempts')}>
                    <History color="black" size={16} />
                    {t('quiz.quiz_view.previous_attempts')}
                  </Select.ValueText>
                </Select.Trigger>
              </Select.Control>
              <Select.Positioner>
                <Select.Content maxH="12rem" overflowY="scroll">
                  <Select.ItemGroup>
                    {quizSessions?.map((session, index) => {
                      return (
                        <Select.Item
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          fontWeight={'medium'}
                          justifyContent="space-between"
                          key={session.quiz_session_id}
                          item={session.quiz_session_id}>
                          <Select.ItemText fontSize={'sm'}>
                            {new Date(session.started_at_utc).toLocaleDateString()}
                          </Select.ItemText>
                          <Select.ItemText opacity={0.5} fontSize={'sm'} fontVariantNumeric="tabular">
                            Attempt {index + 1}
                          </Select.ItemText>
                        </Select.Item>
                      );
                    })}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          )}
        </styled.div>
      </StyledMotionDiv>
      <StyledMotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        backgroundColor="#F8F8F8"
        overflowY={'auto'}
        height="100vh"
        width="full"
        data-scroll-container>
        <styled.div w={'full'} mt={16} maxW={'4xl'} mx={'auto'} px={5} pb={10}>
          <styled.div
            position={'absolute'}
            display={'flex'}
            transition={'opacity 0.1s ease-in-out 0.15s, transform 0.1s ease-in-out 0.15s'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}
            top={0}
            left={0}
            zIndex={10}>
            <styled.div
              roundedBottomLeft={'xl'}
              roundedBottomRight={'xl'}
              fontSize="sm"
              color="#6D56FA"
              fontWeight="medium"
              bg="#EFEDF895"
              shadow="xs"
              w="fit-content"
              px={4}
              py={1}
              backdropFilter="blur(3px)"
              style={{ WebkitBackdropFilter: 'blur(3px)' }}>
              {t('quiz.quiz_view.review_quiz_questions')}
            </styled.div>
          </styled.div>
          <styled.div display={'flex'} flexDirection={'column'} gap={2}>
            <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <styled.span w="full" style={{ marginBottom: '0 !important' }} fontSize={'3xl'} fontWeight={'semibold'}>
                {quiz.title}
              </styled.span>
            </styled.div>
            <styled.div mt={0} display={'flex'} flexDirection={'column'} gap={2}>
              <styled.div display="flex" justifyContent="space-between" alignItems="center">
                <styled.h2 my={0} fontSize={'md'} fontWeight={'medium'}>
                  {t('quiz.quiz_preview.preview_of_your', 'Preview of your')}{' '}
                  {quiz.is_unlimited ? <UnlimitedBadge /> : getSortedQuestions().length}{' '}
                  {t('quiz.quiz_preview.question_quiz', 'question quiz')}
                </styled.h2>
                <styled.div display="flex" alignItems="center" gap={2}>
                  <Select.Root
                    positioning={{ sameWidth: false, placement: 'bottom-end' }}
                    width="fit-content"
                    items={['delete']}
                    onValueChange={({ value }) => {
                      if (value[0] === 'delete') {
                        setIsDeleteQuizModalOpen(true);
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
                        borderRadius="lg"
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
                    display="flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    fontWeight="medium"
                    color="#6D56FA"
                    bg="#6D56FA10"
                    borderRadius="lg"
                    borderWidth={0}
                    px={4}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: '#6D56FA20' }}
                    transition="background-color 0.2s ease-in-out"
                    onClick={handleQuizNavigation}>
                    <Play fill="#6D56FA" strokeWidth={0} size={16} />
                    <styled.span>
                      {quiz.is_unlimited
                        ? latestQuizSession && Object.keys(latestQuizSession.progress).length > 0
                          ? t('quiz.quiz_view.resume_quiz')
                          : t('quiz.quiz_view.take_quiz')
                        : t('quiz.quiz_view.take_quiz')}
                    </styled.span>
                  </styled.button>
                </styled.div>
              </styled.div>

              <styled.div mt={4} display={'flex'} flexDirection={'column'} gap={6}>
                {quiz.is_unlimited
                  ? getSortedQuestions()
                      .slice(0, 2)
                      .map((question, index) => {
                        let blur = 0;
                        if (index === 1) blur = 3;
                        return (
                          <styled.div position="relative" key={question.question_id}>
                            {index === 1 && (
                              <styled.div
                                p={10}
                                py={10}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                position="absolute"
                                width="100%"
                                height="100%"
                                mx="auto"
                                top={0}
                                left={0}
                                zIndex={10}>
                                <styled.div
                                  overflow="hidden"
                                  position="relative"
                                  bg="white"
                                  maxW="sm"
                                  display="flex"
                                  flexDirection="column"
                                  justifyContent="center"
                                  alignItems="center"
                                  gap={2}
                                  border="1px solid #00000010"
                                  width="100%"
                                  shadow="sm"
                                  height="100%"
                                  borderRadius="lg">
                                  <styled.h2 textAlign="center" fontSize="lg" fontWeight="medium">
                                    {t('quiz.quiz_preview.generating')}
                                  </styled.h2>
                                </styled.div>
                              </styled.div>
                            )}
                            <div style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
                              <QuizQuestionCard
                                question={question}
                                index={index}
                                isAnswerRevealed={revealedAnswers[question.question_id]}
                                onToggleAnswer={toggleAnswer}
                                onDeleteQuestion={setDeleteQuestionId}
                              />
                            </div>
                          </styled.div>
                        );
                      })
                  : getSortedQuestions().map((question, index) => (
                      <QuizQuestionCard
                        key={question.question_id}
                        question={question}
                        index={index}
                        isAnswerRevealed={revealedAnswers[question.question_id]}
                        onToggleAnswer={toggleAnswer}
                        onDeleteQuestion={setDeleteQuestionId}
                      />
                    ))}
              </styled.div>

              <styled.div mt={8} display="flex" justifyContent="center"></styled.div>
            </styled.div>
          </styled.div>
        </styled.div>
      </StyledMotionDiv>
    </styled.div>
  );
}
