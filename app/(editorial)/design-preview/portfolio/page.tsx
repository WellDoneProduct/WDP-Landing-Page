import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/editorial/ProjectDetail';
import { demoProject, starterProjects } from '@/lib/demo-content';

export const metadata = { title: '포트폴리오 디자인 검토', robots: { index: false, follow: false } };
export default function PreviewPage() {
  if (process.env.NODE_ENV !== 'development' && !(process.env.WDP_ENVIRONMENT === 'development' && process.env.WDP_DESIGN_PREVIEW === 'true')) notFound();
  return <ProjectDetail project={demoProject} related={starterProjects.slice(2)} preview />;
}
