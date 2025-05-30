import React from 'react';
import { CompactFileSuggestion, CompactSuggestion, MessageSuggestion } from '../../types';
import { AnimatedSuggestedText } from './animated-suggested-texts';

interface MessageSuggestionListProps {
  sendFromGeneratedSuggestion: (
    message: string,
    suggestion?: CompactFileSuggestion | CompactSuggestion,
  ) => Promise<void>;
  suggestedMessages: MessageSuggestion[];
}

export function MessageSuggestionList({ sendFromGeneratedSuggestion, suggestedMessages }: MessageSuggestionListProps) {
  return (
    <AnimatedSuggestedText
      suggestedMessages={suggestedMessages}
      sendFromGeneratedSuggestion={sendFromGeneratedSuggestion}
    />
  );
}
