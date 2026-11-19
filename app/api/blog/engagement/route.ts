import { unstable_cache } from 'next/cache';
import { getPosts } from '@/lib/content';
import { POSTS_PER_PAGE } from '@/lib/blog';
import { readEngagement, recordView } from '@/lib/blog-engagement';

const publishedPosts = unstable_cache(async () => (await getPosts()).map(({ _id }) => _id),
  ['blog-engagement-post-ids-v1', process.env.NEXT_PUBLIC_SANITY_DATASET || 'local'], { revalidate: 60 });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && URL.parse(origin)?.host !== request.headers.get('host')) return new Response(null, { status: 403 });
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return new Response(null, { status: 415 });
  const data = await request.json().catch(() => null);
  const validPost = (id: unknown) => typeof id === 'string' && id.length > 0 && id.length <= 128;
  const validReader = (id: unknown) => typeof id === 'string' && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
  try {
    if (data?.action === 'read') {
      const items = data.items;
      if (!Array.isArray(items) || !items.length || items.length > POSTS_PER_PAGE ||
          !items.every(item => validPost(item?.post))) {
        return new Response(null, { status: 400 });
      }
      const published = new Set(await publishedPosts());
      const allowed = items.map((item: {post: string}) => item.post).filter((post: string) => published.has(post));
      return Response.json(allowed.length ? await readEngagement(allowed) : {}, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!validPost(data?.post) || !validReader(data.reader) || data.action !== 'view') {
      return new Response(null, { status: 400 });
    }
    if (!(await publishedPosts()).includes(data.post)) return new Response(null, { status: 404 });
    return Response.json(await recordView(data.post, data.reader), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('[blog engagement] Could not read or update counters');
    return new Response(null, { status: 503 });
  }
}
