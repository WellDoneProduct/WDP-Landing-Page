'use client';

import { usePathname } from 'next/navigation';

export default function FooterInvite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideInvite = pathname === '/news' || pathname === '/portfolio' || pathname === '/blog' || pathname.startsWith('/blog/');
  return hideInvite ? null : children;
}
