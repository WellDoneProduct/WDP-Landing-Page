import { pageMetadata } from '@/lib/seo';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import ProjectCard from '@/components/editorial/ProjectCard';
import { getProjects } from '@/lib/content';

export const metadata = pageMetadata('포트폴리오 | 웰던프로덕트', '웰던프로덕트의 웹·앱 서비스와 업무 시스템 개발 프로젝트를 만나보세요. 고객의 문제를 해결하는 서비스 기획, 디자인, 개발 사례를 소개합니다.', '/portfolio');
export default async function PortfolioPage() {
  const projects = await getProjects();
  return <div className="portfolio-page"><SiteHeader theme="dark" /><main><div className="editorial-container listing-title"><h1>We always make<br />‘welldoneproduct’</h1></div><div className="editorial-container portfolio-grid">{projects.map((project, index) => <ProjectCard key={project._id} project={project} priority={index < 2} />)}</div>{projects.length === 0 && <p className="content-empty">프로젝트를 준비하고 있습니다.</p>}</main></div>;
}
