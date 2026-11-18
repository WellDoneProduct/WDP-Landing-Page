import type { Metadata } from "next";
import "./globals.css";

import { SITE_URL, organization, pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/editorial/JsonLd';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata('웰던프로덕트 | AI-Native 외주개발사', 'AI와 함께 일하는 웰던프로덕트. 업무 자동화 시스템, 웹·앱 서비스 개발과 프로젝트 사례, AI 개발 인사이트를 만나보세요.', '/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head><link rel="stylesheet" href="/fonts/pretendard.css" /></head>
      <body className="min-h-full flex flex-col font-sans"><JsonLd data={organization} />{children}</body>
    </html>
  );
}
