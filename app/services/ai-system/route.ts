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
  html = html.replace('ai-native-page', 'ai-native-page webapp-page ai-system-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>AI 시스템 개발 | 웰던프로덕트</title>')
    .replace('필요한 시스템을 만들고,', '기존 시스템에도, 새로운 시스템에도')
    .replace('기존 업무를 AI로 개선합니다', '우리 업무에 필요한 AI를 만듭니다')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', '매출·재고 조회, 문서 기반 답변, 상품 추천과 콘텐츠 생성까지.<br /> 기존 시스템에 연결하거나, 새 시스템과 AI를 함께 개발합니다.')
    .replace(section('welldone'), read('ai-system-content.html'))
    .replace(section('services'), '')
    .replace('<section class="section cta-section', `<div class="native-content">${read('ai-system-band.html')}${read('webapp-faq.html')}</div><section class="section cta-section`)
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="stylesheet" href="/ai-system.css"><link rel="canonical" href="${SITE_URL}/services/ai-system"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`);
  html = html
    .replace('기획·디자인·개발·테스트까지, 외주 개발의 모든 단계에서 AI를 활용해 일합니다.', 'AI로 개발의 반복 작업을 줄이고, 서비스에 들어가는 AI는 실제 질문과 기대 결과로 별도 검증합니다.')
    .replace('이미 많은 기업들이<br />만족했습니다', '실제 서비스에 연결한<br />AI 개발 프로젝트')
    .replace('스타트업부터 대기업·기관까지, 제조·의료·교육·엔터 등 다양한 도메인에서<br />기획부터 개발까지 풀스택 팀으로 함께했습니다.', '연구 자료 검색, 이미지 생성, B2B 상품 추천과 데이터 질의응답까지')
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, '<meta name="description" content="기존 업무 시스템에 AI를 연결하거나 새 시스템과 함께 개발합니다. 문서 검색, 데이터 조회, 추천과 콘텐츠 생성까지 회사에 맞게 설계합니다." />');
  const projects = await getProjects();
  const selected = ['연세대학교 리빙랩', 'C&C 미술학원', 'HIGHER'].flatMap(title => projects.filter(p => p.title === title));
  html = html.replace('<!-- HOME_PROJECT_CARDS -->', homeProjectCards(selected));
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate' } });
}
