import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isIndexable, SITE_URL } from '@/lib/seo';
export const dynamic = 'force-static';
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), 'public', file), 'utf8');
export function GET() {
  const section = (id: string) => new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?</section>`);
  const html = read('ai-native.html')
    .replace('ai-native-page', 'ai-native-page webapp-page ax-automation-page')
    .replace(/<title>[\s\S]*?<\/title>/, '<title>AX 업무 자동화 | 웰던프로덕트</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, '<meta name="description" content="자료 확인부터 입력·전달까지, AI로 반복 업무를 자동화합니다. 자동 처리 범위와 담당자가 확인할 단계를 함께 설계합니다.">')
    .replace('필요한 시스템을 만들고,', '자료 확인부터 입력·전달까지,')
    .replace('기존 업무를 AI로 개선합니다', 'AI로 반복 업무를 자동화합니다')
    .replace('웹·앱 개발부터 업무 자동화, 시스템 현대화와 전사 AI 환경까지.<br /> 기획·디자인·개발·운영 이관을 함께합니다.', '문서에서 필요한 정보를 찾고, 업무 규칙에 맞춰 다음 단계로 연결합니다.<br /> 자동으로 처리할 일과 담당자가 확인할 일을 함께 설계합니다.')
    .replace('href="#cases" class="btn-hero btn-hero-outline">프로젝트 사례 보기', 'href="#ax-examples" class="btn-hero btn-hero-outline">업무 자동화 예시 보기')
    .replace('무엇부터 시작할지 고민이라면,<br />현재 상황부터 들려주세요', '우리 회사에서 반복되는 업무,<br />한 가지만 알려주세요')
    .replace('필요한 서비스가 명확하지 않아도 괜찮습니다.<br /> 개발과 개선의 범위를 함께 살펴봅니다.', '어떤 자료를 받아, 어디에 입력하고, 누구에게 전달하는지부터 함께 살펴봅니다.')
    .replace(section('welldone'), read('ax-automation-content.html'))
    .replace('요구사항 정의<br> 기능명세서 작성<br> 회의록 정리', '현재 업무·반복 구간 분석<br> 자동화 범위·확인 기준 정의<br> 업무 규칙·예외 정리')
    .replace('요구사항 기반 UX/UI 디자인<br> 디자인 시스템 컴포넌트 적용', '담당자 확인·승인 화면 설계<br> 기존 업무 흐름에 맞춘 UX')
    .replace('명세 기반 코드 작성<br> 리펙토링 및 코드 리뷰 보조', 'AI 처리·시스템 연동 구현<br> 처리 이력·재처리 기능 개발')
    .replace('요구사항 기반 테스트 시나리오 작성<br> 자동화 테스트 진행 작성', '실제 자료·예외 상황 테스트<br> 원본 대조·중복 처리 검증')
    .replace('기획 · 디자인 · 코드 등 인수인계 자료 자동 정리<br> 변경 이력 · 유지보수 가이드 작성', '운영 절차·담당자 교육<br> 업무 변경·유지보수 범위 협의')
    .replace(section('services'), '')
    .replace(section('cases'), '')
    .replace('기획·디자인·개발·테스트까지, 외주 개발의 모든 단계에서 AI를 활용해 일합니다.', '실제 업무 분석부터 설계·개발·검증까지 한 팀이 함께합니다. 정상 처리와 예외 상황을 실제 자료로 확인하고, 운영·인수인계 범위를 정합니다.')
    .replace('<section class="section cta-section', `<div class="native-content">${read('ax-automation-faq.html')}</div><section class="section cta-section`)
    .replace('</head>', `<link rel="stylesheet" href="/webapp.css"><link rel="stylesheet" href="/ax-automation.css"><link rel="canonical" href="${SITE_URL}/services/ax-automation"><meta name="robots" content="${isIndexable ? 'index,follow' : 'noindex,nofollow'}"></head>`)
    .replace('</body>', '<script src="/ax-automation.js"></script><script src="/ax-trade-motion.js"></script></body>');
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
