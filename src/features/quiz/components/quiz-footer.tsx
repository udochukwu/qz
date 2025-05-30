import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';
import { QuestionType } from '@/features/quiz/types/quiz';
import { ChevronDown, Check, X as XIcon, Circle, Infinity } from 'lucide-react';
import { Select } from '@/components/elements/select';
import { QuizProgressBar } from '@/features/quiz/components/quiz-progress-bar';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';

interface QuizFooterProps {
  quiz: {
    is_unlimited?: boolean;
    questions: Record<string, any>;
  };
  quizSession: Record<string, any>;
  questionIndex: number;
  question:
    | {
        question_type: QuestionType;
      }
    | null
    | undefined;
  currentQuestionId: string | null;
  isSubmitting: boolean;
  isLoadingMoreQuestions: boolean;
  textInput: string;
  correctIncorrectIdleColor: string;
  incorrectRatio: number;
  onQuestionSelect: (index: number) => void;
  onSkip: () => void;
  onNext: () => void;
  checkForUnlimitedQuestions: () => void;
  areAllQuestionsAnswered: () => boolean;
}

export function QuizFooter({
  quiz,
  quizSession,
  questionIndex,
  question,
  currentQuestionId,
  isSubmitting,
  isLoadingMoreQuestions,
  textInput,
  correctIncorrectIdleColor,
  incorrectRatio,
  onQuestionSelect,
  onSkip,
  onNext,
  checkForUnlimitedQuestions,
  areAllQuestionsAnswered,
}: QuizFooterProps) {
  const { t } = useTranslation();
  const [allowSkip, setAllowSkip] = useState<boolean>(false);

  useEffect(() => {
    if (allowSkip) return;
    setTimeout(() => {
      setAllowSkip(true);
    }, 2000);
  }, []);

  const getQuestionStatus = (questionId: string) => {
    if (!quizSession || !quiz?.questions) return null;
    const sessionQuestion = quizSession[questionId];
    if (!sessionQuestion) return null;
    return sessionQuestion.is_correct;
  };

  const getNextButtonText = () => {
    if (!currentQuestionId || !quizSession || !question) return t('quiz.question_page.next_question');

    const questionIds = Object.keys(quizSession);
    const isLastQuestion = questionIndex === questionIds.length - 1;
    const hasAnsweredCurrent = quizSession[currentQuestionId]?.submitted_answer;
    const isTextQuestion =
      question.question_type === QuestionType.SHORT_ANSWER || question.question_type === QuestionType.FILL_IN_BLANK;

    if (isSubmitting && isTextQuestion) {
      return t('quiz.question_page.submitting');
    } else if (isTextQuestion && textInput.length > 0 && !hasAnsweredCurrent) {
      return t('quiz.question_page.submit_answer');
    } else if (areAllQuestionsAnswered() && !quiz.is_unlimited) {
      return t('quiz.question_page.finish', 'Finish');
    } else if (isLastQuestion) {
      if (quiz.is_unlimited) {
        return isLoadingMoreQuestions ? t('quiz.question_page.loading_more') : t('quiz.question_page.next_question');
      } else {
        return t('quiz.question_page.review_past_question');
      }
    } else {
      return t('quiz.question_page.next_question');
    }
  };

  const isNextButtonDisabled = () => {
    if (isSubmitting || isLoadingMoreQuestions || !currentQuestionId) {
      return true;
    }

    if (quizSession[currentQuestionId]?.submitted_answer || quizSession[currentQuestionId]?.skipped) {
      return false;
    }

    const hasAnsweredCurrent = quizSession[currentQuestionId]?.submitted_answer;
    const isTextQuestion =
      question?.question_type === QuestionType.SHORT_ANSWER || question?.question_type === QuestionType.FILL_IN_BLANK;

    // Disable if it's a text question, hasn't been answered/skipped yet, and the input is empty
    if (isTextQuestion && textInput.length === 0 && !hasAnsweredCurrent && !quizSession[currentQuestionId]?.skipped) {
      return true;
    }

    if (!isTextQuestion && !hasAnsweredCurrent) {
      return true;
    }

    return false;
  };

  return (
    <styled.div py={4} px={5}>
      <styled.div display="flex" gap={5} alignItems={'center'} justifyContent="space-between" w="full">
        <Select.Root
          positioning={{ sameWidth: true }}
          width="12rem"
          items={Object.keys(quiz.questions).map((_, index) => String(index + 1))}
          onValueChange={({ value }) => {
            const newIndex = parseInt(value[0]) - 1;
            onQuestionSelect(newIndex);
          }}>
          <Select.Control>
            <Select.Trigger
              bg="#00000010"
              _hover={{ bg: '#00000020' }}
              color="black"
              cursor="pointer"
              whiteSpace={'nowrap'}
              px={3}
              py={2}
              borderRadius="lg"
              fontSize={'sm'}
              fontWeight={'semibold'}
              display="flex"
              alignItems="center"
              height={'fit-content'}
              gap={2}
              border="none"
              w="auto">
              <Select.ValueText
                display="flex"
                alignItems="center"
                gap={1.5}
                placeholder={`${t('quiz.question_page.question')} ${questionIndex + 1}`}>
                {t('quiz.question_page.question')} {questionIndex + 1} {t('quiz.question_page.of')}{' '}
                {quiz.is_unlimited ? <Infinity color="black" size={16} /> : Object.keys(quizSession).length}
              </Select.ValueText>
              <ChevronDown color="black" size={16} />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content maxH="12rem" overflowY="scroll">
              <Select.ItemGroup>
                {(quiz.is_unlimited
                  ? (() => {
                      const questionIds = Object.keys(quizSession);
                      // Find the highest index of any answered question
                      let lastAnsweredIdx = -1;
                      questionIds.forEach((qid, idx) => {
                        if (quizSession[qid]?.submitted_answer || quizSession[qid]?.skipped) {
                          lastAnsweredIdx = idx;
                        }
                      });
                      // Show all up to lastAnsweredIdx + 1 (if exists)
                      const maxIdx = Math.min(lastAnsweredIdx + 1, questionIds.length - 1);
                      return questionIds.slice(0, maxIdx + 1);
                    })()
                  : Object.keys(quizSession)
                ).map((questionId, index) => {
                  const status = getQuestionStatus(questionId);

                  return (
                    <Select.Item
                      item={String(index + 1)}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      key={index}>
                      <Select.ItemText fontSize={'sm'}>
                        <styled.div
                          display="flex"
                          alignItems="center"
                          justifyContent={'center'}
                          fontWeight={'medium'}
                          w={'full'}
                          gap={2}>
                          {status === true && (
                            <styled.div
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width="15px"
                              height="15px"
                              borderRadius="full"
                              backgroundColor="#36AF6F">
                              <Check size={12} color="white" />
                            </styled.div>
                          )}
                          {status === false && (
                            <styled.div
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width="15px"
                              height="15px"
                              borderRadius="full"
                              backgroundColor="#FD2D3F">
                              <XIcon size={12} color="white" />
                            </styled.div>
                          )}
                          {status === null && <Circle size={15} color="#00000040" />}
                          {t('quiz.question')} {index + 1}
                        </styled.div>
                      </Select.ItemText>
                    </Select.Item>
                  );
                })}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
        {quiz.is_unlimited ? (
          <styled.div display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} width="full">
            <styled.div
              bg="#00000010"
              p={2}
              borderRadius="lg"
              textAlign="center"
              fontSize="sm"
              fontWeight="medium"
              color="black"
              borderWidth={1}
              borderColor="rgba(0, 0, 0, 0.25)">
              <styled.div fontSize="xs">{t('quiz.question_page.accuracy')}</styled.div>
              <NumberFlow
                value={isNaN(Math.round(100 - incorrectRatio * 100)) ? 0 : Math.round(100 - incorrectRatio * 100)}
              />
              {'%'}
            </styled.div>
            <styled.div
              bg="#36AF6F10"
              p={2}
              borderRadius="lg"
              textAlign="center"
              fontSize="sm"
              fontWeight="medium"
              color="#36AF6F"
              borderWidth={1}
              borderColor="rgba(54, 175, 111, 0.25)">
              <styled.div fontSize="xs">{t('quiz.question_page.correct')}</styled.div>
              <NumberFlow value={Object.values(quizSession).filter(q => q?.is_correct === true).length} />
            </styled.div>
            <styled.div
              bg="#FD2D3F10"
              p={2}
              borderRadius="lg"
              textAlign="center"
              fontSize="sm"
              fontWeight="medium"
              color="#FD2D3F"
              borderWidth={1}
              borderColor="rgba(253, 45, 63, 0.25)">
              <styled.div fontSize="xs">{t('quiz.question_page.incorrect')}</styled.div>
              <NumberFlow value={Object.values(quizSession).filter(q => q?.is_correct === false).length} />
            </styled.div>
          </styled.div>
        ) : (
          <QuizProgressBar currentIndex={questionIndex} totalQuestions={Object.keys(quizSession).length} />
        )}

        <styled.div display="flex" gap={2}>
          {quiz.is_unlimited && currentQuestionId && quizSession && (
            <styled.button
              bg="#00000010"
              whiteSpace={'nowrap'}
              onClick={onSkip}
              transition={'background-color 0.2s ease-in-out'}
              color="black"
              _disabled={{
                opacity: 0.3,
                cursor: !allowSkip ? 'wait' : 'not-allowed',
              }}
              cursor={'pointer'}
              disabled={
                Boolean(
                  quizSession[currentQuestionId]?.skipped ||
                    isSubmitting ||
                    isLoadingMoreQuestions ||
                    quizSession[currentQuestionId]?.submitted_answer,
                ) || !allowSkip
              }
              px={3}
              py={2}
              borderRadius="lg"
              fontSize={'sm'}
              fontWeight={'semibold'}
              textAlign="center"
              height={'fit-content'}>
              {t('quiz.question_page.skip')}
            </styled.button>
          )}
          <styled.button
            bg={correctIncorrectIdleColor === '#36AF6F' ? '#36AF6F' : '#6D56FA'}
            whiteSpace={'nowrap'}
            onClick={onNext}
            transition={'background-color 0.2s ease-in-out'}
            color="white"
            cursor={'pointer'}
            disabled={isNextButtonDisabled()}
            px={3}
            py={2}
            borderRadius="lg"
            fontSize={'sm'}
            minWidth={'10em'}
            fontWeight={'semibold'}
            textAlign="center"
            height={'fit-content'}
            _disabled={{
              opacity: 0.5,
              cursor: 'not-allowed',
            }}>
            {getNextButtonText()}
          </styled.button>
        </styled.div>
      </styled.div>
    </styled.div>
  );
}
