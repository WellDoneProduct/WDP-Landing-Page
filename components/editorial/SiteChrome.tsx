import { createElement } from 'react';
import Script from 'next/script';
import { headerMarkup } from '@/lib/header-markup';

export function SiteHeader({ theme = 'light' }: { theme?: 'light' | 'dark' | 'hero' }) {
  return <>{createElement('wdp-header', { theme, suppressHydrationWarning: true, dangerouslySetInnerHTML: {__html: headerMarkup} })}<Script src="/site-chrome.js" strategy="afterInteractive" /></>;
}

export function SiteTop() { return createElement('wdp-top'); }
