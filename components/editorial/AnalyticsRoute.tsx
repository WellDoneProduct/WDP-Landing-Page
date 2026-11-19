'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsRoute() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.dataset.analyticsRouteReady = 'true';
    document.dispatchEvent(new CustomEvent('wdp:route-committed', { detail: pathname }));
  }, [pathname]);
  return null;
}
