import Link from 'next/link';
import type { Post } from '@/lib/content-types';
export function displayDate(date: string) { return date.slice(0, 10).replaceAll('-', '.'); }
export function blogUrl(category = 'All', page = 1) {
  const query = new URLSearchParams();
  if (category !== 'All') query.set('category', category);
  if (page > 1) query.set('page', String(page));
  return `/blog${query.size ? `?${query}` : ''}`;
}
export default function BlogList({posts, categories, active = 'All', page = 1}: {posts: Post[]; categories: string[]; active?: string; page?: number}) {
  const filtered = posts.filter(post => active === 'All' || post.category === active);
  const total = Math.ceil(filtered.length / 6);
  return <>
    <nav className="blog-filters" aria-label="블로그 카테고리"><div className="editorial-container filter-scroll">{['All', ...categories].map(category => <Link key={category} href={blogUrl(category)} aria-current={active === category ? 'page' : undefined}>{category}</Link>)}</div></nav>
    <div className="editorial-container blog-list"><div className="blog-grid">{filtered.slice((page - 1) * 6, page * 6).map(post => <Link className="blog-card" href={`/blog/${post.slug}`} key={post._id}><div className="blog-thumbnail">{post.thumbnail && <img src={post.thumbnail.url} alt={post.thumbnail.alt?.trim() || post.title} />}</div><h2>{post.title}</h2><div className="blog-card-meta"><span>{post.category}</span><time dateTime={post.publishedAt}>{displayDate(post.publishedAt)}</time></div></Link>)}</div>
    {!filtered.length && <p className="content-empty" role="status">아직 게시된 글이 없습니다.</p>}
    {total > 1 && <nav className="blog-pagination" aria-label="블로그 페이지">{page > 1 && <Link href={blogUrl(active, page - 1)}>이전</Link>}{Array.from({length: total}, (_, index) => index + 1).map(number => <Link key={number} href={blogUrl(active, number)} aria-current={page === number ? 'page' : undefined}>{number}</Link>)}{page < total && <Link href={blogUrl(active, page + 1)}>다음</Link>}</nav>}
    </div>
  </>;
}
