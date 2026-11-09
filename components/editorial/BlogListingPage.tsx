import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import BlogList from '@/components/editorial/BlogList';
import { blogUrl, filterPosts, listingTitle, pageCount, POSTS_PER_PAGE } from '@/lib/blog';
import JsonLd from '@/components/editorial/JsonLd';
import { getPosts, getCategories } from '@/lib/content';
import { pageMetadata, absoluteUrl } from '@/lib/seo';

// Shared by /blog, /blog/page/[page], /blog/category/[category], /blog/category/[category]/page/[page].
// All four are statically generated at build time and refreshed by the Sanity → Vercel Deploy Hook.

const decodeParam = (value: string) => {
  try { return decodeURIComponent(value); } catch { return value; }
};

export const parsePage = (value?: string) => {
  if (value === undefined) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && String(page) === value ? page : NaN;
};

const loadListing = async (rawCategory: string, page: number) => {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const active = decodeParam(rawCategory);
  if (active !== 'All' && !(categories ?? []).includes(active)) notFound();
  const filtered = filterPosts(posts, active);
  if (Number.isNaN(page) || page > pageCount(filtered.length)) notFound();
  return { active, page, posts: posts ?? [], categories: categories ?? [], filtered };
};

export const listingMetadata = async (category: string, page: number) => {
  const { active } = await loadListing(category, page);
  return pageMetadata(listingTitle(active, page), `웰던프로덕트의 ${active === 'All' ? 'AI 개발, 프론트엔드·백엔드 개발, PM과 디자인' : active} 인사이트를 만나보세요. 실제 서비스를 만드는 과정에서 얻은 경험과 업무 자동화 노하우를 공유합니다.`, blogUrl(active, page));
};

// Params for generateStaticParams: every category, and every page beyond the first.
export const categoryParams = async () => ((await getCategories()) ?? []).map(category => ({ category }));
export const pageParams = async (category = 'All') => {
  const total = pageCount(filterPosts((await getPosts()) ?? [], category).length);
  return Array.from({ length: total - 1 }, (_, index) => ({ page: String(index + 2) }));
};

export const BlogListingPage = async ({ category, page }: { category: string; page: number }) => {
  const { active, posts, categories, filtered } = await loadListing(category, page);
  return <><SiteHeader /><main><JsonLd data={{'@context': 'https://schema.org', '@type': 'Blog', name: '웰던프로덕트 블로그', url: absoluteUrl(blogUrl(active, page)), mainEntity: {'@type': 'ItemList', itemListElement: filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map((post, index) => ({'@type': 'ListItem', position: (page - 1) * POSTS_PER_PAGE + index + 1, name: post.title, url: absoluteUrl(`/blog/${post.slug}`)}))}}} /><div className="editorial-container listing-title"><h1><span className="sr-only">웰던프로덕트 블로그 · AI 개발·PM·디자인 인사이트 · </span>Meet our<br />log and insights</h1></div><BlogList posts={posts} categories={categories} active={active} page={page} /></main></>;
};
