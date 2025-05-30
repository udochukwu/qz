import React from 'react';
import { Button } from '@/components/elements/button';
import SendAirplaneIcon from './send-airplane-icon';
import { styled } from 'styled-system/jsx';
import { getChatIdFromPath, getPageName } from '@/utils/page-name-utils';
import { CompactFileSuggestion, CompactSuggestion, MessageSuggestion, MessageSuggestionType } from '../../types';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';

interface GeneratedSuggestedButtonProps {
  suggestion: MessageSuggestion;
  onClick: (message: string, suggestion?: CompactFileSuggestion | CompactSuggestion) => Promise<void>;
}

export default function GeneratedSuggestedButton({ suggestion, onClick }: GeneratedSuggestedButtonProps) {
  // Split the text into parts, with filenames wrapped in curly braces
  const parts = suggestion.message.split(/(\{[^}]+\})/);
  const getTextWithNoCurlyBraces = (text: string) => {
    return text.replace(/{|}/g, '');
  };
  const handleOnClick = async () => {
    mixpanel.track(EventName.SuggestedMessageClicked, {
      page: getPageName(window.location.pathname),
      path: window.location.pathname,
      chat_id: getChatIdFromPath(window.location.pathname),
    });

    if (suggestion.suggestion_type === MessageSuggestionType.FILE) {
      await onClick(getTextWithNoCurlyBraces(suggestion.message), {
        suggestion_id: suggestion.suggestion_id!,
        file_id: suggestion.file_id!,
      });
    } else if (suggestion.suggestion_type === MessageSuggestionType.WORKSPACE) {
      await onClick(getTextWithNoCurlyBraces(suggestion.message), {
        suggestion_id: suggestion.suggestion_id!,
      });
    } else {
      await onClick(getTextWithNoCurlyBraces(suggestion.message));
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleOnClick}
      bg={'white'}
      data-suggestion={suggestion.message}
      borderColor={'#15112B0F'}
      borderWidth={'1.22px'}
      rounded={'lg'}
      p={2}
      paddingLeft={'15px'}
      display={'flex'}
      alignItems={'center'}
      gap={6}
      color={'quizard.black'}
      fontWeight={'500'}
      whiteSpace={'normal'}
      textAlign={'left'}
      height={'auto'}
      _hover={{
        bg: '#15112B0F',
      }}>
      <span style={{ flexGrow: 1, overflowWrap: 'break-word' }}>
        {parts.map((part, index) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            // This is a filename, render it in gray
            return (
              <styled.span key={index} color="colorPalette.default">
                {part.slice(1, -1)}
              </styled.span>
            );
          }
          // This is regular text
          return <span key={index}>{part}</span>;
        })}
      </span>
      <SendAirplaneIcon />
    </Button>
  );
}
