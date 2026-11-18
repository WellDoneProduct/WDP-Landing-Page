import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL } from '@/lib/seo';
export const dynamic = 'force-static';
export const revalidate = 300;
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), 'public', file), 'utf8');
export async function GET() {
  // Compose from the current home so shared sections, motion and form stay identical.
  let html = read('ai-native.html');
  const section = (id: string) => new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?</section>`);
  html = html.replace('ai-native-page', 'ai-native-page modernization-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>AI 기반 노후화 시스템 현대화 | 웰던프로덕트</title>')
    .replace('href="#cases"', 'href="#modern-scope"')
    .replace('프로젝트 사례 보기', '전환 범위 살펴보기')
    .replace('필요한 시스템을 만들고,', '쌓아온 업무는 지키고,')
    .replace('기존 업무를 AI로 개선합니다', 'AI로 더 빠르게 전환합니다')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', 'AI가 기존 코드를 분석하고, 업무 규칙을 반영해 새 기술로 전환합니다.<br /> 반복 개발은 줄이고, 기능과 처리 결과는 원본과 대조해 검증합니다.')
    .replace(section('assure'), '')
    .replace(section('process'), '')
    .replace(section('services'), '')
    .replace(section('cases'), '')
    .replace(section('welldone'), read('modernization-content.html'))
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="stylesheet" href="/modernization.css"><link rel="canonical" href="${SITE_URL}/services/modernization"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`);
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate' } });
}
