import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const html = fs.readFileSync(
  path.join(process.cwd(), 'public/Architect.html'),
  'utf-8',
);

export const GET = () =>
  new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=31536000, must-revalidate',
    },
  });
