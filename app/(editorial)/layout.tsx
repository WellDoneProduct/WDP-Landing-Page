import { SiteTop } from '@/components/editorial/SiteChrome';
import SiteFooter from '@/components/editorial/SiteFooter';
import './editorial.css';

// Every editorial page is prerendered at build time. Content updates ship through the
// Sanity → Vercel Deploy Hook rebuild, so no request ever reaches Sanity at runtime.
export const dynamic = 'force-static';

export default function EditorialLayout({ children }: { children: React.ReactNode }) {
  return <div className="editorial-site"><link rel="stylesheet" href="/site-chrome.css" />{children}<SiteFooter /><SiteTop /></div>;
}
