import 'server-only';
import { createClient } from '@sanity/client';
import { cache } from 'react';
import { isIndexable } from './seo';
import { demoPosts, starterProjects, categories } from './demo-content';
import type { Post, Project, NewsItem } from './content-types';

const localDesignPreview = process.env.NODE_ENV === 'development' && process.env.WDP_LOCAL_DESIGN_PREVIEW === 'true';
const projectId = localDesignPreview ? undefined : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const isDesignPreview = !projectId && (process.env.NODE_ENV === 'development' || (process.env.WDP_ENVIRONMENT === 'development' && process.env.WDP_DESIGN_PREVIEW === 'true'));
const client = projectId ? createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development', apiVersion: '2026-11-06', perspective: 'published', useCdn: false, token: process.env.SANITY_API_READ_TOKEN }) : null;
const image = '{"url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}';
const body = `body[]{..., _type == "contentImage" => {image${image}}, _type == "imageGallery" => {images[]${image}}}`;
const postFields = `_id, _updatedAt, "slug": slug.current, title, "category": category->title, publishedAt, excerpt, thumbnail${image}, cover${image}`;
const projectFields = `_id, "slug": slug.current, title, category, service, "description": coalesce(description, ""), "period": coalesce(period, ""), "scope": coalesce(scope, ""), "client": coalesce(client, ""), "tags": coalesce(tags, []), order, "status": coalesce(status, "comingSoon"), thumbnail${image}, logo${image}, logoWidth, tint, heroImage${image}, heroMobileImage${image}, "overview": coalesce(overview, ""), "related": related[]._ref`;
const published = '!(_id in path("drafts.**"))';
const postVisibility = isIndexable ? ' && isTest != true && !(_id match "blog-*-test-*")' : '';
const options = { next: { revalidate: 30 } };
// A configured CMS failure must surface as an error, never as sample content.
export const getPosts = cache(async (): Promise<Post[]> => client ? client.fetch(`*[_type == "blogPost" && ${published}${postVisibility} && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc, _id asc) {${postFields}, "body": []}`, {}, options) : isDesignPreview ? demoPosts : []);
export const getPost = cache(async (slug: string): Promise<Post | undefined> => client ? client.fetch(`*[_type == "blogPost" && ${published}${postVisibility} && slug.current == $slug && publishedAt <= now()][0]{${postFields}, ${body}}`, { slug }, options) : isDesignPreview ? demoPosts.find(post => post.slug === slug) : undefined);
export const getCategories = cache(async (): Promise<string[]> => client ? client.fetch(`*[_type == "blogCategory" && ${published}] | order(order asc, title asc).title`, {}, options) : categories);
export const getProjects = cache(async (): Promise<Project[]> => client ? client.fetch(`*[_type == "project" && ${published} && defined(slug.current)] | order(order asc, _id asc) {${projectFields}, "body": []}`, {}, options) : starterProjects);
export const getProject = cache(async (slug: string): Promise<Project | undefined> => client ? client.fetch(`*[_type == "project" && ${published} && slug.current == $slug && status == "public"][0]{${projectFields}, ${body}}`, { slug }, options) : undefined);

export const getNews = cache(async (): Promise<NewsItem[]> => client ? client.fetch(`*[_type == "newsArticle" && ${published} && defined(url) && publishedAt <= now()] | order(publishedAt desc, _id asc) {_id, title, publishedAt, url, thumbnail${image}}`, {}, options) : []);
