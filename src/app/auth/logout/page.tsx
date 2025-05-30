import { getServerSession } from 'next-auth';
import { LogoutUser } from '@/features/auth/components/logout-user';
import { authOptions } from '@/lib/next-auth';

const LogoutPage = async () => {
  const session = await getServerSession(authOptions);

  return <LogoutUser isSession={!!session} />;
};

export default LogoutPage;
