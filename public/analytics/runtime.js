import { createAnalytics } from './analytics.js';
import { bindAnalyticsDom } from './analytics-dom.js';

export function installAnalytics({ brand, domain, readPage, prepare = () => {}, prepareIdentity = () => {} }) {
  const cookie = 'site_analytics_consent_v2';
  const readConsent = () => document.cookie.split('; ').find(value => value.startsWith(cookie + '='))?.slice(cookie.length + 1);
  const analytics = createAnalytics({ brand, getConsent: () => readConsent() === 'granted', getPage: readPage });
  let cleanup = () => {};
  let boundPath;
  let engagement;
  const settings = document.createElement('details');
  settings.dataset.analyticsSettings = '';
  settings.innerHTML = '<summary>분석 설정</summary><div><p>사이트 이용과 상담 전환을 파악하기 위해 Google Analytics와 Mixpanel을 사용합니다.</p><button type="button" value="granted">분석 허용</button> <button type="button" value="denied">분석 거부</button><p role="status"></p></div>';
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/analytics/settings.css';
  document.head.append(css);
  const status = settings.querySelector('[role="status"]');
  const updateStatus = () => {
    const consent = readConsent();
    status.textContent = consent === 'granted' ? '분석을 허용했습니다.' : consent === 'denied' ? '분석을 거부했습니다.' : '동의 여부를 선택할 수 있습니다.';
  };

  function showRoute(force = false) {
    const page = readPage();
    if (!page) {
      cleanup();
      boundPath = undefined;
      settings.hidden = true;
      return;
    }
    settings.hidden = false;
    if (!settings.isConnected) (document.querySelector('footer') || document.body).append(settings);
    if (!force && boundPath === page.path) return;
    boundPath = page.path;
    cleanup();
    prepare(page);
    if (readConsent() !== 'granted') return;
    prepareIdentity(analytics);
    analytics.pageView();
    cleanup = bindAnalyticsDom(analytics);
    if (!page.contentId) return;
    analytics.track('content_view');
    const body = document.querySelector('[data-analytics-content-body]');
    if (!body) return;
    let visibleTime = 0;
    let lastTick = performance.now();
    let readHalf = false;
    const observer = new ResizeObserver(() => checkScroll());
    const checkScroll = () => {
      const bounds = body.getBoundingClientRect();
      if (bounds.top + bounds.height / 2 <= innerHeight) readHalf = true;
    };
    observer.observe(body);
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    engagement = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) visibleTime += Math.min(now - lastTick, 1000);
      lastTick = now;
      if (readHalf && visibleTime >= 30000) {
        analytics.track('content_engaged');
        clearInterval(engagement);
      }
    }, 1000);
    const unbind = cleanup;
    cleanup = () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkScroll);
      clearInterval(engagement);
      unbind();
    };
  }

  updateStatus();
  settings.addEventListener('click', event => {
    const choice = event.target.closest('button')?.value;
    if (!choice) return;
    const previous = readConsent();
    document.cookie = cookie + '=' + choice + '; Path=/; Domain=' + domain + '; Max-Age=15552000; SameSite=Lax; Secure';
    updateStatus();
    if (choice === 'denied' && previous === 'granted') {
      cleanup();
      analytics.revoke();
      return;
    }
    if (choice === 'granted' && previous === 'denied') {
      window.location.reload();
      return;
    }
    if (choice === 'granted') showRoute(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && readConsent() !== 'granted') cleanup();
  });
  return { analytics, showRoute };
}
