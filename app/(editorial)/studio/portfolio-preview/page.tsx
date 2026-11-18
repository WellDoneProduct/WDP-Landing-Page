import { SiteHeader } from '@/components/editorial/SiteChrome';
import { getProjects } from '@/lib/content';
import Preview from './Preview';

export const dynamic = 'force-static';
export const metadata = { title: '포트폴리오 상세 미리보기', robots: { index: false, follow: false } };

export default async function PortfolioPreviewPage() {
  return <Preview projects={await getProjects()} header={<SiteHeader theme="hero" />} />;
}
