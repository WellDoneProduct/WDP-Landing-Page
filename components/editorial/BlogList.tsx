'use client';

import { useEffect, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import type { Post } from '@/lib/content-types';
import { blogUrl, displayDate, filterPosts, listingTitle, parseBlogPath, POSTS_PER_PAGE } from '@/lib/blog';
import { HoverPrefetchLink } from './HoverPrefetchLink';

type Props = { posts: Post[]; categories: string[]; active?: string; page?: number };

// Plain clicks switch category/page in the browser: the full post list is already on the page,
// so filtering is instant with zero requests. pushState keeps the URL, back/forward and
// usePathname in sync (Next.js integrates the native History API). Each listing URL is still a
// static page, so reloads, new tabs and crawlers get the server-rendered version.
const isPlainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

// Client-side switches skip generateMetadata, so keep the tab title in step with the URL.
const setDocumentTitle = (title: string) => { document.title = title; };

export default function BlogList({ posts, categories, active: initialActive = 'All', page: initialPage = 1 }: Props) {
  const pathname = usePathname();
  const allCategories = ['All', ...(categories ?? [])];
  const parsed = parseBlogPath(pathname);
  const active = parsed && allCategories.includes(parsed.category) ? parsed.category : initialActive;
  const filtered = filterPosts(posts, active);
  const total = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const page = parsed && parsed.category === active && parsed.page <= Math.max(1, total) ? parsed.page : initialPage;

  useEffect(() => { setDocumentTitle(listingTitle(active, page)); }, [active, page]);

  const go = (href: string, scrollToList: boolean) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (href !== pathname) window.history.pushState(null, '', href);
    if (scrollToList) document.querySelector('.blog-filters')?.scrollIntoView({ block: 'start' });
  };

  return <>
    <nav className="blog-filters" aria-label="블로그 카테고리"><div className="editorial-container filter-scroll">{allCategories.map(category => { const href = blogUrl(category); return <a key={category} href={href} onClick={go(href, false)} aria-current={active === category ? 'page' : undefined}>{category}</a>; })}</div></nav>
    <div className="editorial-container blog-list"><div className="blog-grid">{filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map(post => <HoverPrefetchLink className="blog-card" href={`/blog/${post.slug}`} key={post._id}><div className="blog-thumbnail">{post.thumbnail?.url && <img src={post.thumbnail.url} alt={post.thumbnail.alt?.trim() || post.title} />}</div><h2>{post.title}</h2><div className="blog-card-meta"><span>{post.category}</span><time dateTime={post.publishedAt}>{displayDate(post.publishedAt)}</time></div></HoverPrefetchLink>)}</div>
    {!filtered.length && <p className="content-empty" role="status">아직 게시된 글이 없습니다.</p>}
    {total > 1 && <nav className="blog-pagination" aria-label="블로그 페이지">{page > 1 && <a href={blogUrl(active, page - 1)} onClick={go(blogUrl(active, page - 1), true)}>이전</a>}{Array.from({length: total}, (_, index) => index + 1).map(number => <a key={number} href={blogUrl(active, number)} onClick={go(blogUrl(active, number), true)} aria-current={page === number ? 'page' : undefined}>{number}</a>)}{page < total && <a href={blogUrl(active, page + 1)} onClick={go(blogUrl(active, page + 1), true)}>다음</a>}</nav>}
    </div>
  </>;
}
