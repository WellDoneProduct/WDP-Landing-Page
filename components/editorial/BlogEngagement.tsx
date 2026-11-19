'use client';

import { useEffect, useRef, useState } from 'react';

export type Counts = { views: number; likes: number; liked: boolean };
type Action = 'view' | 'like' | 'unlike';

const readerKey = (post: string) => 'wdp:blog-reader:' + post;

export async function readCounts(posts: string[], signal: AbortSignal): Promise<Record<string, Counts>> {
  const items = posts.map(post => {
    let reader = null;
    try { reader = localStorage.getItem(readerKey(post)); } catch {}
    return { post, reader };
  });
  const response = await fetch('/api/blog/engagement', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'read', items }), signal,
  });
  if (!response.ok) throw new Error('engagement unavailable');
  return response.json();
}

async function record(post: string, action: Action, signal?: AbortSignal): Promise<Counts> {
  const key = readerKey(post);
  const getReader = () => {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  };
  const reader = navigator.locks ? await navigator.locks.request(key, getReader) : getReader();
  const response = await fetch('/api/blog/engagement', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post, reader, action }), signal,
  });
  if (!response.ok) throw new Error('engagement unavailable');
  return response.json();
}

export default function BlogEngagement({ post }: { post: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    function visit() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visit);
      record(post, 'view', controller.signal).then(value => {
        if (!controller.signal.aborted) { setCounts(value); setError(false); }
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    }
    document.addEventListener('visibilitychange', visit);
    visit();
    return () => { controller.abort(); document.removeEventListener('visibilitychange', visit); };
  }, [post, attempt]);

  return <EngagementRow post={post} counts={counts} onUpdate={setCounts} failed={error} retry={() => setAttempt(n => n + 1)} />;
}

type RowProps = {
  post: string; counts?: Counts | null; onUpdate: (counts: Counts) => void;
  failed: boolean; retry: () => void; href?: string;
};

export function EngagementRow({ post, counts, onUpdate, failed, retry, href }: RowProps) {
  const pending = useRef(false);
  const [optimistic, setOptimistic] = useState<Counts | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [pulse, setPulse] = useState(0);
  async function like() {
    if (!counts || pending.current) return;
    pending.current = true;
    setOptimistic({ ...counts, liked: !counts.liked, likes: counts.likes + (counts.liked ? -1 : 1) });
    if (!counts.liked) setPulse(n => n + 1);
    try {
      onUpdate(await record(post, counts.liked ? 'unlike' : 'like'));
      setSaveError(false);
    } catch { setSaveError(true); }
    finally { pending.current = false; setOptimistic(null); }
  }
  const views = '조회수 ' + (counts?.views.toLocaleString('ko-KR') ?? '—');
  const displayed = optimistic ?? counts;
  const liked = Boolean(displayed?.liked);
  return <div className="blog-engagement">
    {href ? <a className="blog-view-link" href={href}>{views}</a> : <span>{views}</span>}
    <button className="blog-like" type="button" onClick={like} disabled={!counts || Boolean(optimistic)} aria-pressed={liked}>
      <span key={pulse} className={'like-heart' + (pulse ? ' like-pop' : '')} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill={liked ? 'currentColor' : 'none'}><path d="M12 20.5 3.8 12.6C-1.1 7.6 6.1.2 12 6.2c5.9-6 13.1 1.4 8.2 6.4Z" /></svg>
      </span> 좋아요 {displayed?.likes.toLocaleString('ko-KR') ?? '—'}
    </button>
    {failed && <span role="status">집계를 불러올 수 없습니다. <button type="button" onClick={retry}>다시 시도</button></span>}
    {saveError && <span role="status">좋아요를 저장하지 못했습니다. 다시 눌러 주세요.</span>}
  </div>;
}
