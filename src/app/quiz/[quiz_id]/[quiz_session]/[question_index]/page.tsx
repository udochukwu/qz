'use client';

import { useGetQuizSession } from '@/features/quiz/hooks/use-get-quiz-session';
import { useGetQuiz } from '@/features/quiz/hooks/use-get-quiz';
import { QuestionType, QuizSession, QuizSessionQuestion } from '@/features/quiz/types/quiz';
import { X, ChevronDown, Check, X as XIcon, Circle, Infinity } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { styled } from 'styled-system/jsx';
import MultipleChoiceQuestion from '@/features/quiz/components/question-types/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/features/quiz/components/question-types/TrueFalseQuestion';
import ShortAnswerQuestion from '@/features/quiz/components/question-types/ShortAnswerQuestion';
import FillInBlankQuestion from '@/features/quiz/components/question-types/FillInBlankQuestion';
import { motion } from 'framer-motion';
import { QuizProgressBar } from '@/features/quiz/components/quiz-progress-bar';
import { Select } from '@/components/elements/select';
import { useState, useEffect } from 'react';
import { useQuestionSubmission } from '@/features/quiz/hooks/use-question-submission';
import useChunksStore from '@/features/chat/stores/chunks-strore';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/modal/modal';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
import { QuizSessionHeader } from '@/features/quiz/components/quiz-session-header';
import { QuizQuestion } from '@/features/quiz/components/quiz-question';
import { QuizFooter } from '@/features/quiz/components/quiz-footer';

export default function TakeQuizPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const quizId = params.quiz_id as string;
  const quizSessionId = params.quiz_session as string;
  const questionIndex = parseInt(params.question_index as string) - 1;
  const [textInput, setTextInput] = useState('');
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState(false);
  const { data: quizSession, isLoading, isError, refetch } = useGetQuizSession(quizId, quizSessionId);
  const { data: quiz, isLoading: isQuizLoading, refetch: refetchQuiz } = useGetQuiz(quizId, quizSessionId);
  const { mutate: submitQuestion, isLoading: isSubmitting } = useQuestionSubmission();
  const question = quizSession && quiz?.questions[Object.keys(quizSession)[questionIndex]];
  const [retryCount, setRetryCount] = useState(0);

  const currentQuestionId = quizSession ? Object.keys(quizSession)[questionIndex] : null;
  const correctIncorrectIdleColor =
    currentQuestionId && quizSession && quizSession[currentQuestionId]?.submitted_answer
      ? quizSession[currentQuestionId]?.is_correct
        ? '#36AF6F'
        : '#FD2D3F'
      : '#6D56FA';

  const incorrectRatio = quizSession
    ? Object.values(quizSession).filter(q => q?.is_correct === false && !q?.skipped).length /
      Object.values(quizSession).filter(q => q?.submitted_answer !== undefined && !q?.skipped).length
    : 0;

  const handleSubmitAnswer = async (answer: string | string[], skip_question?: boolean) => {
    if (!currentQuestionId || !quiz || !quizSession) return;

    submitQuestion(
      {
        submitted_answer: answer as string,
        quiz_session_id: quizSessionId,
        question_index: questionIndex,
        skip_question: skip_question,
      },
      {
        onSuccess: async data => {
          // Refetch to get the updated session state
          await refetch();

          mixpanel.track(EventName.QuizQuestionSubmitted, {
            quiz_id: quizId,
            question_id: currentQuestionId,
            question_type: quiz?.questions[currentQuestionId].question_type,
            is_correct: data.is_correct,
            quiz_mode: quiz?.is_unlimited ? 'grind' : 'test',
          });

          if (skip_question) {
            const questionIds = Object.keys(quizSession);
            const isLastQuestion = questionIndex === questionIds.length - 1;
            if (isLastQuestion) {
              checkForUnlimitedQuestions();
            } else {
              router.push(`/quiz/${quizId}/${quizSessionId}/${questionIndex + 2}`);
            }
          } else {
            // Scroll to the explanation element with a small delay to ensure rendering
            setTimeout(() => {
              const explanationElement = document.querySelector('[data-explanation]');
              if (explanationElement) {
                // Get the parent scrollable container
                const scrollContainer = document.querySelector('[data-scroll-container]');
                if (scrollContainer) {
                  const containerRect = scrollContainer.getBoundingClientRect();
                  const elementRect = explanationElement.getBoundingClientRect();
                  const scrollTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
                  scrollContainer.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth',
                  });
                } else {
                  explanationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }, 100);
          }
        },
      },
    );
  };

  // Add function to find earliest unanswered question
  const findEarliestUnansweredQuestion = () => {
    if (!quizSession || !quiz) return -1;
    const questionIds = Object.keys(quizSession);
    for (let i = 0; i < questionIds.length; i++) {
      const questionId = questionIds[i];
      if (!quizSession[questionId]?.submitted_answer) {
        return i;
      }
    }
    return -1; // All questions answered
  };

  // Add function to check if all questions are answered
  const areAllQuestionsAnswered = () => {
    if (!quizSession) return false;
    return Object.keys(quizSession).every(questionId => quizSession[questionId]?.submitted_answer);
  };

  const checkForUnlimitedQuestions = async () => {
    setIsLoadingMoreQuestions(true);
    let intervalId: NodeJS.Timeout;
    let isChecking = false;

    const checkForNewQuestions = async () => {
      if (isChecking) return false;
      isChecking = true;
      try {
        const result = await refetch();
        const updatedSession = result.data;

        if (updatedSession && Object.keys(updatedSession).length > questionIndex + 1) {
          clearInterval(intervalId);
          setIsLoadingMoreQuestions(false);
          const nextQuestionIndex = questionIndex + 2;
          router.push(`/quiz/${quizId}/${quizSessionId}/${nextQuestionIndex}`);
          return true;
        }
        return false;
      } finally {
        isChecking = false;
      }
    };

    intervalId = setInterval(async () => {
      const foundNewQuestions = await checkForNewQuestions();
      if (foundNewQuestions) {
        clearInterval(intervalId);
      }
    }, 2000);
    // Initial check
    await checkForNewQuestions();
  };

  const handleNextButtonClick = () => {
    if (isSubmitting) return;
    if (!currentQuestionId || !quiz || !quizSession) return;

    if (areAllQuestionsAnswered() && !quiz.is_unlimited) {
      router.push(`/quiz/${quizId}/${quizSessionId}/finish`);
      return;
    }

    const questionIds = Object.keys(quizSession);
    const isLastQuestion = questionIndex === questionIds.length - 1;
    const hasAnsweredCurrent = quizSession[currentQuestionId]?.submitted_answer;
    const isTextQuestion =
      question?.question_type === QuestionType.SHORT_ANSWER || question?.question_type === QuestionType.FILL_IN_BLANK;

    // For text questions with input, first submit
    if (isTextQuestion && textInput.length > 0 && !hasAnsweredCurrent) {
      handleSubmitAnswer(textInput);
      return;
    } else if (!quizSession[currentQuestionId]) {
      return;
    }

    // For all other cases, handle navigation
    if (isLastQuestion) {
      // On last question, go to earliest unanswered
      // If all questions are answered, go to finish screen
      if (quiz.is_unlimited) {
        checkForUnlimitedQuestions();
      } else {
        const earliestUnanswered = findEarliestUnansweredQuestion();
        router.push(`/quiz/${quizId}/${quizSessionId}/${earliestUnanswered + 1}`);
      }
    } else {
      // Go to next question
      const nextIndex = questionIndex + 1;
      if (nextIndex < questionIds.length) {
        router.push(`/quiz/${quizId}/${quizSessionId}/${nextIndex + 1}`);
      }
    }
  };

  useEffect(() => {
    if (isQuizLoading) return;
    if (quizSession && quiz) {
      if (!question && retryCount < 10) {
        // Set up polling interval to check for new questions
        const intervalId = setInterval(() => {
          setRetryCount(prev => prev + 1);
          refetchQuiz();
        }, 2000);

        // Cleanup interval when component unmounts or question becomes available
        return () => clearInterval(intervalId);
      }
    }
  }, [quizSession, quiz, question, refetchQuiz, retryCount]);

  return (
    <styled.div
      display="flex"
      flexDirection="column"
      justifyContent={'space-between'}
      position={'relative'}
      width="full"
      height="100vh"
      backgroundColor="#F8F8F8">
      {quiz && quizSession && currentQuestionId && quizSession[currentQuestionId] && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.7,
            type: 'easeInOut',
          }}
          style={{
            filter: 'blur(15px)',
            position: 'absolute',
            top: 0,
            borderWidth: '20px',
            borderRadius: '10px',
            left: 0,
            width: '100%',
            height: '100vh',
            borderColor: correctIncorrectIdleColor,
            pointerEvents: 'none',
            zIndex: 1000,
          }}></motion.div>
      )}

      {quizSession && quiz && (
        <>
          <Modal isOpen={isQuitModalOpen} onOpenChange={setIsQuitModalOpen} width="400px">
            <styled.div mt={-4} p={6} display="flex" flexDirection="column" gap={3}>
              <styled.h2 fontSize="lg" fontWeight="semibold" m={0}>
                {t('quiz.modal.quit_confirmation_title')}
              </styled.h2>
              <styled.p fontSize="md" color="gray.700" m={0}>
                {t('quiz.modal.quit_confirmation_body')}
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
                  onClick={() => setIsQuitModalOpen(false)}>
                  {t('quiz.modal.stay')}
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
                  onClick={() => router.push(`/quiz/${quizId}`)}>
                  <X size={16} />
                  {t('quiz.modal.quit')}
                </styled.button>
              </styled.div>
            </styled.div>
          </Modal>
          <styled.div display="flex" flexDirection="column" height="100%" maxW={'4xl'} mx={'auto'} w={'full'}>
            {/* Scrollable content area */}
            <styled.div flex="1" overflowY="auto" px={5} data-scroll-container>
              <QuizSessionHeader
                quizTitle={quiz?.title ?? ''}
                isUnlimited={quiz?.is_unlimited ?? false}
                onQuit={() => {
                  if (quiz?.is_unlimited) {
                    router.push(`/quiz/${quizId}/${quizSessionId}/finish`);
                  } else {
                    setIsQuitModalOpen(true);
                  }
                }}
              />
              <QuizQuestion
                question={question}
                questionSessionEntry={currentQuestionId ? quizSession?.[currentQuestionId] : undefined}
                questionNumber={questionIndex + 1}
                isSubmitting={isSubmitting}
                textInput={textInput}
                setTextInput={setTextInput}
                onSubmit={handleSubmitAnswer}
              />
              {isSubmitting &&
                (question?.question_type === QuestionType.SHORT_ANSWER ||
                  question?.question_type === QuestionType.FILL_IN_BLANK) && (
                  <styled.div
                    w="full"
                    textAlign="left"
                    fontWeight="medium"
                    opacity={0.5}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mt={4}
                    fontSize="sm"
                    color="gray.500">
                    {t('quiz.question_page.submitting')}
                  </styled.div>
                )}
            </styled.div>

            {/* Fixed bottom progress bar area */}
            <QuizFooter
              quiz={quiz}
              quizSession={quizSession}
              questionIndex={questionIndex}
              question={question}
              currentQuestionId={currentQuestionId}
              isSubmitting={isSubmitting}
              isLoadingMoreQuestions={isLoadingMoreQuestions}
              textInput={textInput}
              correctIncorrectIdleColor={correctIncorrectIdleColor}
              incorrectRatio={incorrectRatio}
              onQuestionSelect={index => {
                router.push(`/quiz/${quizId}/${quizSessionId}/${index + 1}`);
              }}
              onSkip={() => {
                handleSubmitAnswer('', true);
              }}
              onNext={handleNextButtonClick}
              checkForUnlimitedQuestions={checkForUnlimitedQuestions}
              areAllQuestionsAnswered={areAllQuestionsAnswered}
            />
          </styled.div>
        </>
      )}
    </styled.div>
  );
}
