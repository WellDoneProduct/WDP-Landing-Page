import fs from 'node:fs';
import path from 'node:path';
import { getProjects } from '@/lib/content';
import { homeNewsletter } from '@/lib/home-newsletter';
import { homeProjectCards } from '@/lib/home-project-cards';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL, organization, jsonLd } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 300;

export const GET = async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'public/ai-native.html'),
    'utf-8',
  );
  const html = source
    .replace('필요한 시스템을 만들고,', 'AI-NATIVE 외주개발사')
    .replace('기존 업무를 AI로 개선합니다', '웰던프로덕트')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.',
      '기획부터 디자인, 개발, 테스트까지 AI와 함께 처음부터 다르게 일합니다')
    .replace('<a href="#cases" class="btn-hero btn-hero-outline">프로젝트 사례 보기</a>',
      `<a href="/pdf/Company.pdf" download="[웰던프로덕트] 회사소개서.pdf" data-download-pdf class="btn-hero btn-hero-outline">
        회사소개서 받기
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`)
    .replace('>무료 상담 신청</a', '>30분 무료 상담받기</a')
    .replace('<!-- HOME_SPLASH -->', `<div class="splash" id="splash" aria-hidden="true"><div id="splashLogo" class="splash-logo"></div></div>
      <script src="/splash-motion.js" defer></script>`)
    .replace('</head>', `<script>try{if(location.hash==="#cta"||sessionStorage.getItem("wdp:splash:seen")==="1")document.documentElement.classList.add("splash-seen")}catch{}</script>
      <style>.splash-seen .splash{display:none!important}</style><noscript><style>.splash{display:none}</style></noscript></head>`)
    .replace('<!-- HOME_NEWSLETTER -->', homeNewsletter)
    .replace('</head>', `<link rel="stylesheet" href="/home-newsletter.css" /><link rel="canonical" href="${SITE_URL}/" /><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}" /><script type="application/ld+json">${jsonLd(organization)}</script></head>`);

  return new NextResponse(html.replace('<!-- HOME_PROJECT_CARDS -->', homeProjectCards(await getProjects())), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate',
    },
  });
};
