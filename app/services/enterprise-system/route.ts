import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/content';
import { homeProjectCards } from '@/lib/home-project-cards';
import { isIndexable, SITE_URL } from '@/lib/seo';
export const dynamic = 'force-static';
export const revalidate = 300;
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), 'public', file), 'utf8');
export async function GET() {
  let html = read('ai-native.html');
  const section = (id: string) => new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?</section>`);
  html = html.replace('ai-native-page', 'ai-native-page webapp-page enterprise-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>기업 시스템 | 웰던프로덕트</title>')
    .replace('필요한 시스템을 만들고,', '업무는 이어지고, 현황은 한눈에')
    .replace('기존 업무를 AI로 개선합니다', '우리 회사에 맞는 시스템을 만듭니다')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', '주문·재고·승인처럼 나뉜 업무를 연결하고, 필요한 현황을 함께 확인하도록 설계합니다.<br /> AI로 반복 개발 작업을 줄이고, 전문가는 업무 규칙과 실제 처리 결과를 검증합니다.')
    .replace(section('welldone'), read('enterprise-problems.html'))
    .replace('<section class="sec dark" id="process">', `${read('enterprise-features.html')}<section class="sec dark" id="process">`)
    .replace(section('services'), '')
    .replace('<section class="section cta-section', `<div class="native-content">${read('enterprise-band.html')}${read('enterprise-faq.html')}</div><section class="section cta-section`)
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="stylesheet" href="/enterprise.css"><link rel="canonical" href="${SITE_URL}/services/enterprise-system"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`)
    .replace('</body>', '<script src="/enterprise.js" defer></script></body>');
  const projects = await getProjects();
  const selected = ['HIGHER', '한국메딕스', '아주대학교의료원'].flatMap(title => projects.filter(p => p.title === title));
  html = html.replace('<!-- HOME_PROJECT_CARDS -->', homeProjectCards(selected));
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate' } });
}
