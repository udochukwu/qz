'use client';
import ChatPage from '@/features/chat/components/chat-page';
import FlashcardPage from '@/features/flashcard/flashcard-page';
import { MENU_TAB } from '@/features/menu-bar/types';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';
import { useViewTypeStore } from '@/stores/view-type-store';
import React from 'react';
import { styled } from 'styled-system/jsx';
import { Dialog } from '@ark-ui/react';
import { UpgradePlan } from '@/features/paywall/components/upgrade-plan-page';

export default function MainPage({ requestHeaders }: { requestHeaders: [string, string][] }) {
  const { currentView } = useViewTypeStore();
  const country = requestHeaders.find(header => header[0].toLowerCase() === 'cloudfront-viewer-country')?.[1];
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();
  const showPaywall = country === 'IN' && !isLoading && !subscriptionStatus?.is_pro;

  return (
    <styled.div bgColor="#F8F8F8">
      {showPaywall && (
        <Dialog.Root open={true} onOpenChange={() => {}} lazyMount>
          <Dialog.Positioner
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <UpgradePlan referrer={'hard-country-paywall'} />
          </Dialog.Positioner>
        </Dialog.Root>
      )}
      {currentView === MENU_TAB.FLASHCARDS && <FlashcardPage filterByClass={true} />}
      {currentView === MENU_TAB.CHATS && <ChatPage />}
    </styled.div>
  );
}
