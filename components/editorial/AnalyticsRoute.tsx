'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsRoute() {
  const pathname = usePathname();
  useEffect(() => {
    document.dispatchEvent(new Event('wdp:route-committed'));
  }, [pathname]);
  return null;
}
