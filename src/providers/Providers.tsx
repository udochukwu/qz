'use client';
import { ReactNode, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Next13ProgressBar } from 'next13-progressbar';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { FullStory, init as FSinit } from '@fullstory/browser';
import { useUserStore } from '@/stores/user-store';
import { LoadingScreen } from '@/features/user-feedback/loading-screen';
import styles from './progress-bar-fix';
import * as Sentry from '@sentry/nextjs';
import { CopyTrackingProvider } from './copy-tracker-provider';
import { MixpanelProvider } from './custom-tracking-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { FileUploadBarStateProvider } from './file-upload-barState-provider';
import { PostHogProvider } from './PostHogProvider';

interface Props {
  children: ReactNode;
}

export const queryClient = new QueryClient();

export const Providers = ({ children }: Props) => {
  const { user_id, username, email } = useUserStore();

  //console.log('User', user);

  //TODO: Setup user identity for FullStory (feel free to change the position of this code)
  useEffect(() => {
    FSinit({ orgId: 'o-1WAX37-na1' });

    //If display name is !=  Guest then set the identity
    if (username === 'Guest') {
      return;
    }
    FullStory('setIdentity', {
      uid: user_id,
      properties: {
        displayName: username,
        email: email,
      },
    });
    Sentry.setUser({ id: user_id, username, email });
  }, [user_id, username, email]);

  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <PostHogProvider>
            <MixpanelProvider>
              <FileUploadBarStateProvider>
                <CopyTrackingProvider>{children}</CopyTrackingProvider>
              </FileUploadBarStateProvider>
            </MixpanelProvider>
          </PostHogProvider>
          <Toaster />
          <Suspense fallback={<LoadingScreen />}>
            <Next13ProgressBar options={{ showSpinner: false }} showOnShallow style={styles} />
          </Suspense>
        </QueryClientProvider>
      </I18nextProvider>
    </SessionProvider>
  );
};
