import type { Project } from '@/lib/content-types';
import { sanityImageUrl, sanitySrcSet } from '@/lib/sanity-image';

// Card is 16:9; ~520px wide in the two-column desktop grid, full container width on mobile.
const CARD_SIZES = '(max-width: 767px) calc(100vw - 40px), 520px';

export default function ProjectCard({ project, related = false, priority = false }: { project: Project; related?: boolean; priority?: boolean }) {
  const loading = priority ? 'eager' : 'lazy';
  const locked = project.status !== 'public';
  const content = <><div className="project-art"><img className="project-bg" src={sanityImageUrl(project.thumbnail?.url, 1040)} srcSet={sanitySrcSet(project.thumbnail?.url, [480, 720, 1040, 1440])} sizes={CARD_SIZES} loading={loading} fetchPriority={priority ? 'high' : undefined} decoding="async" alt="" /><div className="project-tint" style={{ background: project.tint ?? 'rgba(0,0,0,.25)' }} />{project.logo && <img className="project-logo" src={sanityImageUrl(project.logo.url, 640)} loading={loading} decoding="async" alt={project.title} style={{ width: `${((project.logoWidth ?? 240) / 520) * 100}%` }} />}</div><div className="project-overlay"><div><div className="project-overlay-title"><h2>{project.title}</h2>{locked && <img src="/editorial/hover-imgLock.svg" alt="" width="28" height="28" />}</div><p>{locked ? 'Coming Soon' : '프로젝트 보기 →'}</p></div><span>{project.category}</span></div></>;
  const className = `project-card${locked ? ' is-locked' : ''}${project.slug === 'youmes' ? ' first-project' : ''}`;
  return <div className={related ? 'related-project' : undefined}>{locked ? <div className={className} tabIndex={0} role="group" aria-label={`${project.title}, 상세 내용 준비 중`}>{content}</div> : <a className={className} href={`/portfolio/${project.slug}`} aria-label={`${project.title} 프로젝트 보기`}>{content}</a>}{related && <div className="related-caption"><h3>{project.title}</h3><p>{project.service}</p><span>{project.category}</span><span>{project.period}</span></div>}</div>;
}
