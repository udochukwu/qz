import { ExpireUser } from '@/features/auth/components/expire-user';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const Expire = async () => {
  const session = await getServerSession(authOptions);
  return <ExpireUser isSession={!!session} />;
};

export default Expire;
