import type { Project } from './content-types';

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
// Static-home counterpart of ProjectCard: same CMS data, classes and locked behavior.
export function homeProjectCards(projects: Project[]) {
  return projects.map(project => {
    const locked = project.status !== 'public';
    const title = escape(project.title);
    const width = Math.min(520, Math.max(1, project.logoWidth ?? 240)) / 520 * 100;
    const content = `<div class="project-art"><img class="project-bg" loading="lazy" src="${escape(project.thumbnail.url)}" alt="" /><div class="project-tint" style="background:${escape(project.tint ?? 'rgba(0,0,0,.25)')}" ></div>${project.logo ? `<img class="project-logo" loading="lazy" src="${escape(project.logo.url)}" alt="${title}" style="width:${width}%" />` : ''}</div><div class="project-overlay"><div><div class="project-overlay-title"><h2>${title}</h2>${locked ? '<img src="/editorial/hover-imgLock.svg" alt="" width="28" height="28" />' : ''}</div><p>${locked ? 'Coming Soon' : '프로젝트 보기 →'}</p></div><span>${escape(project.category)}</span></div>`;
    return locked ? `<div class="project-card is-locked" tabindex="0" role="group" aria-label="${title}, 상세 내용 준비 중">${content}</div>` : `<a class="project-card" href="/portfolio/${encodeURIComponent(project.slug)}" aria-label="${title} 프로젝트 보기">${content}</a>`;
  }).join('');
}
