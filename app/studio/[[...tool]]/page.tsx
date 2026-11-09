import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const metadata = { title: '콘텐츠 편집 | 웰던프로덕트', robots: { index: false, follow: false } };
export { viewport } from 'next-sanity/studio';
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <main style={{ padding: 48 }}><h1>콘텐츠 편집 환경 연결 중</h1><p>Sanity 프로젝트 연결을 완료하면 이 화면에서 블로그와 포트폴리오를 편집할 수 있습니다.</p></main>;
  return <NextStudio config={config} />;
}
