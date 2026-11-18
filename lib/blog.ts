import type { Post } from './content-types';

// Shared by the server listing pages and the client-side BlogList filter.
export const POSTS_PER_PAGE = 6;

export const displayDate = (date?: string) => (date ?? '').slice(0, 10).replaceAll('-', '.');

// Path-based URLs so every listing is statically generated (searchParams would force dynamic rendering).
export const blogUrl = (category = 'All', page = 1) => {
  const base = category === 'All' ? '/blog' : `/blog/category/${encodeURIComponent(category)}`;
  return page > 1 ? `${base}/page/${page}` : base;
};

export const filterPosts = (posts: Post[], category: string) =>
  (posts ?? []).filter(post => category === 'All' || post?.category === category);

export const pageCount = (count: number) => Math.max(1, Math.ceil(count / POSTS_PER_PAGE));

const decode = (value: string) => {
  try { return decodeURIComponent(value); } catch { return value; }
};

// Inverse of blogUrl. Returns null for paths that are not a blog listing.
export const parseBlogPath = (pathname: string): { category: string; page: number } | null => {
  const match = /^\/blog(?:\/category\/([^/]+))?(?:\/page\/(\d+))?\/?$/.exec(pathname ?? '');
  if (!match) return null;
  const page = match[2] ? Number(match[2]) : 1;
  return { category: match[1] ? decode(match[1]) : 'All', page: Number.isInteger(page) && page >= 1 ? page : 1 };
};

export const listingTitle = (category: string, page: number) =>
  `${category === 'All' ? '블로그' : `${category} 블로그`}${page > 1 ? ` · ${page}페이지` : ''} | 웰던프로덕트`;
