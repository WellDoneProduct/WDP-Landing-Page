import 'server-only';
import { createClient } from '@sanity/client';
import { cache } from 'react';
import { isIndexable } from './seo';
import { demoPosts, starterProjects, categories } from './demo-content';
import { withHighlightedCode } from './highlight-code';
import type { Post, Project, NewsItem } from './content-types';

const localDesignPreview = process.env.NODE_ENV === 'development' && process.env.WDP_LOCAL_DESIGN_PREVIEW === 'true';
const projectId = localDesignPreview ? undefined : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isDesignPreview = !projectId && (process.env.NODE_ENV === 'development' || (process.env.WDP_ENVIRONMENT === 'development' && process.env.WDP_DESIGN_PREVIEW === 'true'));
const client = projectId ? createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development', apiVersion: '2026-11-06', perspective: 'published', useCdn: false, token: process.env.SANITY_API_READ_TOKEN }) : null;
const image = '{"url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}';
const body = `body[]{..., _type == "contentImage" => {image${image}}, _type == "imageGallery" => {images[]${image}}}`;
const postFields = `_id, _updatedAt, "slug": slug.current, title, "category": category->title, publishedAt, contentUpdatedAt, excerpt, thumbnail${image}, cover${image}`;
const person = `{name, role, image${image}, bio, url}`;
const projectFields = `_id, "slug": slug.current, title, category, service, "description": coalesce(description, ""), "period": coalesce(period, ""), "scope": coalesce(scope, ""), "client": coalesce(client, ""), "tags": coalesce(tags, []), order, "status": coalesce(status, "comingSoon"), thumbnail${image}, logo${image}, logoWidth, tint, heroImage${image}, heroMobileImage${image}, "overview": coalesce(overview, ""), "related": related[]._ref`;
const published = '!(_id in path("drafts.**"))';
const postVisibility = isIndexable ? ' && isTest != true && !(_id match "blog-*-test-*")' : '';
// Detail-only fields stay out of getPosts so the listing payload (sent to the client filter) stays small.
// Related content reuses the public filters, so drafts, test posts and locked projects never link out.
const postDetailFields = `
  tags, author->${person}, sources[]{_key, title, url, checkedAt}, relatedServices,
  consultation{enabled, title, description, label}, seoTitle, seoDescription, ogImage${image},
  "relatedPosts": *[_type == "blogPost" && _id in ^.relatedPosts[]._ref && ${published}${postVisibility} && defined(slug.current) && publishedAt <= now()]{"slug": slug.current, title},
  "relatedProjects": *[_type == "project" && _id in ^.relatedProjects[]._ref && ${published} && status == "public" && defined(slug.current)]{"slug": slug.current, title},
  "relatedNews": *[_type == "newsArticle" && _id in ^.relatedNews[]._ref && ${published} && defined(url) && publishedAt <= now()]{title, url}
`;
// Pages are prerendered at build and rebuilt by the Sanity → Vercel Deploy Hook on publish.
// no-store keeps Sanity results out of the Data Cache, which persists across deployments and would
// otherwise feed a stale response into the next build. Routes stay static via `dynamic = 'force-static'`.
const options = { cache: 'no-store' as const };
// A configured CMS failure must surface as an error, never as sample content.
export const getPosts = cache(async (): Promise<Post[]> => client ? client.fetch(`*[_type == "blogPost" && ${published}${postVisibility} && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc, _id asc) {${postFields}, "body": []}`, {}, options) : isDesignPreview ? demoPosts : []);
export const getPost = cache(async (slug: string): Promise<Post | undefined> => {
  if (!client) {
    const preview = isDesignPreview ? demoPosts.find(post => post.slug === slug) : undefined;
    return preview ? { ...preview, body: await withHighlightedCode(preview.body) } : undefined;
  }
  const post: Post | null = await client.fetch(`*[_type == "blogPost" && ${published}${postVisibility} && slug.current == $slug && publishedAt <= now()][0]{${postFields}, ${postDetailFields}, ${body}}`, { slug }, options);
  return post ? { ...post, body: await withHighlightedCode(post.body) } : undefined;
});
export const getCategories = cache(async (): Promise<string[]> => client ? client.fetch(`*[_type == "blogCategory" && ${published}] | order(order asc, title asc).title`, {}, options) : categories);
export const getProjects = cache(async (): Promise<Project[]> => {
  if (!client) return starterProjects;
  const projects: Project[] = await client.fetch(`*[_type == "project" && ${published} && defined(slug.current)] | order(order asc, _id asc) {${projectFields}, "body": []}`, {}, options);
  // Keep the existing portfolio cards until production portfolio content is published.
  return projects.length || process.env.NEXT_PUBLIC_SANITY_DATASET !== 'production' ? projects : starterProjects;
});
export const getProject = cache(async (slug: string): Promise<Project | undefined> => {
  if (!client) return undefined;
  const project: Project | null = await client.fetch(`*[_type == "project" && ${published} && slug.current == $slug && status == "public"][0]{${projectFields}, ${body}}`, { slug }, options);
  return project ? { ...project, body: await withHighlightedCode(project.body) } : undefined;
});

export const getNews = cache(async (): Promise<NewsItem[]> => client ? client.fetch(`*[_type == "newsArticle" && ${published} && defined(url) && publishedAt <= now()] | order(publishedAt desc, _id asc) {_id, title, publishedAt, url, thumbnail${image}}`, {}, options) : []);
