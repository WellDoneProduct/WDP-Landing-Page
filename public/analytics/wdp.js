import { installAnalytics } from './runtime.js';

const services = {
  'web-app': 'web_app', 'enterprise-system': 'enterprise_system',
  modernization: 'modernization', 'ai-monitoring': 'ai_monitoring',
  'ai-system': 'ai_system', 'ax-automation': 'ax_automation',
};

function readPage() {
  const path = location.pathname;
  const serviceType = services[path.split('/')[2]];
  const contentId = document.querySelector('[data-analytics-content-body]')?.dataset.analyticsContentBody;
  if (path === '/') return { area: 'marketing', type: 'home', path };
  if (serviceType && path.startsWith('/services/')) return { area: 'marketing', type: 'service', path, serviceType };
  if (/^\/(blog|portfolio|news)(\/|$)/.test(path) && /^\/[a-zA-Z0-9_/-]*$/.test(path)) {
    return { area: 'marketing', type: path.split('/')[1] + (contentId ? '_detail' : ''), path, contentId };
  }
  return null;
}

function prepare(page) {
  for (const link of document.querySelectorAll('a[href="/#cta"],a[href="#cta"]')) {
    link.dataset.analyticsEvent = 'consultation_cta_click';
    link.dataset.analyticsFormId = 'consultation';
    link.dataset.analyticsCtaLocation = link.closest('header') ? 'header'
      : link.closest('footer') ? 'footer'
      : link.closest('.btn-hero-primary, [data-dark-hero]') ? 'hero'
      : page.type === 'blog_detail' ? 'blog_bottom' : 'service_mid';
  }
  for (const link of document.querySelectorAll('a[href^="/services/"]')) {
    const serviceType = services[link.pathname.split('/')[2]];
    if (!serviceType) continue;
    link.dataset.analyticsEvent = 'service_select';
    link.dataset.analyticsServiceType = serviceType;
  }
}

const { analytics, showRoute } = installAnalytics({ brand: 'welldoneproduct', domain: 'welldoneproduct.com', readPage, prepare });
window.wdpAnalytics = analytics;
const refresh = () => requestAnimationFrame(() => showRoute());
document.addEventListener('wdp:route-committed', refresh);
window.addEventListener('pageshow', refresh);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => showRoute(), { once: true });
else showRoute();
