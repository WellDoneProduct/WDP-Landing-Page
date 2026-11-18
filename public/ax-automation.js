(() => {
  const mobile = matchMedia('(max-width:768px), (hover:none)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  function cycle(root, count, render) {
    let index = 0, visible = false, timer;
    function restart() {
      clearInterval(timer);
      if (!mobile.matches || reduced.matches || !visible || document.hidden) return;
      timer = setInterval(() => {
        if (root.contains(document.activeElement)) return;
        index = (index + 1) % count; render(index);
      }, 8000);
    }
    new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; restart();}, {threshold:.15}).observe(root);
    document.addEventListener('visibilitychange', restart);
    mobile.addEventListener('change', restart); reduced.addEventListener('change', restart);
    window.addEventListener('pagehide', () => clearInterval(timer));
    window.addEventListener('pageshow', restart);
    return next => {index = next; render(index); restart();};
  }
  const root = document.querySelector('#ax-examples');
  const buttons = [...root.querySelectorAll('[data-example]')];
  const panels = [...root.querySelectorAll('.ax-example-panel')];
  panels.forEach(panel => {
    const track = panel.querySelector('.ax-paired-flow');
    const cards = [...track.children];
    const controls = document.createElement('div');
    controls.className = 'ax-swipe-controls';
    controls.innerHTML = '<p class="ax-swipe-hint">옆으로 넘겨 다음 단계 보기</p><div class="ax-swipe-pagination"><button type="button" aria-label="이전 단계">←</button><output aria-live="polite" aria-label="현재 단계">1 / 4</output><button type="button" aria-label="다음 단계">→</button></div>';
    track.before(controls);
    const [previous,next] = controls.querySelectorAll('button');
    const position = controls.querySelector('output');
    let index = 0, frame;
    function update() {
      if (panel.hidden) return;
      const origin = track.getBoundingClientRect().left;
      index = cards.reduce((best,card,i) => Math.abs(card.getBoundingClientRect().left-origin) < Math.abs(cards[best].getBoundingClientRect().left-origin) ? i : best,0);
      position.value = `${index+1} / ${cards.length}`;
      previous.disabled=index===0; next.disabled=index===cards.length-1;
    }
    function move(direction) {
      const target=cards[Math.max(0,Math.min(cards.length-1,index+direction))];
      track.scrollBy({left:target.getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:reduced.matches?'instant':'smooth'});
    }
    previous.addEventListener('click',()=>move(-1)); next.addEventListener('click',()=>move(1));
    track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
    track.addEventListener('keydown',event=>{
      if (!matchMedia('(max-width:768px)').matches || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();move(event.key==='ArrowRight'?1:-1);
    });
    new ResizeObserver(update).observe(track);
    update();
  });
  const select = index => {
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => {panel.hidden = i !== index;});
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      const keys = {ArrowRight:(index+1)%buttons.length, ArrowLeft:(index+buttons.length-1)%buttons.length, Home:0, End:buttons.length-1};
      if (!(event.key in keys)) return;
      event.preventDefault(); const next = keys[event.key]; buttons[next].focus(); select(next);
    });
  });
  const fit = document.querySelector('.ax-fit');
  const options = [...fit.querySelectorAll('.ax-fit-option')];
  const images = [...fit.querySelectorAll('.ax-fit-image')];
  const activate = cycle(fit, options.length, index => options.forEach((option,i) => {
    const active = i === index;
    option.classList.toggle('is-active', active);
    option.querySelector('button').setAttribute('aria-expanded', String(active));
    option.querySelector('.ax-fit-panel').inert = !active;
    option.querySelector('.ax-fit-panel').setAttribute('aria-hidden', String(!active));
    images[i].classList.toggle('is-active', active);
  }));
  options.forEach((option,index) => option.querySelector('button').addEventListener('click',()=>activate(index)));
  document.querySelectorAll('[data-consult-topic]').forEach(link => link.addEventListener('click', () => {
    const project = document.querySelector('#project');
    const topic = 'AX 업무 자동화 · 상담할 업무: ' + link.dataset.consultTopic;
    project.value = [topic, ...project.value.split('\n').filter(line => !line.startsWith('AX 업무 자동화 · 상담할 업무: '))].join('\n').trim();
  }));
})();
