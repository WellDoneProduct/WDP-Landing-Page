import { titleText } from '@/lib/title-text';
import JsonLd from '@/components/editorial/JsonLd';
import { pageMetadata, absoluteUrl, SITE_URL } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import ContentBody from '@/components/editorial/ContentBody';
import { getPost, getPosts } from '@/lib/content';
import { displayDate } from '@/lib/blog';
import { sanityImageUrl, sanitySrcSet } from '@/lib/sanity-image';
import PostNavigation from '@/components/editorial/PostNavigation';
import { PostConsultation, PostCredits, PostRelated, PostSources, PostTags, postTags } from '@/components/editorial/PostExtras';
import type { Post } from '@/lib/content-types';

type Props = { params: Promise<{ slug: string }> };

// "Last modified" is the editor-set content date, not Sanity's _updatedAt (which moves on any save).
const modifiedAt = (post: Post) => post.contentUpdatedAt || post.publishedAt;
const shareImage = (post: Post) => sanityImageUrl((post.ogImage ?? post.cover ?? post.thumbnail)?.url, 1200) || undefined;
const describe = (post: Post) => post.seoDescription || post.excerpt || (post.body ?? []).filter(block => block?._type === 'block').map(block => (block.children ?? []).map(span => span?.text ?? '').join('')).join(' ').slice(0, 160);

// Built at deploy time; new posts arrive through the Sanity → Vercel Deploy Hook rebuild.
export const dynamicParams = false;
export const generateStaticParams = async () => ((await getPosts()) ?? []).filter(post => post?.slug).map(post => ({ slug: post.slug }));
export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) return {title: '글을 찾을 수 없습니다', robots: {index: false}};
  const meta = pageMetadata(post.seoTitle || `${titleText(post.title)} | 웰던프로덕트`, describe(post), `/blog/${post.slug}`, shareImage(post));
  return {...meta, openGraph: {...meta.openGraph, type: 'article' as const, publishedTime: post.publishedAt, modifiedTime: modifiedAt(post), authors: post.author?.name ? [post.author.name] : undefined}};
}
export default async function BlogDetail({ params }: Props) {
  const post = await getPost((await params).slug); if (!post) notFound();
  const posts = await getPosts();
  const index = posts.findIndex(item => item._id === post._id);
  const previous = index >= 0 ? posts[index + 1] : undefined;
  const next = index > 0 ? posts[index - 1] : undefined;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const updated = post.contentUpdatedAt && displayDate(post.contentUpdatedAt) !== displayDate(post.publishedAt) ? post.contentUpdatedAt : undefined;
  const author = post.author?.name
    ? {'@type': 'Person', name: post.author.name, jobTitle: post.author.role || undefined, url: post.author.url || undefined, worksFor: {'@id': `${SITE_URL}/#organization`}}
    : {'@type': 'Organization', name: '웰던프로덕트', url: SITE_URL};
  const citations = (post.sources ?? []).filter(source => source?.title && source?.url).map(source => ({'@type': 'CreativeWork', name: source.title, url: source.url}));
  return <><SiteHeader theme="hero" /><main><JsonLd data={{'@context': 'https://schema.org', '@graph': [
    {'@type': 'BlogPosting', headline: titleText(post.title), datePublished: post.publishedAt, dateModified: modifiedAt(post), description: describe(post), image: shareImage(post), mainEntityOfPage: url, author, publisher: {'@id': `${SITE_URL}/#organization`}, citation: citations.length ? citations : undefined, keywords: postTags(post).length ? postTags(post).join(', ') : undefined},
    {'@type': 'BreadcrumbList', itemListElement: [{name: '홈', item: absoluteUrl('/')}, {name: '블로그', item: absoluteUrl('/blog')}, {name: titleText(post.title), item: url}].map((item, index) => ({'@type': 'ListItem', position: index + 1, ...item}))}
  ]}} /><article>
    <header className="blog-hero" data-dark-hero>{post.cover?.url && <img className="blog-hero-background" src={sanityImageUrl(post.cover.url, 1600)} srcSet={sanitySrcSet(post.cover.url, [768, 1200, 1600, 2400])} sizes="100vw" alt="" fetchPriority="high" decoding="async" />}
      <div className="editorial-container blog-hero-text"><h1>{titleText(post.title)}</h1>
        <div className="post-byline">
          {post.category && <span>{post.category}</span>}
          {post.author?.name && <span>{post.author.name}</span>}
        </div>
        <div className="post-dates">
          <span>최초 게시 <time dateTime={post.publishedAt}>{displayDate(post.publishedAt)}</time></span>
          {updated && <span>수정 <time dateTime={updated}>{displayDate(updated)}</time></span>}
        </div>
      </div>
    </header>
    <div className="editorial-container blog-body rich-content" data-analytics-content-body={post._id}><ContentBody blocks={post.body} /></div>
    <div className="editorial-container post-extras">
      <PostTags post={post} />
      <PostSources post={post} />
      <PostCredits post={post} />
      <PostConsultation post={post} />
      <PostRelated post={post} />
    </div>
    <PostNavigation previous={previous} next={next} />
  </article></main></>;
}
