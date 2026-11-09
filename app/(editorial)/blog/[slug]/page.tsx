import JsonLd from '@/components/editorial/JsonLd';
import { pageMetadata, absoluteUrl, SITE_URL } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import ContentBody from '@/components/editorial/ContentBody';
import { getPost, getPosts } from '@/lib/content';
import PostNavigation from '@/components/editorial/PostNavigation';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) return {title: '글을 찾을 수 없습니다', robots: {index: false}};
  const description = post.excerpt || post.body.filter(block => block._type === 'block').map(block => block.children.map(span => span.text).join('')).join(' ').slice(0, 160);
  const meta = pageMetadata(`${post.title} | 웰던프로덕트`, description, `/blog/${post.slug}`, post.cover?.url || post.thumbnail?.url);
  return {...meta, openGraph: {...meta.openGraph, type: 'article' as const, publishedTime: post.publishedAt, modifiedTime: post._updatedAt || post.publishedAt}};
}
export default async function BlogDetail({ params }: Props) {
  const post = await getPost((await params).slug); if (!post) notFound();
  const posts = await getPosts();
  const index = posts.findIndex(item => item._id === post._id);
  const previous = index >= 0 ? posts[index + 1] : undefined;
  const next = index > 0 ? posts[index - 1] : undefined;
  return <><SiteHeader theme="hero" /><main><JsonLd data={{'@context': 'https://schema.org', '@graph': [
    {'@type': 'BlogPosting', headline: post.title, datePublished: post.publishedAt, dateModified: post._updatedAt || post.publishedAt, description: post.excerpt, image: post.cover?.url || post.thumbnail?.url, mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`), author: {'@type': 'Organization', name: '웰던프로덕트', url: SITE_URL}, publisher: {'@id': `${SITE_URL}/#organization`}},
    {'@type': 'BreadcrumbList', itemListElement: [{name: '홈', item: absoluteUrl('/')}, {name: '블로그', item: absoluteUrl('/blog')}, {name: post.title, item: absoluteUrl(`/blog/${post.slug}`)}].map((item, index) => ({'@type': 'ListItem', position: index + 1, ...item}))}
  ]}} /><article><header className="blog-hero" data-dark-hero>{post.cover && <img className="blog-hero-background" src={post.cover.url} alt="" />}<div className="editorial-container blog-hero-text"><h1>{post.title}</h1><div><span>{post.category}</span><time dateTime={post.publishedAt}>{post.publishedAt.slice(0, 10).replaceAll('-', '.')}</time></div></div></header><div className="editorial-container blog-body rich-content"><ContentBody blocks={post.body} /></div><PostNavigation previous={previous} next={next} /></article></main></>;
}
