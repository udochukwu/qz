import { LoginView } from '@/features/auth/log-in-view';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Flex, styled } from 'styled-system/jsx';
import { HeaderView } from '@/features/auth/header-view';
import { FooterView } from '@/features/marketing/components/footer-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in to unlock Unstuck AI',
  description:
    'Log in to unlock Unstuck AI. Transform your PDFs, PowerPoints, YouTube videos, lectures, textbook, and class notes into trusted study tools',
  alternates: {
    canonical: '/auth/signup',
  },
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    const callbackUrl = searchParams.callbackUrl;
    // Ensure the callback URL is safe to redirect to (you might want to add more validation)
    const redirectUrl = typeof callbackUrl === 'string' && callbackUrl.startsWith('/') ? callbackUrl : '/';
    redirect(redirectUrl);
  }

  return (
    <styled.main width={'100%'}>
      <Flex
        flexDirection="column"
        backgroundColor={'rgba(248, 248, 249, 1)'}
        minHeight={'100vh'}
        width="100%"
        overflowX="hidden">
        <HeaderView />
        <Flex flex={1}>
          <LoginView />
        </Flex>
      </Flex>
      <FooterView />
    </styled.main>
  );
}
