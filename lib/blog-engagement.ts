import 'server-only';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient, type SanityClient } from '@sanity/client';

export type BlogReader = { post: string; reader: string | null };
type Action = 'view' | 'like' | 'unlike';
type Counts = { views: number; likes: number; liked: boolean };

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
// The Sheets implementation used the same digest, so existing browsers retain their likes.
const readerKey = (post: string, reader: string) => hash(post + ':' + reader);
const emptyCounts = (): Counts => ({ views: 0, likes: 0, liked: false });
const uncached = { cache: 'no-store' as const };

let client: SanityClient | undefined;
function store() {
  if (client) return client;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_BLOG_WRITE_TOKEN;
  if (!projectId || !dataset || !token) throw new Error('Blog metrics configuration missing');
  client = createClient({ projectId, dataset, token, apiVersion: '2026-11-06', useCdn: false, perspective: 'published' });
  return client;
}

export async function readEngagement(items: BlogReader[]): Promise<Record<string, Counts>> {
  const posts = items.map(item => item.post);
  const keys = items.flatMap(({ post, reader }) => reader ? [readerKey(post, reader)] : []);
  const rows = await store().fetch<(Counts & { postId: string })[]>(
    `*[_type == "blogMetricBucket" && postId in $posts]{
      postId, views, likes, "liked": count(likedReaders[_key in $keys]) > 0
    }`, { posts, keys }, uncached);
  const totals = Object.fromEntries(posts.map(post => [post, emptyCounts()]));
  for (const row of rows) {
    totals[row.postId].views += row.views;
    totals[row.postId].likes += row.likes;
    totals[row.postId].liked ||= row.liked;
  }
  return totals;
}

type ReaderState = { _rev: string; day: string; seen: boolean; liked: boolean };
const stateQuery = `*[_id == $id][0]{
  _rev, day, "seen": $key in readersToday, "liked": count(likedReaders[_key == $key]) > 0
}`;

export async function updateEngagement(post: string, reader: string, action: Action): Promise<Counts> {
  const db = store();
  const key = readerKey(post, reader);
  // Up to 16 private documents per post. Only today's view keys and active likes are retained.
  const id = 'blog-metrics.' + hash(post) + '.' + key[0];
  for (let attempt = 0; ; attempt++) {
    const state = await db.fetch<ReaderState | null>(stateQuery, { id, key }, uncached);
    const day = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
    const alreadySeen = state?.day === day && state.seen;
    if (action === 'view' ? alreadySeen : Boolean(state?.liked) === (action === 'like')) break;
    const tx = db.transaction();
    if (!state) tx.create({ _id: id, _type: 'blogMetricBucket', postId: post, views: 0, likes: 0,
      day, readersToday: [], likedReaders: [] });
    tx.patch(id, patch => {
      if (state) patch.ifRevisionId(state._rev);
      if (action === 'view') {
        if (state?.day === day) patch.append('readersToday', [key]);
        else patch.set({ day, readersToday: [key] });
        return patch.inc({ views: 1 });
      }
      if (action === 'like') return patch.append('likedReaders', [{ _key: key, _type: 'blogLike' }]).inc({ likes: 1 });
      return patch.unset([`likedReaders[_key=="${key}"]`]).dec({ likes: 1 });
    });
    try {
      await tx.commit({ visibility: 'sync', returnDocuments: false });
      break;
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode !== 409 || attempt >= 5) throw error;
      await delay(20 * 2 ** attempt + Math.random() * 30);
    }
  }
  return (await readEngagement([{ post, reader }]))[post];
}
