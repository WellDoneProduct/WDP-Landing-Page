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
            <svg className={styles.graphic} viewBox="0 0 198 178" aria-hidden="true" focusable="false">
              <defs>
                {/* Cube geometry from the homepage's From raw to welldone illustration. */}
                <g id="wdp-404-cube" transform="scale(.65) translate(-218 -289.4)">
                  <path d="M362.6 427.1L290.3 468.8V372.9L362.6 331.1Z" fill="var(--cube-right, #0c2749)" />
                  <path d="M218 427.1L290.3 468.8V372.9L218 331.1Z" fill="var(--cube-left, #10305c)" />
                  <path d="M290.3 289.4L362.6 331.1L290.3 372.9L218 331.1L290.3 289.4Z" fill="var(--cube-top, #0048ff)" />
                </g>
              </defs>
              <use href="#wdp-404-cube" className={styles.lightCube} x="52" y="1" />
              <use href="#wdp-404-cube" className={styles.paleCube} x="1" y="30.45" />
              <use href="#wdp-404-cube" x="103" y="30.45" />
              <use href="#wdp-404-cube" className={styles.lightCube} x="52" y="59.9" />
            </svg>
            <span aria-hidden="true">4</span>
          </div>
          <h1>이런, 페이지를 찾을 수 없어요.</h1>
          <p className={styles.description}>
            주소가 잘못되었거나 페이지가 이동했을 수 있어요. 주소를 확인하거나 홈으로 돌아가 주세요.
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
