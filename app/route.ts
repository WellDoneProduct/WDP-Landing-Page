import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL, organization, jsonLd } from '@/lib/seo';

export const dynamic = 'force-static';

const source = fs.readFileSync(
  path.join(process.cwd(), 'public/Architect.html'),
  'utf-8',
);
const html = source.replace('</head>', `<link rel="canonical" href="${SITE_URL}/" /><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}" /><script type="application/ld+json">${jsonLd(organization)}</script></head>`);

export const GET = () =>
  new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=31536000, must-revalidate',
    },
  });
