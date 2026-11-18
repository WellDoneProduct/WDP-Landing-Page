(() => {
  const root = document.querySelector('.ai-feature-selector');
  if (!root) return;
  const options = [...root.querySelectorAll('.ai-feature-option')];
  const images = [...root.querySelectorAll('[data-feature-image]')];
  let activeIndex = 0;
  const activate = index => {
      activeIndex = index;
      options.forEach((item, i) => {
        const active = i === index;
        item.classList.toggle('is-active', active);
        item.querySelector('button').setAttribute('aria-expanded', String(active));
        item.querySelector('.ai-feature-panel').hidden = !active;
        images[i].classList.toggle('is-active', active);
      });
  };
  options.forEach((option, index) => option.querySelector('button').addEventListener('click', () => { activate(index); restart(); }));
  const mobile = matchMedia('(max-width:768px), (hover:none)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let visible = false, timer;
  function restart(){
    clearInterval(timer);
    if (!mobile.matches || reduced.matches || !visible || document.hidden) return;
    timer = setInterval(() => { if (!root.contains(document.activeElement)) activate((activeIndex + 1) % options.length); }, 6500);
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart(); }, {threshold:.25}).observe(root);
  document.addEventListener('visibilitychange', restart);
  mobile.addEventListener('change', restart); reduced.addEventListener('change', restart);
  window.addEventListener('pagehide', () => clearInterval(timer)); window.addEventListener('pageshow', restart);
})();
