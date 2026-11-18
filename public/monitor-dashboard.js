(() => {
  const root=document.querySelector('.md-carousel');
  if(!root)return;
  const slides=[...root.querySelectorAll('.md-slide')];
  const tabs=[...root.querySelectorAll('[role=tab]')];
  const prev=root.querySelector('.md-prev');
  const next=root.querySelector('.md-next');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let index=0,visible=false,paused=false,hovered=false,timer,start;
  function fit(){root.style.setProperty('--md-scale',root.clientWidth/1300);}
  new ResizeObserver(fit).observe(root);fit();
  function schedule(){clearTimeout(timer);if(visible&&!paused&&!hovered&&!root.contains(document.activeElement)&&!reduced.matches&&!document.hidden)timer=setTimeout(()=>{show((index+1)%slides.length,1);},6500);}
  function show(next,direction=next>=index?1:-1){
    const changed=next!==index;
    index=next;slides.forEach((slide,i)=>{slide.hidden=i!==index;});tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    if(changed&&!reduced.matches){
      const slide=slides[index];
      const screen=slide.querySelector('.md-screen-viewport');
      const caption=slide.querySelector('figcaption');
      for(const element of [screen,caption])element.getAnimations().forEach(animation=>animation.cancel());
      screen.animate([{opacity:.35,transform:`translateX(${direction*24}px)`},{opacity:1,transform:'translateX(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
      caption.animate([{opacity:0},{opacity:1}],{duration:260,easing:'ease-out'});
    }
    schedule();
  }
  function manual(next,direction){paused=true;show(next,direction);}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>manual(i));tab.addEventListener('keydown',event=>{const keys={ArrowRight:(i+1)%3,ArrowLeft:(i+2)%3,Home:0,End:2};if(!(event.key in keys))return;event.preventDefault();manual(keys[event.key]);tabs[index].focus();});});
  prev.addEventListener('click',()=>manual((index+slides.length-1)%slides.length,-1));
  next.addEventListener('click',()=>manual((index+1)%slides.length,1));
  root.addEventListener('pointerenter',event=>{if(event.pointerType!=='mouse')return;hovered=true;clearTimeout(timer);});
  root.addEventListener('pointerleave',()=>{hovered=false;schedule();});
  root.addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  root.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))manual((index+(dx<0?1:2))%3,dx<0?1:-1);},{passive:true});
  root.addEventListener('focusin',()=>clearTimeout(timer));
  root.addEventListener('focusout',()=>requestAnimationFrame(schedule));
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.2}).observe(root);
  reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);
  window.addEventListener('pagehide',()=>clearTimeout(timer));window.addEventListener('pageshow',schedule);
})();
