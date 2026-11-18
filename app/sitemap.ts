import type { MetadataRoute } from 'next';
import { getPosts, getProjects } from '@/lib/content';
import { absoluteUrl, isIndexable } from '@/lib/seo';
import { SERVICES, serviceUrl } from '@/lib/services';
export const dynamic = 'force-static';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never advertise test or development CMS URLs to search engines.
  if (!isIndexable) return [];
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  return [
    ...['/', '/blog', '/portfolio', '/news', ...SERVICES.map(service => serviceUrl(service.slug))].map(path => ({url: absoluteUrl(path)})),
    ...posts.map(post => ({url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.contentUpdatedAt || post.publishedAt})),
    ...projects.filter(project => project.status === 'public').map(project => ({url: absoluteUrl(`/portfolio/${project.slug}`)})),
  ];
}
