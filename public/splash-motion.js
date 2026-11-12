/* Self-hosted Lottie splash: one play, then release the page. */
(() => {
  const splash = document.getElementById('splash');
  const container = document.getElementById('splashLogo');
  if (!splash || !container) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const overflow = root.style.overflow;
  let animation;
  let finished = false;
  let timeout;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    root.style.overflow = overflow;
    splash.classList.add('is-fading');
    document.querySelector('.hero-h1-cat')?.classList.add('highlight-on');
    setTimeout(() => {
      splash.classList.add('is-hidden');
      animation?.destroy();
    }, reducedMotion.matches ? 0 : 500);
  }
  if (reducedMotion.matches) { finish(); return; }
  root.style.overflow = 'hidden';
  // A failed download or background-tab playback must never block the page.
  timeout = setTimeout(finish, 8000);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(); });
  const player = document.createElement('script');
  player.src = '/vendor/lottie-light-5.13.0.min.js';
  player.onerror = finish;
  player.onload = () => {
    if (finished) return;
    try {
      animation = window.lottie.loadAnimation({
        container, renderer: 'svg', loop: false, autoplay: true,
        path: '/animations/wdp-contact-logo-motion.json',
        rendererSettings: {preserveAspectRatio: 'xMidYMid meet'},
      });
      animation.addEventListener('complete', finish);
      animation.addEventListener('data_failed', finish);
      animation.addEventListener('error', finish);
    } catch { finish(); }
  };
  document.head.appendChild(player);
})();
