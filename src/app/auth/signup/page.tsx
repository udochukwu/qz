import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Flex } from 'styled-system/jsx';
import { HeaderView } from '@/features/auth/header-view';
import { FooterView } from '@/features/marketing/components/footer-view';
import { Metadata } from 'next';
import { AuthFormView } from '@/features/auth/auth-form-view';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Sign up to unlock Unstuck AI',
  description:
    'Sign up to unlock Unstuck AI. Transform your PDFs, PowerPoints, YouTube videos, lectures, textbook, and class notes into trusted study tools',
  alternates: {
    canonical: '/auth/signup',
  },
};

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <main>
      <Flex
        flexDirection="column"
        backgroundColor={'rgba(248, 248, 249, 1)'}
        minHeight={'100vh'}
        width="100%"
        overflowX="hidden">
        <HeaderView />
        <Flex flex={1} justifyContent={'center'} alignItems={'center'} backgroundColor={'rgba(248, 248, 249, 1)'}>
          <AuthFormView title={['auth.common.signUp', 'auth.common.toUnstuckAI']} />
        </Flex>
      </Flex>
      <FooterView />
    </main>
  );
}
