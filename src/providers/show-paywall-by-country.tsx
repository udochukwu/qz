'use client';
import { UpgradePlan } from '@/features/paywall/components/upgrade-plan-page';
import { useSubscriptionStatus } from '@/features/paywall/hooks/use-subscription-status';
import { Dialog } from '@ark-ui/react';
import { Session } from 'next-auth';
import { VStack } from 'styled-system/jsx';
import Image from 'next/image';

interface ShowPaywallByCountryProps {
  children: React.ReactNode;
  requestHeaders: [string, string][];
  session: Session | null;
}

const PAYWALLED_COUNTRIES = ['IN'];

export default function ShowPaywallByCountry({ children, requestHeaders, session }: ShowPaywallByCountryProps) {
  const country = requestHeaders.find(header => header[0].toLowerCase() === 'cloudfront-viewer-country')?.[1] || '';
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();
  const experiments = session?.user.experiments;
  const showPaywall =
    (PAYWALLED_COUNTRIES.includes(country) || (experiments && experiments['instant-paywall-experiment'])) &&
    !isLoading &&
    !subscriptionStatus?.is_pro &&
    session;

  return (
    <>
      {showPaywall && (
        <Dialog.Root open={true} onOpenChange={() => {}} lazyMount>
          <Dialog.Positioner
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <UpgradePlan referrer={'hard-country-paywall'} />
          </Dialog.Positioner>
        </Dialog.Root>
      )}
      {isLoading && session ? (
        <VStack alignItems="center" justifyContent="center" height="100vh">
          <Image src={'/images/unstucklogo-long.png'} alt="logo" width={150} height={150} />
        </VStack>
      ) : (
        children
      )}
    </>
  );
}
