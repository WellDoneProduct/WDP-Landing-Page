import Link from 'next/link';
import { SiteHeader } from '@/components/editorial/SiteChrome';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href="/site-chrome.css" />
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.code} role="img" aria-label="오류 404">
            <span aria-hidden="true">4</span>
            <svg className={styles.graphic} viewBox="0 0 224 214" aria-hidden="true" focusable="false">
              <defs>
                {/* Cube geometry from the homepage's From raw to welldone illustration. */}
                <g id="wdp-404-cube" transform="translate(-218 -289.4)" stroke="#e7edf0" strokeWidth="2.7" strokeLinejoin="round">
                  <path d="M362.6 414.6L290.3 456.3V372.9L362.6 331.1V414.6Z" fill="var(--cube-right, #0c2749)" />
                  <path d="M218 414.6L290.3 456.3V372.9L218 331.1V414.6Z" fill="var(--cube-left, #10305c)" />
                  <path d="M290.3 289.4L362.6 331.1L290.3 372.9L218 331.1L290.3 289.4Z" fill="var(--cube-top, #0048ff)" />
                </g>
              </defs>
              <use href="#wdp-404-cube" className={styles.lightCube} transform="translate(67 8) scale(.62)" />
              <use href="#wdp-404-cube" className={styles.paleCube} transform="translate(8 69) scale(.61)" />
              <use href="#wdp-404-cube" transform="translate(123 63) scale(.64)" />
              <use href="#wdp-404-cube" className={styles.lightCube} transform="translate(66 106) scale(.6)" />
            </svg>
            <span aria-hidden="true">4</span>
          </div>
          <h1>이런, 페이지를 찾을 수 없어요.</h1>
          <p className={styles.description}>
            페이지가 지구와 화성 사이 어딘가에서 길을 잃었어요. 홈으로 돌아가 다시 시작해 볼까요?
          </p>
          <Link className={styles.homeLink} href="/" prefetch={false}>
            홈으로 돌아가기
            <span className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" focusable="false">
                <path d="M4 10h11m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}
