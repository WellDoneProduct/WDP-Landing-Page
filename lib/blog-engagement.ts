import 'server-only';
import { createHash } from 'node:crypto';
import { callSheetsWriter } from './lead-store';

export type BlogReader = { post: string; reader: string | null };
type BlogAction = 'view' | 'like' | 'unlike';
type Counts = { views: number; likes: number; liked: boolean };

const readerKey = (post: string, reader: string) =>
  createHash('sha256').update(post + ':' + reader).digest('hex');

async function requestCounts(action: BlogAction | 'read', items: object[]): Promise<Record<string, Counts>> {
  const result = await callSheetsWriter({ kind: 'blogEngagement', action, items });
  if (!result?.ok || !result.counts) throw new Error('Blog counts unavailable');
  return result.counts;
}

export function readEngagement(items: BlogReader[]) {
  return requestCounts('read', items.map(({ post, reader }) => ({ post, key: reader && readerKey(post, reader) })));
}

export async function updateEngagement(post: string, title: string, reader: string, action: BlogAction) {
  const counts = await requestCounts(action, [{ post, title, key: readerKey(post, reader) }]);
  if (!counts[post]) throw new Error('Blog count not confirmed');
  return counts[post];
}
