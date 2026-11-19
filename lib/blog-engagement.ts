import 'server-only';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient, type SanityClient } from '@sanity/client';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
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

export async function readEngagement(posts: string[]): Promise<Record<string, { views: number }>> {
  const buckets = await store().fetch<{ postId: string; views: number }[]>(
    '*[_type == "blogMetricBucket" && postId in $posts]{postId, views}', { posts }, uncached);
  const totals = Object.fromEntries(posts.map(post => [post, { views: 0 }]));
  for (const bucket of buckets) totals[bucket.postId].views += bucket.views;
  return totals;
}

type ReaderState = { _rev: string; day: string; seen: boolean };
const stateQuery = `*[_id == $id][0]{_rev, day, "seen": $key in readersToday}`;

export async function recordView(post: string, reader: string) {
  const db = store();
  // Preserve the reader digest and KST-day boundary used by existing browsers.
  const key = hash(post + ':' + reader);
  const id = 'blog-metrics.' + hash(post) + '.' + key[0];
  for (let attempt = 0; ; attempt++) {
    const state = await db.fetch<ReaderState | null>(stateQuery, { id, key }, uncached);
    const day = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
    if (state?.day === day && state.seen) break;
    const tx = db.transaction();
    if (!state) tx.create({ _id: id, _type: 'blogMetricBucket', postId: post, views: 0, day, readersToday: [] });
    tx.patch(id, patch => {
      if (state) patch.ifRevisionId(state._rev);
      if (state?.day === day) patch.append('readersToday', [key]);
      else patch.set({ day, readersToday: [key] });
      return patch.inc({ views: 1 });
    });
    try {
      await tx.commit({ visibility: 'sync', returnDocuments: false });
      break;
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode !== 409 || attempt >= 5) throw error;
      await delay(20 * 2 ** attempt + Math.random() * 30);
    }
  }
  return (await readEngagement([post]))[post];
}
