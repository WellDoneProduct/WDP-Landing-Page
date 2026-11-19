'use client';

import { useEffect, useRef, useState } from 'react';

export type Counts = { views: number };

const readerKey = (post: string) => 'wdp:blog-reader:' + post;

export async function readCounts(posts: string[], signal: AbortSignal): Promise<Record<string, Counts>> {
  const items = posts.map(post => ({ post }));
  const response = await fetch('/api/blog/engagement', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'read', items }), signal,
  });
  if (!response.ok) throw new Error('engagement unavailable');
  return response.json();
}

async function recordView(post: string, signal: AbortSignal): Promise<Counts> {
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
    body: JSON.stringify({ post, reader, action: 'view' }), signal,
  });
  if (!response.ok) throw new Error('engagement unavailable');
  return response.json();
}

export default function BlogEngagement({ post, href, title }: { post: string; href: string; title: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    function visit() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visit);
      recordView(post, controller.signal).then(value => {
        if (!controller.signal.aborted) { setCounts(value); setError(false); }
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    }
    document.addEventListener('visibilitychange', visit);
    visit();
    return () => { controller.abort(); document.removeEventListener('visibilitychange', visit); };
  }, [post, attempt]);

  return <EngagementRow href={href} title={title} counts={counts} failed={error} retry={() => setAttempt(n => n + 1)} />;
}

type RowProps = {
  href: string; title: string; counts?: Counts | null; linkViews?: boolean;
  failed: boolean; retry: () => void;
};

export function EngagementRow({ href, title, counts, linkViews, failed, retry }: RowProps) {
  const busy = useRef(false);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function share() {
    if (busy.current) return;
    busy.current = true;
    setManualUrl('');
    setCopied(false);
    const url = new URL(href, window.location.origin).href;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if ((error as { name?: string }).name === 'AbortError') return;
        }
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setManualUrl(url);
    } finally {
      busy.current = false;
    }
  }

  const views = '조회수 ' + (counts?.views.toLocaleString('ko-KR') ?? '—');
  return <div className="blog-engagement">
    {linkViews ? <a className="blog-view-link" href={href}>{views}</a> : <span>{views}</span>}
    <button className="blog-share" type="button" onClick={share} aria-label={title + ' 공유하기'}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15V3m-4 4 4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      </svg>공유하기
    </button>
    <span role="status" className="blog-share-status">{copied ? '링크를 복사했습니다.' : ''}</span>
    {manualUrl && <label className="blog-share-url">링크를 직접 복사해 주세요.
      <input readOnly value={manualUrl} onFocus={e => e.currentTarget.select()} />
    </label>}
    {failed && <span role="status">조회수를 불러올 수 없습니다. <button type="button" onClick={retry}>다시 시도</button></span>}
  </div>;
}
