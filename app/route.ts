import fs from 'node:fs';
import path from 'node:path';
import { getProjects } from '@/lib/content';
import { homeProjectCards } from '@/lib/home-project-cards';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL, organization, jsonLd } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 300;

export const GET = async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'public/ai-native.html'),
    'utf-8',
  );
  const html = source.replace('</head>', `<link rel="canonical" href="${SITE_URL}/" /><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}" /><script type="application/ld+json">${jsonLd(organization)}</script></head>`);

  return new NextResponse(html.replace('<!-- HOME_PROJECT_CARDS -->', homeProjectCards(await getProjects())), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate',
    },
  });
};
