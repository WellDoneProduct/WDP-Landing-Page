import type { MetadataRoute } from 'next';
import { isIndexable, SITE_URL } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return isIndexable
    ? {rules: {userAgent: '*', allow: '/', disallow: ['/studio/', '/design-preview/', '/api/']}, sitemap: `${SITE_URL}/sitemap.xml`}
    : {rules: {userAgent: '*', disallow: '/'}};
}
