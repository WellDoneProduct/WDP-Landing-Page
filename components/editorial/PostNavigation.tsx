import Link from 'next/link';
import type { Post } from '@/lib/content-types';

type Neighbor = Pick<Post, 'slug' | 'title'>;

export default function PostNavigation({ previous, next }: { previous?: Neighbor; next?: Neighbor }) {
  return <nav className="post-navigation editorial-container" aria-label="블로그 글 이동">
    <div className="post-navigation-rows">
      {([{ label: '이전 글', post: previous, rel: 'prev' }, { label: '다음 글', post: next, rel: 'next' }] as const).map(({ label, post, rel }) => {
        const content = <><span className="post-navigation-label">{label}</span><span className="post-navigation-title">{post?.title ?? `${label}이 없습니다.`}{post && <img src="/editorial/blog-navigation-arrow.svg" width={24} height={24} alt="" />}</span></>;
        return post ? <Link className="post-navigation-row" key={rel} href={`/blog/${post.slug}`} rel={rel}>{content}</Link> : <div className="post-navigation-row is-empty" key={rel} aria-disabled="true">{content}</div>;
      })}
    </div>
    <Link className="post-navigation-list" href="/blog">목록으로</Link>
  </nav>;
}
