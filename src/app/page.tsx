import { BlockUIFromMobile } from '@/components/block-ui-from-mobile';
import MainPage from '@/components/main-page';
import LandingPage from '@/features/marketing/components/landing-page';
import { authOptions } from '@/lib/next-auth';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import React from 'react';

export const metadata: Metadata = {
  title: 'Chat with all of your Course Materials | Unstuck AI',
  alternates: {
    canonical: '/',
  },
};

const Home = async () => {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  if (session) {
    return (
      <BlockUIFromMobile>
        <MainPage requestHeaders={Array.from(headersList.entries())} />
      </BlockUIFromMobile>
    );
  }

  return <LandingPage />;
};

export default Home;
