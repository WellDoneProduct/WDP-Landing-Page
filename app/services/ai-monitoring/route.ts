import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL } from '@/lib/seo';
export const dynamic = 'force-static';
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), 'public', file), 'utf8');
export function GET() {
  let html = read('ai-native.html');
  const section = (id: string) => new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?</section>`);
  html = html.replace('ai-native-page', 'ai-native-page webapp-page monitor-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>AI 모니터링 | 웰던프로덕트</title>')
    .replace('필요한 시스템을 만들고,', '직원은 업무에 AI를,')
    .replace('기존 업무를 AI로 개선합니다', '회사는 보안과 비용을 관리하세요')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', '여러 AI를 하나의 사내 업무 환경에서 사용하고,<br /> 부서별 권한·사용량·비용과 민감정보 처리 정책을 함께 관리합니다.')
    .replace('href="#cases" class="btn-hero btn-hero-outline">프로젝트 사례 보기', 'href="#manage" class="btn-hero btn-hero-outline">어떻게 관리하나요?')
    .replace(section('welldone'), read('monitor-why.html'))
    .replace(section('process'), read('monitor-manage.html') + read('monitor-dashboard.html'))
    .replace(section('assure'), read('monitor-use.html'))
    .replace(section('services'), read('monitor-connect.html'))
    .replace(section('cases'), `<div class="native-content">${read('monitor-casea.html')}${read('monitor-rollout.html')}</div>`)
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="stylesheet" href="/monitor.css"><link rel="canonical" href="${SITE_URL}/services/ai-monitoring"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="/monitor-dashboard.css"></head>')
    .replace('</body>', '<script src="/monitor-dashboard.js"></script></body>');
  return new NextResponse(html, {headers:{'content-type':'text/html; charset=utf-8'}});
}
