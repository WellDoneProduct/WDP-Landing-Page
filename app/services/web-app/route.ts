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
  // Compose from the current home so shared sections, motion and form stay identical.
  let html = read('ai-native.html');
  const section = (id: string) => new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?</section>`);
  html = html.replace('ai-native-page', 'ai-native-page webapp-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>웹앱 서비스 개발 | 웰던프로덕트</title>')
    .replace('필요한 시스템을 만들고,', '새로운 서비스도, 기존 서비스 리뉴얼도,')
    .replace('기존 업무를 AI로 개선합니다', 'AI로 개발 부담을 줄입니다')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', '기획·디자인·개발·테스트의 반복 작업은 AI로 줄이고,<br /> 전문가는 핵심 기능부터 시스템 연계·운영 전환까지 검토합니다.')
    .replace(section('welldone'), read('webapp-scope.html'))
    .replace(section('services'), read('webapp-layers.html'))
    .replace('<section class="section cta-section', `<div class="native-content">${read('webapp-band.html')}${read('webapp-faq.html')}</div><section class="section cta-section`)
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="canonical" href="${SITE_URL}/services/web-app"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`);
  const projects = await getProjects();
  const selected = ['YOUMES', '아주대학교의료원', '한국메딕스'].flatMap(title => projects.filter(p => p.title === title));
  html = html.replace('<!-- HOME_PROJECT_CARDS -->', homeProjectCards(selected));
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate' } });
}
