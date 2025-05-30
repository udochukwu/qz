import { Button } from '@/components/elements/button';
import { useState } from 'react';
import { VStack, styled, Stack, HStack, Grid } from 'styled-system/jsx';
import { useSubmitOnboardingStep } from '../hooks/set-onboarding-v2-step';
import { OnboardingQuestion } from '../types/onboarding-types';
import { Input } from '@/components/elements/input';
import { Check } from 'lucide-react';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';

const OTHER_OPTION = 'Other';
interface Props {
  questions?: OnboardingQuestion[];
  onFinishQuestions: VoidFunction;
}

export const OnboardingQuestions = ({ questions, onFinishQuestions }: Props) => {
  const { t } = useTranslation();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const { submitStep } = useSubmitOnboardingStep();
  const [questionIndex, setQuestionIndex] = useState(0);

  const [otherAnswer, setOtherAnswer] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  console.log(showOtherInput);
  if (!questions) {
    return null;
  }

  const isLastQuestion = questionIndex === questions.length - 1;

  const onConfirm = () => {
    let finalAnswer = selectedAnswers[questions[questionIndex].key];

    mixpanel.track(EventName.OnboardingQuestionSubmitted, {
      question_index: questionIndex.toString(),
      question: questions[questionIndex].key,
      answer: finalAnswer,
      other_answer: finalAnswer === OTHER_OPTION ? otherAnswer : null,
    });

    setSelectedAnswers(prev => ({
      ...prev,
      [questions[questionIndex].key]: finalAnswer,
    }));

    if (isLastQuestion) {
      submitStep({ answers: { ...selectedAnswers, [questions[questionIndex].key]: finalAnswer } });
      onFinishQuestions();
    } else {
      setQuestionIndex(questionIndex + 1);
      setOtherAnswer('');
      setShowOtherInput(false);
    }
  };

  const onOptionSelect = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questions[questionIndex].key]: option });
    if (option === OTHER_OPTION) {
      setShowOtherInput(true);
      setOtherAnswer('');
    } else {
      setShowOtherInput(false);
    }
  };

  const isSelectedOption = (option: string) => selectedAnswers[questions[questionIndex].key] === option;

  const isConfirmDisabled =
    selectedAnswers[questions[questionIndex].key] == null ||
    (selectedAnswers[questions[questionIndex].key] === OTHER_OPTION && !otherAnswer.trim());

  return (
    <VStack alignItems="center" gap={4} w="100%">
      <VStack alignItems="center">
        <styled.span textTransform="uppercase" color="#6D56FA" textStyle="sm" fontWeight="medium">
          {t('newChatView.onboarding.questions.step', {
            questionLength: questions.length + 1,
            questionIndex: questionIndex + 2,
          })}
        </styled.span>
        <styled.span color="neutral.800" textStyle="xl" fontWeight="medium">
          {questions[questionIndex].question}
        </styled.span>
        <styled.p textStyle="md" textAlign="center" color="#15112BB2">
          {t('newChatView.onboarding.questions.description')}
        </styled.p>
      </VStack>

      {!questions[questionIndex].type && (
        <Grid gridTemplateColumns={2} w="100%">
          {questions[questionIndex].options.map(option => (
            <Button
              w="100%"
              variant={isSelectedOption(option) ? 'solid' : 'outline'}
              key={option}
              onClick={() => onOptionSelect(option)}>
              {isSelectedOption(option) && <Check />} {option}
            </Button>
          ))}
        </Grid>
      )}

      {showOtherInput && (
        <Input
          placeholder={t('newChatView.onboarding.questions.otherPlaceholder')}
          value={otherAnswer}
          onChange={e => setOtherAnswer(e.currentTarget.value)}
        />
      )}

      {questions[questionIndex].type === 'dropdown' && (
        <DropdownQuestion
          options={questions[questionIndex].options}
          onSelect={onOptionSelect}
          selectedOption={selectedAnswers[questions[questionIndex].key]}
        />
      )}

      <HStack justifyContent="flex-end" w="100%">
        <Button onClick={onConfirm} visibility={isConfirmDisabled ? 'hidden' : 'visible'}>
          {isLastQuestion ? t('common.confirm') : t('common.next')}
        </Button>
      </HStack>
    </VStack>
  );
};

interface DropdownQuestionProps {
  selectedOption: string;
  options: string[];
  onSelect: (option: string) => void;
}

const DropdownQuestion = ({ options, onSelect, selectedOption }: DropdownQuestionProps) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<string[]>(options);
  const [currentValue, setCurrentValue] = useState<string>(selectedOption);

  const handleChange = (inputValue: string) => {
    const filtered = options.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));
    let newItems = filtered.length > 0 ? filtered : [inputValue];

    if (filtered.length > 0 && newItems.includes(inputValue)) {
      newItems = newItems.filter(item => item !== inputValue);
    }

    setItems(newItems);
    setCurrentValue(inputValue);
  };

  const handleValue = (value: string) => {
    onSelect(value);
    setCurrentValue(value);
  };

  return (
    <Stack w="100%" gap={4}>
      <Input
        placeholder={t('newChatView.onboarding.questions.dropdown.placeholder')}
        onChange={e => {
          const value = e.currentTarget.value;
          handleChange(value);
        }}
      />
      <Stack w="100%" h="300px" overflowY="auto">
        {items.map(item => (
          <Button
            variant={item === currentValue ? 'solid' : 'outline'}
            key={item}
            py={4}
            onClick={() => {
              handleValue(item);
            }}>
            {item === currentValue && <Check />} {item}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};
