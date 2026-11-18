// Service landing pages under app/services/*. Shared by the Sanity schema (related-service picker),
// blog detail links and the sitemap, so adding a service page means adding it here once.
export const SERVICES = [
  { slug: 'web-app', title: '웹앱 서비스 개발' },
  { slug: 'ai-system', title: 'AI 시스템 개발' },
  { slug: 'ax-automation', title: 'AX 업무 자동화' },
  { slug: 'ai-monitoring', title: 'AI 모니터링' },
  { slug: 'enterprise-system', title: '기업 시스템' },
  { slug: 'modernization', title: 'AI 기반 노후화 시스템 현대화' },
] as const;

export const serviceUrl = (slug: string) => `/services/${slug}`;

export const findService = (slug?: string) => SERVICES.find(service => service.slug === slug);
