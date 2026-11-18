import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Editorial routes reuse the home footer during runtime rendering and ISR.
  outputFileTracingIncludes: {
    '/*': ['./public/Architect.html', './public/ai-native.html', './public/webapp-*.html', './public/monitor-*.html', './public/enterprise-*.html', './public/modernization-*.html', './public/ax-automation-*.html'],
  },
  // Files in public/ default to `max-age=0, must-revalidate`, so the 2MB font was
  // revalidated on every reload. Rename the file if the font is ever replaced.
  headers: async () => [
    {
      source: '/fonts/:file(.+\\.woff2)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

export default nextConfig;
