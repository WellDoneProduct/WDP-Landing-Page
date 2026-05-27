import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "잘 만드는 외주개발사, 웰던프로덕트",
  description: "직원들이 매일 반복하는 그 업무, 시스템이 대신합니다. 엑셀 취합, 수기 입력, 카톡 결재 자동화.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
