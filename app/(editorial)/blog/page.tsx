import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import BlogList, {blogUrl} from '@/components/editorial/BlogList';
import JsonLd from '@/components/editorial/JsonLd';
import { getPosts, getCategories } from '@/lib/content';
import { pageMetadata, absoluteUrl } from '@/lib/seo';

type Props = {searchParams: Promise<{category?: string | string[]; page?: string | string[]}>};
async function selection(searchParams: Props['searchParams']) {
  const [query, posts, categories] = await Promise.all([searchParams, getPosts(), getCategories()]);
  const active = typeof query.category === 'string' ? query.category : 'All';
  const page = query.page === undefined ? 1 : Number(query.page);
  if ((active !== 'All' && !categories.includes(active)) || !Number.isInteger(page) || page < 1 || Array.isArray(query.page) || Array.isArray(query.category)) notFound();
  const filtered = posts.filter(post => active === 'All' || post.category === active);
  if (page > Math.max(1, Math.ceil(filtered.length / 6))) notFound();
  return {active, page, posts, categories, filtered};
}
export async function generateMetadata({searchParams}: Props) {
  const {active, page} = await selection(searchParams);
  return pageMetadata(`${active === 'All' ? '블로그' : `${active} 블로그`}${page > 1 ? ` · ${page}페이지` : ''} | 웰던프로덕트`, `웰던프로덕트의 ${active === 'All' ? 'AI 개발, 프론트엔드·백엔드 개발, PM과 디자인' : active} 인사이트를 만나보세요. 실제 서비스를 만드는 과정에서 얻은 경험과 업무 자동화 노하우를 공유합니다.`, blogUrl(active, page));
}
export default async function BlogPage({searchParams}: Props) {
  const {active, page, posts, categories, filtered} = await selection(searchParams);
  return <><SiteHeader /><main><JsonLd data={{'@context': 'https://schema.org', '@type': 'Blog', name: '웰던프로덕트 블로그', url: absoluteUrl(blogUrl(active, page)), mainEntity: {'@type': 'ItemList', itemListElement: filtered.slice((page - 1) * 6, page * 6).map((post, index) => ({'@type': 'ListItem', position: (page - 1) * 6 + index + 1, name: post.title, url: absoluteUrl(`/blog/${post.slug}`)}))}}} /><div className="editorial-container listing-title"><h1><span className="sr-only">웰던프로덕트 블로그 · AI 개발·PM·디자인 인사이트 · </span>Meet our<br />log and insights</h1></div><BlogList posts={posts} categories={categories} active={active} page={page} /></main></>;
}
