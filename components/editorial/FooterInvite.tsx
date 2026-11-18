'use client';

import { usePathname } from 'next/navigation';
import { parseBlogPath } from '@/lib/blog';

export default function FooterInvite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasInquiryForm = pathname === '/news' || pathname === '/portfolio' || parseBlogPath(pathname) !== null;
  return hasInquiryForm ? null : children;
}
