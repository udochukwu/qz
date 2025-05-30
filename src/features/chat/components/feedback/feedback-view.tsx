import { Button } from '@/components/elements/button';
import { Card } from '@/components/elements/card';
import { IconButton } from '@/components/elements/icon-button';

import { XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Divider, HStack, styled, VStack } from 'styled-system/jsx';
import {
  DissatisfiedIcon,
  NeutralIcon,
  SatisfiedIcon,
  VeryDissatisfiedIcon,
  VerySatisfiedIcon,
} from './feedback-icons';
import { FeedbackReactionType, Reason } from '../../types';
import { Checkbox } from '@/components/elements/checkbox';
import ReactionComponent from './reaction-button';
import { TextArea } from '@/components/elements/text-area';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import { EventName } from '@/providers/custom-tracking-provider';
import { setCookie } from '@/utils/cookies';
import { FEEDBACK_SUBMITTED } from '../../consts/feedback';

const reactions = [
  {
    reaction: FeedbackReactionType.VERY_SATISFIED,
    icon: VerySatisfiedIcon,
  },
  {
    reaction: FeedbackReactionType.SATISFIED,
    icon: SatisfiedIcon,
  },
  {
    reaction: FeedbackReactionType.NEUTRAL,
    icon: NeutralIcon,
  },
  {
    reaction: FeedbackReactionType.DISAPPOINTED,
    icon: DissatisfiedIcon,
  },
  {
    reaction: FeedbackReactionType.VERY_DISAPPOINTED,
    icon: VeryDissatisfiedIcon,
  },
];

const reasons: Reason[] = [
  {
    id: 1,
    label: 'feedback.negative.reasons.notUseful',
  },
  {
    id: 2,
    label: 'feedback.negative.reasons.notRelevant',
  },
  {
    id: 3,
    label: 'feedback.negative.reasons.tooLengthy',
  },
  {
    id: 4,
    label: 'feedback.negative.reasons.tooShort',
  },
  {
    id: 5,
    label: 'feedback.negative.reasons.others.title',
  },
];

interface FeedbackProps {
  close: () => void;
}

export default function FeedbackView({ close }: FeedbackProps) {
  const { t } = useTranslation();

  const [reaction, setReaction] = useState<FeedbackReactionType | null>(null);
  const [selectedReasonIds, setSelectedReasonIds] = useState<Set<Reason>>(new Set());
  const [otherReason, setOtherReason] = useState<string>('');

  const isNegativeFeedback =
    reaction !== null && [FeedbackReactionType.DISAPPOINTED, FeedbackReactionType.VERY_DISAPPOINTED].includes(reaction);

  const isSubmitDisabled =
    reaction === null ||
    (isNegativeFeedback && selectedReasonIds.size === 0) ||
    (selectedReasonIds.has(reasons[4]) && !otherReason);

  const handleSubmitFeedback = () => {
    mixpanel.track(EventName.FeedbackProvided, {
      reaction,
      reasons: Array.from(selectedReasonIds).map(rs => t(rs.label)),
      otherReason,
    });
    setOtherReason('');
    setCookie(FEEDBACK_SUBMITTED, 'true', 30);
    close();
  };

  useEffect(() => {
    if (!isNegativeFeedback) {
      setSelectedReasonIds(new Set());
      setOtherReason('');
    }
  }, [isNegativeFeedback]);

  return (
    <Card.Root width={'405px'} borderRadius={'18px'}>
      <Card.Header paddingY={3} paddingX={4}>
        <HStack paddingX={1} justifyContent="space-between">
          <Card.Title style={{ margin: '0 !important' }} fontWeight="medium">
            {t('feedback.title')}
          </Card.Title>
          <IconButton
            borderRadius="full"
            backgroundColor="#F3F3F3"
            aria-label={t('chat.feedback.close')}
            variant="ghost"
            color="#828286"
            _hover={{ color: '#6D56FA' }}
            marginTop={0.5}
            onClick={() => close()}
            size="xs">
            <XIcon />
          </IconButton>
        </HStack>
      </Card.Header>
      <Divider />
      <Card.Body alignItems="start" paddingX={4}>
        <styled.p mt={4} textStyle="sm">
          {t('feedback.description')}
        </styled.p>
        <HStack mt={5} justifyContent="space-between" width="336px">
          {reactions.map((r, index) => (
            <ReactionComponent
              selected={reaction === r.reaction}
              key={index}
              onClick={() => {
                setReaction(r.reaction);
              }}>
              <r.icon
                style={{ height: 'unset', width: 'unset' }}
                color={reaction === r.reaction ? '#6D56FA' : '#3E3C46'}
              />
            </ReactionComponent>
          ))}
        </HStack>
        <HStack mt={3} justifyContent="space-between" width="336px">
          <styled.p textStyle="xs" color="GrayText">
            {t('feedback.reactions.verySatisfied')}
          </styled.p>
          <styled.p textStyle="xs" color="GrayText">
            {t('feedback.reactions.notSatisfied')}
          </styled.p>
        </HStack>

        {isNegativeFeedback && (
          <VStack alignItems="start" gap={6}>
            <VStack alignItems="start" gap={0}>
              <styled.p textStyle="sm" mb={1}>
                {t('feedback.negative.title')}
              </styled.p>
              <styled.i textStyle="xs" color="GrayText">
                ({t('feedback.negative.description')})
              </styled.i>
            </VStack>

            <VStack alignItems="start" gap={3}>
              {reasons.map((item, i) => (
                <Checkbox
                  key={i}
                  iconColor="#6D56FA"
                  iconBackground={selectedReasonIds.has(item) ? '#6D56FA0F' : ''}
                  borderColor={selectedReasonIds.has(item) ? '#6D56FA' : '#D0D5DD'}
                  checked={selectedReasonIds.has(item)}
                  size="sm"
                  onCheckedChange={details => {
                    if (details.checked) {
                      setSelectedReasonIds(new Set([...selectedReasonIds, item]));
                    } else {
                      selectedReasonIds.delete(item);
                      setSelectedReasonIds(new Set([...selectedReasonIds]));
                    }
                    setOtherReason('');
                  }}>
                  <styled.p textStyle="sm" fontWeight="light" mb={0}>
                    {t(item.label)}
                  </styled.p>
                </Checkbox>
              ))}
              {selectedReasonIds.has(reasons[4]) && (
                <TextArea
                  resizable={false}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #D0D5DD',
                    padding: '10px 14px',
                    fontWeight: '400',
                    fontSize: '14px',
                  }}
                  name="reason"
                  id="reason"
                  placeholder={t('feedback.negative.reasons.others.placeholder')}
                  placeholderColor="#868492"
                  value={otherReason}
                  onChange={e => setOtherReason(e.target.value)}
                  rows={5}
                />
              )}
            </VStack>
          </VStack>
        )}
      </Card.Body>
      <Card.Footer width="100%" gap={3}>
        <Button
          paddingY={3}
          onClick={() => close()}
          borderRadius={'10px'}
          color="ButtonText"
          backgroundColor="gray.2"
          width="1/2">
          {t('common.cancel')}
        </Button>
        <Button
          paddingY={3}
          onClick={handleSubmitFeedback}
          borderRadius={'10px'}
          backgroundColor={isSubmitDisabled ? '#6D56FA80' : '#6D56FA'}
          color={'white'}
          colorPalette={'blue'}
          width="1/2"
          disabled={isSubmitDisabled}>
          {t('common.submit')}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
