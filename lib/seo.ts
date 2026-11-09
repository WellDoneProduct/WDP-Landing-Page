import type { Metadata } from 'next';

export const SITE_URL = 'https://www.welldoneproduct.com';
// The isolated dev project also uses Vercel's production deployment target.
export const isIndexable = process.env.WDP_ENVIRONMENT === 'production'
  && process.env.NEXT_PUBLIC_SANITY_DATASET === 'production'
  && process.env.NODE_ENV === 'production'
  && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
export const organization = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
  name: '웰던프로덕트', legalName: '주식회사 웰던프로덕트', url: SITE_URL,
  logo: absoluteUrl('/Logo-primary.svg'), email: 'garry@welldoneproduct.com',
  address: {'@type': 'PostalAddress', streetAddress: '선유로49길 23, 7층 708호', addressLocality: '영등포구', addressRegion: '서울특별시', addressCountry: 'KR'},
};
export function pageMetadata(title: string, description: string, path: string, image = '/og-image.png'): Metadata {
  return {
    title, description, alternates: {canonical: absoluteUrl(path)},
    robots: {index: isIndexable, follow: isIndexable},
    openGraph: {type: 'website', siteName: '웰던프로덕트', locale: 'ko_KR', title, description, url: absoluteUrl(path), images: [{url: absoluteUrl(image)}]},
    twitter: {card: 'summary_large_image', title, description, images: [absoluteUrl(image)]},
  };
}
