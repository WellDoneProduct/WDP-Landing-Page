/* Shared by the static home and React pages. Each element owns its listeners. */
(() => {
  if (customElements.get('wdp-header')) return;
  class Header extends HTMLElement {
    connectedCallback() {
      if (!this.querySelector('header')) this.innerHTML = `<header class="wdp-header"><div class="wdp-header-inner"><a class="wdp-logo" href="/" aria-label="웰던프로덕트 홈"><img src="/editorial/header-imgLogoPrimarySvg.svg" alt="웰던프로덕트" width="114" height="32"></a><nav class="wdp-nav" aria-label="주 메뉴"><a href="/portfolio">포트폴리오</a><a href="/blog">블로그</a><a href="/news">언론 보도</a></nav><a class="wdp-contact" href="/#cta">상담받기</a><button class="wdp-menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="wdp-mobile-menu"><span></span><span></span><span></span></button></div><nav id="wdp-mobile-menu" class="wdp-mobile-menu" aria-label="모바일 메뉴" hidden><a href="/portfolio">포트폴리오</a><a href="/blog">블로그</a><a href="/news">언론 보도</a><a href="/#cta">상담받기</a></nav></header>`;
      const header = this.querySelector('header');
      const menu = this.querySelector('.wdp-mobile-menu');
      const toggle = this.querySelector('button');
      const abort = new AbortController();
      this.cleanup = () => abort.abort();
      const options = { signal: abort.signal };
      this.querySelectorAll('nav a').forEach(a => {
        if (location.pathname.startsWith(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
      });
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
        menu.hidden = !open;
        header.classList.toggle('menu-open', open);
      };
      toggle.addEventListener('click', () => setOpen(menu.hidden), options);
      menu.addEventListener('click', () => setOpen(false), options);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); } }, options);
      document.addEventListener('click', e => { if (!this.contains(e.target)) setOpen(false); }, options);
      let lastY = Math.max(0, window.scrollY);
      const update = () => {
        const y = Math.max(0, window.scrollY);
        if (Math.abs(y - lastY) > 5 || y < 64) {
          header.classList.toggle('is-hidden', y > lastY && y > 64 && menu.hidden && !(this.contains(document.activeElement) && document.activeElement.matches(':focus-visible')));
          lastY = y;
        }
        const theme = this.getAttribute('theme');
        const hero = document.querySelector('[data-dark-hero], #hero');
        const dark = theme === 'dark' || (theme === 'hero' && hero && hero.getBoundingClientRect().bottom > 64);
        header.classList.toggle('is-dark', !!dark);
        header.classList.toggle('has-scrolled', y > 20);
      };
      this.addEventListener('focusin', () => header.classList.remove('is-hidden'), options);
      window.addEventListener('scroll', update, { ...options, passive: true });
      window.addEventListener('resize', () => { if (innerWidth > 767) setOpen(false); update(); }, options);
      update();
    }
    disconnectedCallback() { this.cleanup?.(); }
  }
  class Top extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<button class="wdp-top" aria-label="맨 위로" tabindex="-1" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
      const button = this.querySelector('button');
      const abort = new AbortController();
      this.cleanup = () => abort.abort();
      const update = () => {
        const visible = window.scrollY >= window.innerHeight;
        button.classList.toggle('visible', visible);
        button.tabIndex = visible ? 0 : -1;
        button.setAttribute('aria-hidden', String(!visible));
      };
      button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }), { signal: abort.signal });
      window.addEventListener('scroll', update, { signal: abort.signal, passive: true });
      window.addEventListener('resize', update, { signal: abort.signal });
      update();
    }
    disconnectedCallback() { this.cleanup?.(); }
  }
  customElements.define('wdp-header', Header);
  customElements.define('wdp-top', Top);
})();
