(() => {
  const player = document.querySelector('.mc-player');
  if (!player) return;
  const stage = player.querySelector('.mc-stage');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialHold = 1500;
  // The original shake lasts 291.2ms; double only this segment.
  const shakeExtra = 291.2;
  stage.style.setProperty('--mc-initial-hold', `${initialHold}ms`);
  stage.style.setProperty('--mc-shake-extra', `${shakeExtra}ms`);
  let visible = false;
  let timer;
  let repeat;
  const fit = () => stage.style.setProperty('--mc-scale', player.clientWidth / 606);
  const resize = new ResizeObserver(fit);
  resize.observe(player);
  fit();
  function stop() {
    clearTimeout(timer);
    clearTimeout(repeat);
    stage.classList.add('is-paused');
  }
  function play() {
    stop();
    if (!visible || document.hidden) return;
    stage.classList.remove('is-before', 'is-after', 'is-paused');
    const nodes = stage.querySelectorAll('[data-motion-id], .mc-folder-rise, .mc-confetti, .mc-badge');
    nodes.forEach(node => { node.style.animation = 'none'; });
    stage.getBoundingClientRect();
    nodes.forEach(node => { node.style.animation = ''; });
    if (reduce.matches) {
      stage.classList.add('is-after');
      return;
    }
    stage.classList.add('is-before');
    timer = setTimeout(() => {
      stage.classList.remove('is-before');
      stage.classList.add('is-after');
      // Complete the reveal, then hold the result before repeating.
      repeat = setTimeout(play, 3400);
    }, initialHold + 1300 + shakeExtra);
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) play(); else stop();
  }, { threshold: 0 });
  observer.observe(player);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else play(); });
  reduce.addEventListener('change', play);
  player.addEventListener('click', play);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', play);
})();
