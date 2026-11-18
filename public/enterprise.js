/* Scroll unfolds one feature layer at a time; controls remain keyboard accessible. */
(() => {
  const track = document.querySelector('.enterprise-scroll-track');
  if (!track) return;
  const stack = track.querySelector('.enterprise-layer-stack');
  const pin = track.querySelector('.enterprise-pin');
  const layers = [...stack.querySelectorAll('.enterprise-layer')];
  const mobile = matchMedia('(max-width:768px), (hover:none)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let visible = false, timer;
  let active = 0, frame = 0, pinTop = 84, travel = 1, manualScroll = null;
  const activate = index => {
    if (index === active && stack.dataset.ready) return;
    active = index;
    stack.dataset.active = String(index);
    stack.dataset.ready = 'true';
    layers.forEach((layer, i) => {
      layer.querySelector('button').setAttribute('aria-expanded', String(i === index));
      layer.querySelector('.enterprise-layer-panel').inert = i !== index;
    });
  };
  const update = () => {
    frame = 0;
    if (!track.classList.contains('is-scroll-driven')) return;
    if (manualScroll !== null && Math.abs(window.scrollY - manualScroll) < 12) return;
    manualScroll = null;
    const progress = Math.max(0, Math.min(1, (pinTop - track.getBoundingClientRect().top) / travel));
    activate(Math.min(2, Math.floor(progress * 3)));
  };
  const measure = () => {
    const bodyHeight = Math.ceil(Math.max(...layers.map(layer => layer.querySelector('.enterprise-layer-content').getBoundingClientRect().height)));
    track.style.setProperty('--layer-body', bodyHeight + 'px');
    const styles = getComputedStyle(track);
    pinTop = parseFloat(styles.getPropertyValue('--pin-top'));
    const headerHeight = layers.reduce((sum,layer) => sum + layer.querySelector('button').getBoundingClientRect().height, 0);
    const heading = track.querySelector('.enterprise-feature-heading');
    const headingHeight = heading.getBoundingClientRect().height + parseFloat(getComputedStyle(heading).marginBottom);
    const pinHeight = bodyHeight + headerHeight + headingHeight;
    track.style.setProperty('--pin-height', pinHeight + 'px');
    track.classList.toggle('is-scroll-driven', !mobile.matches && pinHeight + pinTop + 12 <= window.innerHeight);
    travel = Math.max(1, track.offsetHeight - pinHeight);
    update();
  };
  layers.forEach((layer, i) => layer.querySelector('button').addEventListener('click', () => {
    activate(i);
    manualScroll = window.scrollY;
    restart();
  }));
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  new ResizeObserver(measure).observe(track.querySelector('.enterprise-layer-content'));
  function restart(){
    clearInterval(timer);
    if (!mobile.matches || reduced.matches || !visible || document.hidden) return;
    timer = setInterval(() => { if (!stack.contains(document.activeElement)) activate((active + 1) % layers.length); }, 7000);
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart(); }, {threshold:.25}).observe(stack);
  document.addEventListener('visibilitychange', restart);
  mobile.addEventListener('change', () => { measure(); restart(); }); reduced.addEventListener('change', restart);
  window.addEventListener('pagehide', () => clearInterval(timer)); window.addEventListener('pageshow', restart);
  activate(0);
  document.fonts.ready.then(measure);
  track.querySelectorAll('img').forEach(image => image.addEventListener('load', measure, { once: true }));
  const featureInputs = [...track.querySelectorAll('input[type=checkbox]')];
  const status = document.getElementById('enterprise-selection-status');
  const chosen = () => featureInputs.filter(input => input.checked).map(input => input.value);
  featureInputs.forEach(input => input.addEventListener('change', () => {
    const selection = chosen();
    status.textContent = selection.length ? `선택한 기능 ${selection.length}개 · ${selection.join(', ')}` : '선택한 기능과 회사의 업무 방식에 맞춰 개발 범위를 함께 정하며, 목록에 없는 기능도 상담하실 수 있습니다.';
  }));
  document.getElementById('enterprise-selection-cta').addEventListener('click', () => {
    const field = document.getElementById('project');
    if (!field) return;
    const existing = field.value.replace(/\n?\[관심 기능\][^\n]*(?:\n|$)/g, '').trim();
    const selection = chosen();
    field.value = [existing, selection.length ? `[관심 기능] ${selection.join(', ')}` : ''].filter(Boolean).join('\n');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
})();
