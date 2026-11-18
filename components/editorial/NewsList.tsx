'use client';
import { titleText } from '@/lib/title-text';
import { useState } from 'react';
import type { NewsItem } from '@/lib/content-types';
import { sanityImageUrl, sanitySrcSet } from '@/lib/sanity-image';

const THUMB_WIDTHS = [400, 640, 800, 1200];
const THUMB_SIZES = '(max-width: 767px) calc(100vw - 40px), 400px';
export default function NewsList({items}: {items: NewsItem[]}) {
  const [limit, setLimit] = useState(6);
  return <div className="editorial-container blog-list news-list"><div className="blog-grid">{items.slice(0, limit).map((item, index) => <a className="blog-card" key={item._id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} (새 탭)`}><div className="blog-thumbnail">{item.thumbnail?.url && <img src={sanityImageUrl(item.thumbnail.url, 800)} srcSet={sanitySrcSet(item.thumbnail.url, THUMB_WIDTHS)} sizes={THUMB_SIZES} width={item.thumbnail.width} height={item.thumbnail.height} loading={index < 3 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} decoding="async" alt={item.thumbnail.alt ?? ''} />}</div><h2>{titleText(item.title)}</h2><div className="blog-card-meta"><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Seoul'}).format(new Date(item.publishedAt)).replaceAll('-', '.')}</time></div></a>)}</div>{!items.length && <p className="content-empty">아직 게시된 뉴스가 없습니다.</p>}{items.length > limit && <div className="load-more-wrap"><button className="load-more" onClick={() => setLimit(value => value + 6)}>더 보기 <span aria-hidden="true">↓</span></button></div>}</div>;
}
