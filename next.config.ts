import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Editorial routes reuse the home footer during runtime rendering and ISR.
  outputFileTracingIncludes: {
    '/*': ['./public/Architect.html', './public/ai-native.html'],
  },
};

export default nextConfig;
