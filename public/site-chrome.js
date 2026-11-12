/* Shared by the static home and React pages. Each element owns its listeners. */
(() => {
  if (customElements.get('wdp-header')) return;
  function setupLogoMotion(header, signal) {
if(!header.querySelector('#sym')) return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var LU = 38.69, LR = 67.02, D0 = .9;
function stand(cx, sl){ var TL=[cx-1,0],TR=[cx+1,0],BR=[cx+1,4],BL=[cx-1,4]; if(!sl) return {F:[TL,TR,BR,BL],K:[TL,[TL[0]+D0,0],[TR[0]+D0,0],TR],S:[TR,[TR[0]+D0,0],[BR[0]+D0,4],BR]}; return {F:[BL,BR,TR,TL],K:[BL,BR,[BR[0]+D0,4],[BL[0]+D0,4]],S:[BR,TR,[TR[0]+D0,0],[BR[0]+D0,4]]}; }
var FR = { S:[stand(1,0),stand(7,1),stand(13,0),stand(19,1)],
  C:[{F:[[0,1],[2,1],[5,4],[3,4]],K:[[0,1],[1,0],[3,0],[2,1]],S:[[2,1],[3,0],[6,3],[5,4]]},{F:[[6,3],[8,3],[11,0],[9,0]],K:[[6,3],[8,3],[9,4],[7,4]],S:[[8,3],[11,0],[12,1],[9,4]]},{F:[[10,1],[12,1],[15,4],[13,4]],K:[[10,1],[11,0],[13,0],[12,1]],S:[[12,1],[13,0],[16,3],[15,4]]},{F:[[16,3],[18,3],[21,0],[19,0]],K:[[16,3],[18,3],[19,4],[17,4]],S:[[18,3],[21,0],[22,1],[19,4]]}],
  L:[{F:[[0,1],[2,1],[3,2],[2,3]],K:[[0,1],[0,1],[2,1],[2,1]],S:[[2,1],[3,0],[4,1],[3,2]]},{F:[[4,3],[4,3],[7,0],[7,0]],K:[[2,3],[4,3],[5,4],[3,4]],S:[[4,3],[7,0],[8,1],[5,4]]},{F:[[4,1],[6,1],[5,2],[5,2]],K:[[4,1],[4,1],[6,1],[6,1]],S:[[6,1],[6,1],[5,2],[5,2]]},{F:[[8,3],[8,3],[11,0],[11,0]],K:[[6,3],[8,3],[9,4],[7,4]],S:[[8,3],[11,0],[12,1],[9,4]]}] };
var SEG = [['go',.26,'L','S'],['hold',.06,'S'],['go',.36,'S','C'],['hold',.08,'C'],['go',.3,'C','L']], TOT = 1.06;
function eio(x){ return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; } function cl(x){ return Math.max(0,Math.min(1,x)); }
var sym = header.querySelector('#sym'), wm = header.querySelector('#wm'), polys = [];
var symStatic=header.querySelector('#symStatic');
for (var i=0;i<12;i++){ var pg=document.createElementNS('http://www.w3.org/2000/svg','polygon'); pg.setAttribute('vector-effect','non-scaling-stroke'); sym.appendChild(pg); polys.push(pg); }
function apply(t){ var a='L',b='L',e=0,solid=1,w=1;
  if (t<TOT){ var acc=0; for (var i=0;i<SEG.length;i++){ var s=SEG[i]; if (t<=acc+s[1]||i===SEG.length-1){ var u=cl((t-acc)/s[1]); if (s[0]==='hold'){ a=b=s[2]; solid=0; w=0; } else { a=s[2]; b=s[3]; e=eio(u); if(i===0){solid=1-cl(u/.6); w=1-cl(u/.7);} else if(i===2){solid=0; w=0;} else {solid=cl((u-.3)/.5); w=cl((u-.55)/.45);} } break; } acc+=s[1]; } }
  var A=FR[a],B=FR[b],o=[0,2,1,3],fs=['S','K','F'],n=0, FW={L:12,S:20.9,C:22}, CX={L:6,S:10.45,C:11};
  var fw=FW[a]+(FW[b]-FW[a])*e, cx=CX[a]+(CX[b]-CX[a])*e, kf=12/fw;
  for (var oi=0;oi<4;oi++) for (var fi=0;fi<3;fi++){ var bi=o[oi],f=fs[fi],P=A[bi][f],Q=B[bi][f],pts=[]; for (var k=0;k<4;k++){ var X=P[k][0]+(Q[k][0]-P[k][0])*e, Y=P[k][1]+(Q[k][1]-P[k][1])*e; pts.push(((6+(X-cx)*kf)*LU).toFixed(1)+','+((2+(Y-2)*kf)*LR).toFixed(1)); } var pl=polys[n++]; pl.setAttribute('points',pts.join(' ')); pl.setAttribute('fill-opacity',solid.toFixed(3)); pl.setAttribute('stroke-width', solid>=.999?.4:.6); }
  }
apply(TOT);
var logo=header.querySelector('#logo'), hov=false, run=false;
function showMotion(on){ sym.style.opacity=on?1:0; symStatic.style.opacity=on?0:1; logo.classList.toggle('moving',on); }
function play(){ hov=true; if (run||reduce) return; run=true; showMotion(true); var st=null; function step(ts){ if(signal.aborted || !logo.isConnected){run=false;return;} if(st===null) st=ts; var t=(ts-st)/1000; if (t>=TOT){ apply(TOT); if (t<TOT+.32){ requestAnimationFrame(step); return; } if (hov){ st=ts; requestAnimationFrame(step); return; } run=false; showMotion(false); return; } apply(t); requestAnimationFrame(step); } requestAnimationFrame(step); }
logo.addEventListener('mouseenter',play,{signal});
logo.addEventListener('focus',play,{signal});
logo.addEventListener('mouseleave',()=>{hov=false},{signal});
logo.addEventListener('blur',()=>{hov=false},{signal});

}
  class Header extends HTMLElement {
    connectedCallback() {
      if (!this.querySelector('header')) this.innerHTML = "<header class=\"wdp-header\"><div class=\"wdp-header-inner\"><a class=\"wdp-logo\" id=\"logo\" href=\"/\" aria-label=\"웰던프로덕트 홈\"><svg viewBox=\"0 0 960 269\" aria-hidden=\"true\"><g id=\"wm\"><path d=\"M564.047 70.1844L551.88 24.6577L539.713 70.1844H525.751L509.046 5.06079H522.485L533.006 49.2411L544.974 5.06079H559.036L570.654 49.4157L581.276 5.06079H594.789L578.01 70.1844H564.047Z\" fill=\"white\"></path><path d=\"M646.399 58.2168V70.1844H602.593V5.06079H645.776V17.0284H616.381V30.7163H643.058V42.6091H616.381V58.2168H646.399Z\" fill=\"white\"></path><path d=\"M699.207 70.1844H657.121V5.06079H670.908V57.7681H699.207V70.2094V70.1844Z\" fill=\"white\"></path><path d=\"M750.742 70.1844H708.656V5.06079H722.444V57.7681H750.742V70.2094V70.1844Z\" fill=\"white\"></path><path d=\"M537.743 165.975H514.606V100.851H537.743C544.65 100.851 550.559 102.223 555.52 104.94C560.482 107.658 564.297 111.448 566.964 116.285C569.632 121.121 570.954 126.731 570.954 133.064C570.954 139.397 569.582 144.982 566.865 149.993C564.147 154.98 560.282 158.894 555.296 161.736C550.309 164.579 544.45 166 537.743 166V165.975ZM528.394 112.744V154.107H537.02C541.384 154.107 545.024 153.284 547.941 151.664C550.883 150.043 553.077 147.65 554.573 144.508C556.044 141.367 556.792 137.552 556.792 133.064C556.792 128.576 556.044 125.036 554.573 121.994C553.102 118.977 550.883 116.683 547.941 115.113C544.999 113.542 541.359 112.744 537.02 112.744H528.394Z\" fill=\"white\"></path><path d=\"M610.047 167.347C605.335 167.347 600.972 166.499 596.933 164.804C592.919 163.108 589.378 160.74 586.362 157.673C583.345 154.631 580.976 151.016 579.281 146.877C577.585 142.738 576.738 138.226 576.738 133.314C576.738 128.402 577.585 123.914 579.281 119.8C580.976 115.687 583.345 112.121 586.362 109.104C589.378 106.088 592.919 103.719 596.933 102.024C600.947 100.328 605.335 99.4805 610.047 99.4805C614.76 99.4805 619.148 100.328 623.212 102.024C627.251 103.719 630.816 106.088 633.883 109.104C636.925 112.121 639.318 115.687 641.014 119.8C642.709 123.914 643.557 128.427 643.557 133.314C643.557 138.201 642.709 142.738 641.014 146.877C639.318 151.016 636.95 154.606 633.883 157.673C630.816 160.74 627.276 163.108 623.212 164.804C619.148 166.499 614.785 167.347 610.047 167.347ZM610.047 155.005C613.014 155.005 615.682 154.457 618.076 153.335C620.469 152.213 622.489 150.667 624.159 148.672C625.83 146.678 627.101 144.359 627.974 141.741C628.847 139.123 629.295 136.306 629.295 133.364C629.295 130.422 628.847 127.629 627.974 125.011C627.101 122.418 625.83 120.125 624.159 118.155C622.489 116.185 620.469 114.639 618.076 113.517C615.682 112.395 613.014 111.847 610.047 111.847C607.081 111.847 604.413 112.42 602.069 113.517C599.701 114.639 597.706 116.185 596.035 118.155C594.365 120.125 593.093 122.393 592.221 125.011C591.348 127.604 590.899 130.397 590.899 133.364C590.899 136.331 591.348 139.123 592.221 141.741C593.093 144.384 594.365 146.678 596.035 148.672C597.706 150.667 599.701 152.238 602.069 153.335C604.438 154.457 607.081 155.005 610.047 155.005Z\" fill=\"white\"></path><path d=\"M695.491 165.975L665.647 120.523V165.975H653.031V100.851H667.916L696.314 144.034V100.851H709.005V165.975H695.491Z\" fill=\"white\"></path><path d=\"M766.249 154.007V165.975H722.443V100.851H765.626V112.819H736.231V126.507H762.908V138.4H736.231V154.007H766.249Z\" fill=\"white\"></path><path d=\"M538.641 241.82H528.394V263.037H514.606V197.914H538.641C543.952 197.914 548.539 198.737 552.379 200.357C556.219 201.978 559.185 204.421 561.255 207.613C563.349 210.829 564.396 214.818 564.396 219.58C564.396 224.342 563.349 228.307 561.255 231.647C559.161 234.964 556.194 237.507 552.379 239.227C548.539 240.947 543.952 241.82 538.641 241.82ZM538.566 209.532H528.419V230.201H538.566C542.431 230.201 545.423 229.254 547.542 227.334C549.661 225.439 550.708 222.871 550.708 219.68C550.708 216.489 549.661 213.97 547.542 212.2C545.423 210.43 542.431 209.532 538.566 209.532Z\" fill=\"white\"></path><path d=\"M587.534 263.037H573.746V197.914H599.227C607.455 197.914 613.838 199.734 618.375 203.399C622.913 207.064 625.182 212.275 625.182 219.032C625.182 223.395 623.885 227.234 621.317 230.6C618.749 233.966 615.134 236.385 610.472 237.906L627.251 263.037H610.821L596.135 240H587.509V263.037H587.534ZM587.534 209.333V228.656H598.604C602.768 228.656 605.959 227.858 608.128 226.262C610.297 224.666 611.394 222.248 611.394 219.057C611.394 215.865 610.297 213.347 608.128 211.751C605.959 210.156 602.768 209.358 598.604 209.358H587.534V209.333Z\" fill=\"white\"></path><path d=\"M664.999 264.409C660.287 264.409 655.923 263.561 651.884 261.866C647.87 260.171 644.33 257.802 641.313 254.735C638.296 251.694 635.928 248.078 634.232 243.94C632.537 239.801 631.689 235.288 631.689 230.376C631.689 225.465 632.537 220.977 634.232 216.863C635.928 212.749 638.296 209.184 641.313 206.167C644.33 203.15 647.87 200.781 651.884 199.086C655.899 197.391 660.287 196.543 664.999 196.543C669.711 196.543 674.099 197.391 678.163 199.086C682.202 200.781 685.768 203.15 688.834 206.167C691.876 209.184 694.27 212.749 695.965 216.863C697.66 220.977 698.508 225.49 698.508 230.376C698.508 235.263 697.66 239.801 695.965 243.94C694.27 248.078 691.901 251.669 688.834 254.735C685.768 257.802 682.227 260.171 678.163 261.866C674.099 263.561 669.736 264.409 664.999 264.409ZM664.999 252.068C667.966 252.068 670.634 251.519 673.027 250.397C675.421 249.275 677.44 247.729 679.111 245.735C680.781 243.74 682.053 241.421 682.925 238.804C683.798 236.186 684.247 233.368 684.247 230.426C684.247 227.484 683.798 224.692 682.925 222.074C682.053 219.481 680.781 217.187 679.111 215.217C677.44 213.248 675.421 211.702 673.027 210.58C670.634 209.458 667.966 208.909 664.999 208.909C662.032 208.909 659.364 209.483 657.021 210.58C654.652 211.702 652.657 213.248 650.987 215.217C649.316 217.187 648.045 219.456 647.172 222.074C646.3 224.667 645.851 227.459 645.851 230.426C645.851 233.393 646.3 236.186 647.172 238.804C648.045 241.446 649.316 243.74 650.987 245.735C652.657 247.729 654.652 249.3 657.021 250.397C659.389 251.519 662.032 252.068 664.999 252.068Z\" fill=\"white\"></path><path d=\"M731.145 263.037H708.007V197.914H731.145C738.051 197.914 743.96 199.285 748.922 202.003C753.883 204.72 757.698 208.51 760.366 213.347C763.033 218.184 764.355 223.794 764.355 230.127C764.355 236.459 762.984 242.044 760.266 247.056C757.548 252.042 753.684 255.957 748.697 258.799C743.711 261.641 737.852 263.062 731.145 263.062V263.037ZM721.795 209.782V251.145H730.422C734.785 251.145 738.425 250.322 741.342 248.701C744.284 247.081 746.478 244.687 747.974 241.546C749.445 238.404 750.193 234.59 750.193 230.102C750.193 225.614 749.445 222.073 747.974 219.032C746.503 216.015 744.284 213.721 741.342 212.15C738.4 210.58 734.76 209.782 730.422 209.782H721.795Z\" fill=\"white\"></path><path d=\"M827.384 197.914V238.28C827.384 243.416 826.337 247.953 824.268 251.893C822.173 255.832 819.132 258.899 815.142 261.093C811.153 263.312 806.316 264.409 800.632 264.409C794.947 264.409 790.01 263.312 786.021 261.093C782.032 258.874 778.99 255.807 776.896 251.893C774.802 247.978 773.754 243.441 773.754 238.28V197.914H787.542V238.554C787.542 241.222 787.991 243.565 788.913 245.635C789.811 247.679 791.232 249.275 793.127 250.397C795.022 251.519 797.515 252.067 800.607 252.067C803.698 252.067 806.092 251.519 808.012 250.397C809.931 249.275 811.328 247.679 812.225 245.635C813.123 243.565 813.597 241.222 813.597 238.554V197.914H827.384Z\" fill=\"white\"></path><path d=\"M939.406 263.038H925.618V210.331H905.124V197.89H960V210.331H939.406V263.038Z\" fill=\"white\"></path><path d=\"M887.247 235.313C886.649 237.756 885.676 239.95 884.305 241.92C882.634 244.313 880.54 246.183 877.997 247.554C875.454 248.901 872.636 249.599 869.57 249.599C866.727 249.599 864.184 249.075 861.915 248.003C859.647 246.956 857.677 245.435 856.031 243.515C854.361 241.571 853.089 239.302 852.217 236.659C851.344 234.041 850.895 231.099 850.895 227.908C850.895 224.716 851.344 221.874 852.217 219.256C853.089 216.613 854.361 214.344 856.031 212.4C857.702 210.455 859.672 208.984 861.915 207.962C864.184 206.939 866.727 206.416 869.57 206.416C872.661 206.416 875.454 207.089 877.972 208.41C880.49 209.732 882.609 211.602 884.33 213.945C885.751 215.89 886.723 218.109 887.297 220.602H901.982C901.134 215.691 899.339 211.328 896.621 207.513C893.605 203.274 889.74 199.983 885.053 197.615C880.366 195.246 875.155 194.074 869.395 194.074C864.858 194.074 860.594 194.947 856.605 196.667C852.616 198.388 849.125 200.806 846.183 203.873C843.216 206.964 840.897 210.53 839.252 214.619C837.581 218.708 836.759 223.121 836.759 227.908C836.759 232.695 837.581 237.133 839.252 241.246C840.922 245.36 843.216 248.976 846.183 252.092C849.15 255.209 852.616 257.627 856.605 259.347C860.594 261.068 864.858 261.94 869.395 261.94C875.13 261.94 880.341 260.769 885.003 258.4C889.665 256.031 893.505 252.74 896.522 248.502C899.264 244.687 901.059 240.274 901.957 235.313H887.247Z\" fill=\"white\"></path></g><g id=\"symStatic\"><path d=\"M309.562 67.0185L193.476 268.099H116.086L77.3905 201.056H154.781L193.476 134.037L154.781 67.0185H232.171L270.867 0L309.562 67.0185Z\" fill=\"white\"></path><path d=\"M154.781 67.0185L116.111 134.037L77.4153 201.056L0 67.0185H77.4153L116.111 0L154.781 67.0185Z\" fill=\"white\"></path><path d=\"M464.343 67.0185L348.257 268.099H270.867L232.172 201.056H309.562L425.648 0L464.343 67.0185Z\" fill=\"white\"></path></g><g id=\"sym\" style=\"opacity:0\"></g></svg></a><nav class=\"wdp-nav\" aria-label=\"주 메뉴\"><details class=\"native-business\"><summary>사업영역<svg class=\"business-chevron\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"m2.5 4.5 3.5 3 3.5-3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/></svg></summary><div class=\"native-business-panel\"><a href=\"/\" aria-current=\"page\">AI-Native 개발사 웰던프로덕트</a><span aria-disabled=\"true\">웹·앱 서비스 개발 <small>준비 중</small></span><span aria-disabled=\"true\">기업 시스템 개발 <small>준비 중</small></span><span aria-disabled=\"true\">AI 시스템 개발 <small>준비 중</small></span><span aria-disabled=\"true\">AX 업무 자동화 <small>준비 중</small></span><span aria-disabled=\"true\">AI 기반 노후화 시스템 현대화 <small>준비 중</small></span><span aria-disabled=\"true\">전사 AI 관리 시스템 구축 <small>준비 중</small></span></div></details><a href=\"/portfolio\">포트폴리오</a><a href=\"/blog\">블로그</a><a href=\"/news\">언론 보도</a></nav><a class=\"wdp-contact\" href=\"/#cta\">상담받기</a><button class=\"wdp-menu-toggle\" aria-label=\"메뉴 열기\" aria-expanded=\"false\" aria-controls=\"wdp-mobile-menu\"><span></span><span></span><span></span></button></div><nav id=\"wdp-mobile-menu\" class=\"wdp-mobile-menu\" aria-label=\"모바일 메뉴\" hidden><div class=\"native-mobile-business\"><strong>사업영역</strong><a href=\"/\" aria-current=\"page\">AI-Native 개발사 웰던프로덕트</a><span aria-disabled=\"true\">웹·앱 서비스 개발 <small>준비 중</small></span><span aria-disabled=\"true\">기업 시스템 개발 <small>준비 중</small></span><span aria-disabled=\"true\">AI 시스템 개발 <small>준비 중</small></span><span aria-disabled=\"true\">AX 업무 자동화 <small>준비 중</small></span><span aria-disabled=\"true\">AI 기반 노후화 시스템 현대화 <small>준비 중</small></span><span aria-disabled=\"true\">전사 AI 관리 시스템 구축 <small>준비 중</small></span></div><a href=\"/portfolio\">포트폴리오</a><a href=\"/blog\">블로그</a><a href=\"/news\">언론 보도</a><a href=\"/#cta\">상담받기</a></nav></header>";
      const header = this.querySelector('header');
      const menu = this.querySelector('.wdp-mobile-menu');
      const toggle = this.querySelector('.wdp-menu-toggle');
      const abort = new AbortController();
      this.cleanup = () => abort.abort();
      const options = { signal: abort.signal };
      setupLogoMotion(this, abort.signal);
      const business = this.querySelector('.native-business');
      document.addEventListener('click', e => { if (business && !business.contains(e.target)) business.open = false; }, options);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && business?.open) { business.open = false; business.querySelector('summary').focus(); } }, options);
      this.querySelectorAll('nav a').forEach(a => {
        a.removeAttribute('aria-current');
        if (a.getAttribute('href') === '/' ? location.pathname === '/' : location.pathname.startsWith(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
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
