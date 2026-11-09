'use client';
import { useState } from 'react';
import type { NewsItem } from '@/lib/content-types';
export default function NewsList({items}: {items: NewsItem[]}) {
  const [limit, setLimit] = useState(6);
  return <div className="editorial-container blog-list"><div className="blog-grid">{items.slice(0, limit).map(item => <a className="blog-card" key={item._id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} (새 탭)`}><div className="blog-thumbnail"><img src={item.thumbnail.url} alt={item.thumbnail.alt} /></div><h2>{item.title}</h2><div className="blog-card-meta"><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Seoul'}).format(new Date(item.publishedAt)).replaceAll('-', '.')}</time></div></a>)}</div>{!items.length && <p className="content-empty">아직 게시된 뉴스가 없습니다.</p>}{items.length > limit && <div className="load-more-wrap"><button className="load-more" onClick={() => setLimit(value => value + 6)}>더 보기 <span aria-hidden="true">↓</span></button></div>}</div>;
}
