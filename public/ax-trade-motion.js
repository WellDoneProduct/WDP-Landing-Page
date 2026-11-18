(() => {
  const stage = document.querySelector('.ax-trade-motion');
  if (!stage) return;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  // [x, y, clockwise rotation, opacity], measured in the Figma 588 × 673 stage.
  const states = {
    pdf:[[410.395,183,25,1],[348,489,0,1],[348,743,0,0],[348,743,0,0]],
    photo:[[75.402,330,-30,1],[199,499,0,1],[199,753,0,0],[199,753,0,0]],
    excel:[[216,518.188,-12,1],[29,505,0,1],[29,759,0,0],[29,759,0,0]],
    'label-pdf':[[391.668,147,25,1],[387,433,0,1],[387,687,0,0],[387,687,0,0]],
    'label-photo':[[75,397.598,-30,1],[240,433,0,1],[240,687,0,0],[240,687,0,0]],
    'label-excel':[[353,588.137,-12,1],[91,433,0,1],[91,687,0,0],[91,687,0,0]],
    'match-sheet':[[596,162,0,0],[596,162,0,0],[337.109,162,0,1],[596,162,0,0]],
    'match-rows':[[-664,221,0,0],[-664,221,0,0],[-187,221,0,1],[-664,221,0,0]],
    output:[[199,665,0,0],[199,665,0,0],[199,665,0,0],[199,211,0,1]],
    'heading-0':[[40,40,0,1],[-170,40,0,0],[-170,40,0,0],[-170,40,0,0]],
    'heading-1':[[40,-154,0,1],[40,40,0,1],[-259,40,0,0],[-259,40,0,0]],
    'heading-2':[[40,-154,0,0],[40,-154,0,1],[40,40,0,1],[-170,40,0,0]],
    'heading-3':[[40,-162,0,0],[40,-162,0,0],[40,-162,0,1],[40,40,0,1]],
  };
  const duration = 11244;
  const moments = [[0,0],[1600,0],[2300,1],[4100,1],[4750,2],[6950,2],[7600,3],[9200,3],[11244,0]];
  const style = ([x,y,rotation,opacity]) => ({transform:`translate(${x}px, ${y}px) rotate(${rotation}deg)`,opacity});
  const animations = Object.entries(states).map(([name,poses]) => {
    const node = stage.querySelector(`[data-trade-layer="${name}"]`);
    Object.assign(node.style, style(poses[3]));
    const frames = moments.map(([time,index]) => ({...style(poses[index]),offset:time/duration,easing:'ease-in-out'}));
    // Reset by dissolving in place, rather than moving everything backwards.
    const last = style(poses[3]);
    frames.splice(8,0,{...last,opacity:0,offset:.91,easing:'linear'},{...style(poses[0]),opacity:0,offset:.911,easing:'ease-out'});
    const animation = node.animate(frames,{duration,iterations:Infinity});
    animation.pause();
    return animation;
  });
  let visible=false, paused=false;
  const toggle=stage.querySelector('.ax-motion-toggle');
  function sync(){
    toggle.hidden=reduced.matches;
    animations.forEach(animation=>{
      if(reduced.matches){animation.cancel();return;}
      if(visible&&!paused&&!document.hidden)animation.play();else animation.pause();
    });
  }
  toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',`무역서류 애니메이션 ${paused?'재생':'일시정지'}`);sync();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15}).observe(stage);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>animations.forEach(a=>a.pause()));
  window.addEventListener('pageshow',sync);
  sync();
})();
