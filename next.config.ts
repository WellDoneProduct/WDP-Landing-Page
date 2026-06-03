import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // 파일시스템(app/page.tsx)보다 먼저 적용 → 루트가 정적 Architect.html을 서빙
      beforeFiles: [{ source: '/', destination: '/Architect.html' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
