'use client';
import { usePathname } from 'next/navigation';
import MenuBar from '@/features/menu-bar/menu-bar';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

interface ShowMenuBarProps {
  session: Session | null;
}

export default function ShowMenuBar({ session }: ShowMenuBarProps) {
  const pathname = usePathname();
  const [is404Page, setIs404Page] = useState(false);

  useEffect(() => {
    const pageTitle = document.title;
    setIs404Page(pageTitle.startsWith('404'));
  }, [pathname]); // Re-run effect when pathname changes

  const isAuthPage = pathname?.startsWith('/auth/');

  const shouldShowMenuBar = session && !isAuthPage && !is404Page;

  return <>{shouldShowMenuBar && <MenuBar />}</>;
}
