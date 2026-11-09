import { pageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import ProjectDetail from '@/components/editorial/ProjectDetail';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = async () => ((await getProjects()) ?? []).filter(project => project?.slug && project.status === 'public').map(project => ({ slug: project.slug }));
export async function generateMetadata({ params }: Props) { const project = await getProject((await params).slug); return project ? pageMetadata(`${project.title} | 웰던프로덕트`, project.description, `/portfolio/${project.slug}`, project.heroImage?.url || project.thumbnail.url) : {title: '프로젝트를 찾을 수 없습니다', robots: {index: false}}; }
export default async function PortfolioDetail({ params }: Props) {
  const project = await getProject((await params).slug); if (!project) notFound();
  const projects = await getProjects();
  const related = projects.filter(p => p._id !== project._id && (!project.related?.length || project.related.includes(p._id)));
  return <ProjectDetail project={project} related={related} />;
}
