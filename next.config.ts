import type { NextConfig } from "next";
import { loadSlugRedirects } from "./lib/slug-redirects";

const nextConfig: NextConfig = {
  // Old blog slugs (Sanity `previousSlugs`) answer with a real 301 to the current URL.
  redirects: loadSlugRedirects,
  // Editorial routes reuse the home footer during runtime rendering and ISR.
  outputFileTracingIncludes: {
    '/*': ['./public/Architect.html', './public/ai-native.html', './public/webapp-*.html', './public/monitor-*.html', './public/enterprise-*.html', './public/modernization-*.html', './public/ax-automation-*.html'],
  },
};

export default nextConfig;
