/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GTWalsheim } from '@/fonts/GTWalsheim';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { UploadFilePendingWindow } from '@/features/files-pdf-chunks-sidebar/upload-file-pending-window/upload-file-pending-window';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { UpgradePlanModal } from '@/features/paywall/components/upgrade-plan-modal';
import { IntercomButton } from '@/features/customer-service/components/intercom-button';
import { ManageSubscriptionModal } from '@/features/paywall/components/manage-subscription-modal';
import { LanguageSelectionModal } from '@/features/files-pdf-chunks-sidebar/components/language-selection-modal';
import ShowMenuBar from '@/providers/show-menu-bar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth';
import { styled } from 'styled-system/jsx';
import AppBanner from '@/components/download-app-banner';
import DownloadAppBanner from '@/components/download-app-modal';
import ShowPaywallByCountry from '@/providers/show-paywall-by-country';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Unstuck AI',
    default: 'Unstuck AI',
  },
  description:
    'Unstuck transforms your PDFs, PowerPoints, YouTube videos, lectures, textbook, and class notes into trusted study tools.',
  metadataBase: new URL('https://unstuckstudy.com'),
  keywords: [
    'Unstuck',
    'Unstuck AI',
    'Unstuck Study',
    'Chat PDF',
    'AI PDF',
    'AI Homework',
    'Chat with multiple PDFs',
    'Chat with multiple PowerPoints',
    'Chat with multiple YouTube videos',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  return (
    <html lang="en" translate="no">
      <head>
        <GoogleAnalytics gaId="G-P9SBHSYBV3" />
        <Script id="facebook-pixel">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2235512073453698');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2235512073453698&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>
      </head>
      <body className={inter.className}>
        <Providers>
          <DownloadAppBanner />
          <AppBanner />

          {session && (
            <>
              <IntercomButton />
              <UploadFilePendingWindow />
              <UpgradePlanModal />
              <ManageSubscriptionModal />
              <LanguageSelectionModal />
            </>
          )}
          <section>
            <ShowPaywallByCountry requestHeaders={Array.from(headersList.entries())} session={session}>
              <styled.div display="flex" flexDirection="row" width="100%">
                <ShowMenuBar session={session} />
                <styled.div
                  display="flex"
                  flexDirection="column"
                  style={{ width: `calc( 100% - 381px)` }}
                  flexGrow={'1'}>
                  {children}
                </styled.div>
              </styled.div>
            </ShowPaywallByCountry>
          </section>
        </Providers>
      </body>
    </html>
  );
}
