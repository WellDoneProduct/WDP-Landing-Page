import Link from 'next/link';
import type { Post } from '@/lib/content-types';
import { HoverPrefetchLink } from './HoverPrefetchLink';

export const POSTS_PER_PAGE = 6;
export function displayDate(date: string) { return (date ?? '').slice(0, 10).replaceAll('-', '.'); }
// Path-based URLs so every listing is statically generated (searchParams would force dynamic rendering).
export function blogUrl(category = 'All', page = 1) {
  const base = category === 'All' ? '/blog' : `/blog/category/${encodeURIComponent(category)}`;
  return page > 1 ? `${base}/page/${page}` : base;
}
export const filterPosts = (posts: Post[], category: string) => (posts ?? []).filter(post => category === 'All' || post?.category === category);
export const pageCount = (count: number) => Math.max(1, Math.ceil(count / POSTS_PER_PAGE));

export default function BlogList({posts, categories, active = 'All', page = 1}: {posts: Post[]; categories: string[]; active?: string; page?: number}) {
  const filtered = filterPosts(posts, active);
  const total = Math.ceil(filtered.length / POSTS_PER_PAGE);
  // Filters and pagination load only on click; post cards prefetch on hover/touch/focus. Initial visit fires no prefetch.
  return <>
    <nav className="blog-filters" aria-label="블로그 카테고리"><div className="editorial-container filter-scroll">{['All', ...(categories ?? [])].map(category => <Link key={category} href={blogUrl(category)} prefetch={false} aria-current={active === category ? 'page' : undefined}>{category}</Link>)}</div></nav>
    <div className="editorial-container blog-list"><div className="blog-grid">{filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map(post => <HoverPrefetchLink className="blog-card" href={`/blog/${post.slug}`} key={post._id}><div className="blog-thumbnail">{post.thumbnail?.url && <img src={post.thumbnail.url} alt={post.thumbnail.alt?.trim() || post.title} />}</div><h2>{post.title}</h2><div className="blog-card-meta"><span>{post.category}</span><time dateTime={post.publishedAt}>{displayDate(post.publishedAt)}</time></div></HoverPrefetchLink>)}</div>
    {!filtered.length && <p className="content-empty" role="status">아직 게시된 글이 없습니다.</p>}
    {total > 1 && <nav className="blog-pagination" aria-label="블로그 페이지">{page > 1 && <Link href={blogUrl(active, page - 1)} prefetch={false}>이전</Link>}{Array.from({length: total}, (_, index) => index + 1).map(number => <Link key={number} href={blogUrl(active, number)} prefetch={false} aria-current={page === number ? 'page' : undefined}>{number}</Link>)}{page < total && <Link href={blogUrl(active, page + 1)} prefetch={false}>다음</Link>}</nav>}
    </div>
  </>;
}
