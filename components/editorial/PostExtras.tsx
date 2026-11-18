import { displayDate } from '@/lib/blog';
import { findService, serviceUrl } from '@/lib/services';
import type { Person, Post } from '@/lib/content-types';

// Default presentation for the blog credits, sources and related links. Markup carries data-track
// attributes so analytics can tell related-service clicks apart without changing the HTML later.
const isHttpUrl = (url?: string) => typeof url === 'string' && /^https?:\/\//i.test(url);

const PersonLine = ({ label, person }: { label: string; person?: Person }) => {
  if (!person?.name) return null;
  const name = isHttpUrl(person.url) ? <a href={person.url} target="_blank" rel="noopener noreferrer">{person.name}</a> : person.name;
  return <div className="post-person">
    <span className="post-person-label">{label}</span>
    <span className="post-person-name">{name}</span>
    {person.role && <span className="post-person-role">{person.role}</span>}
  </div>;
};

export const PostCredits = ({ post }: { post: Post }) => {
  if (!post?.author?.name && !post?.reviewer?.name) return null;
  return <section className="editorial-container post-credits" aria-label="작성 정보">
    <PersonLine label="작성" person={post.author} />
    <PersonLine label="검토" person={post.reviewer} />
  </section>;
};

export const PostSources = ({ post }: { post: Post }) => {
  const sources = (post?.sources ?? []).filter(source => source?.title && isHttpUrl(source.url));
  if (!sources.length) return null;
  return <section className="editorial-container post-sources" aria-labelledby="post-sources-title">
    <h2 id="post-sources-title">출처</h2>
    <ol>{sources.map(source => <li key={source._key ?? source.url}>
      <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
      {source.checkedAt && <span className="post-source-date"> · {displayDate(source.checkedAt)} 확인</span>}
    </li>)}</ol>
  </section>;
};

export const PostRelated = ({ post }: { post: Post }) => {
  const services = (post?.relatedServices ?? []).map(slug => findService(slug)).filter(service => service !== undefined);
  const posts = (post?.relatedPosts ?? []).filter(item => item?.slug && item?.title);
  const projects = (post?.relatedProjects ?? []).filter(item => item?.slug && item?.title);
  if (!services.length && !posts.length && !projects.length) return null;
  return <section className="editorial-container post-related" aria-labelledby="post-related-title">
    <h2 id="post-related-title">함께 보면 좋은 내용</h2>
    {services.length > 0 && <div className="post-related-group"><h3>관련 서비스</h3><ul>{services.map(service => <li key={service.slug}><a href={serviceUrl(service.slug)} data-track="related_service" data-service={service.slug}>{service.title}</a></li>)}</ul></div>}
    {posts.length > 0 && <div className="post-related-group"><h3>관련 글</h3><ul>{posts.map(item => <li key={item.slug}><a href={`/blog/${encodeURIComponent(item.slug)}`} data-track="related_post">{item.title}</a></li>)}</ul></div>}
    {projects.length > 0 && <div className="post-related-group"><h3>관련 사례</h3><ul>{projects.map(item => <li key={item.slug}><a href={`/portfolio/${encodeURIComponent(item.slug)}`} data-track="related_project">{item.title}</a></li>)}</ul></div>}
  </section>;
};
