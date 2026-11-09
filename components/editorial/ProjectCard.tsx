import type { Project } from '@/lib/content-types';

export default function ProjectCard({ project, related = false }: { project: Project; related?: boolean }) {
  const locked = project.status !== 'public';
  const content = <><div className="project-art"><img className="project-bg" src={project.thumbnail.url} alt="" /><div className="project-tint" style={{ background: project.tint ?? 'rgba(0,0,0,.25)' }} />{project.logo && <img className="project-logo" src={project.logo.url} alt={project.title} style={{ width: `${((project.logoWidth ?? 240) / 520) * 100}%` }} />}</div><div className="project-overlay"><div><div className="project-overlay-title"><h2>{project.title}</h2>{locked && <img src="/editorial/hover-imgLock.svg" alt="" width="28" height="28" />}</div><p>{locked ? 'Coming Soon' : '프로젝트 보기 →'}</p></div><span>{project.category}</span></div></>;
  const className = `project-card${locked ? ' is-locked' : ''}${project.slug === 'youmes' ? ' first-project' : ''}`;
  return <div className={related ? 'related-project' : undefined}>{locked ? <div className={className} tabIndex={0} role="group" aria-label={`${project.title}, 상세 내용 준비 중`}>{content}</div> : <a className={className} href={`/portfolio/${project.slug}`} aria-label={`${project.title} 프로젝트 보기`}>{content}</a>}{related && <div className="related-caption"><h3>{project.title}</h3><p>{project.service}</p><span>{project.category}</span><span>{project.period}</span></div>}</div>;
}
