import { SiteTop } from '@/components/editorial/SiteChrome';
import SiteFooter from '@/components/editorial/SiteFooter';
import './editorial.css';

export default function EditorialLayout({ children }: { children: React.ReactNode }) {
  return <div className="editorial-site"><link rel="stylesheet" href="/site-chrome.css" />{children}<SiteFooter /><SiteTop /></div>;
}
