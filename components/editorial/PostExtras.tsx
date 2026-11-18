import Link from 'next/link';
import { displayDate } from '@/lib/blog';
import { sanityImageUrl } from '@/lib/sanity-image';
import { findService, serviceUrl } from '@/lib/services';
import { titleText } from '@/lib/title-text';
import type { Post } from '@/lib/content-types';

// Default presentation for the blog credits, sources and related links. Markup carries data-track
// attributes so analytics can tell related-service clicks apart without changing the HTML later.
const isHttpUrl = (url?: string) => typeof url === 'string' && /^https?:\/\//i.test(url);

// Tags are labels only: there are no tag listing pages, so thin tag archives never get indexed.
export const postTags = (post: Post) => [...new Set((post?.tags ?? []).filter(tag => typeof tag === 'string').map(tag => tag.trim()).filter(Boolean))];

export const PostTags = ({ post }: { post: Post }) => {
  const tags = postTags(post);
  if (!tags.length) return null;
  return <section aria-label="태그"><ul className="post-tags">{tags.map(tag => <li key={tag}>#{tag}</li>)}</ul></section>;
};

export const PostCredits = ({ post }: { post: Post }) => {
  const author = post.author;
  if (!author?.name?.trim()) return null;
  return <aside className="post-author" aria-labelledby="post-author-name">
    {author.image?.url
      ? <img className="post-author-photo" src={sanityImageUrl(author.image.url, 160)} width={64} height={64} alt="" loading="lazy" decoding="async" />
      : <span className="post-author-photo post-author-initial" aria-hidden="true">{Array.from(author.name.trim())[0]}</span>}
    <div>
      <h2 id="post-author-name">{isHttpUrl(author.url) ? <a href={author.url}>{author.name}</a> : author.name}</h2>
      {author.role && <p className="post-author-role">{author.role}</p>}
      {author.bio && <p className="post-author-bio">{author.bio}</p>}
    </div>
  </aside>;
};

export const PostConsultation = ({ post }: { post: Post }) => {
  const consultation = post.consultation;
  if (!consultation?.enabled) return null;
  return <section className="post-consultation" aria-labelledby="post-consultation-title">
    <div>
      <h2 id="post-consultation-title">{consultation.title?.trim() || '우리 업무에 적용하고 싶으신가요?'}</h2>
      {consultation.description && <p>{consultation.description}</p>}
    </div>
    <Link className="wdp-contact" href="/#cta" prefetch={false}>{consultation.label?.trim() || '무료 상담 신청'}</Link>
  </section>;
};

export const PostSources = ({ post }: { post: Post }) => {
  const sources = (post?.sources ?? []).filter(source => source?.title && isHttpUrl(source.url));
  if (!sources.length) return null;
  return <section className="post-sources" aria-labelledby="post-sources-title">
    <h2 id="post-sources-title">출처</h2>
    <ol>{sources.map(source => <li key={source._key ?? source.url}>
      <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
      {source.checkedAt && <span className="post-source-date"> · {displayDate(source.checkedAt)} 확인</span>}
    </li>)}</ol>
  </section>;
};

export const PostRelated = ({ post }: { post: Post }) => {
  const services = (post?.relatedServices ?? []).map(slug => findService(slug)).filter(service => service !== undefined);
  const posts = (post?.relatedPosts ?? []).filter(item => item?.slug && item.slug !== post.slug && item?.title);
  const projects = (post?.relatedProjects ?? []).filter(item => item?.slug && item?.title);
  const news = (post.relatedNews ?? []).filter(item => item?.title && isHttpUrl(item.url));
  if (!services.length && !posts.length && !projects.length && !news.length) return null;
  return <section className="post-related" aria-labelledby="post-related-title">
    <h2 id="post-related-title">함께 보면 좋은 콘텐츠</h2>
    {services.length > 0 && <div className="post-related-group"><h3>관련 서비스</h3><ul>{services.map(service => <li key={service.slug}><a href={serviceUrl(service.slug)} data-track="related_service" data-service={service.slug}>{service.title}</a></li>)}</ul></div>}
    {posts.length > 0 && <div className="post-related-group"><h3>블로그</h3><ul>{posts.map(item => <li key={item.slug}><a href={`/blog/${encodeURIComponent(item.slug)}`} data-track="related_post">{titleText(item.title)}</a></li>)}</ul></div>}
    {projects.length > 0 && <div className="post-related-group"><h3>포트폴리오</h3><ul>{projects.map(item => <li key={item.slug}><a href={`/portfolio/${encodeURIComponent(item.slug)}`} data-track="related_project">{titleText(item.title)}</a></li>)}</ul></div>}
    {news.length > 0 && <div className="post-related-group"><h3>언론 보도</h3><ul>{news.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">{titleText(item.title)}</a></li>)}</ul></div>}
  </section>;
};
