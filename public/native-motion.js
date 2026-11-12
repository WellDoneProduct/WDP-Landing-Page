
(function(){
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var canHover = window.matchMedia && matchMedia('(hover: hover)').matches;
var CSSV = getComputedStyle(document.querySelector(".native-content"));
var E = { slow: CSSV.getPropertyValue('--e-slow').trim(), gentle: CSSV.getPropertyValue('--e-gentle').trim(), quick: CSSV.getPropertyValue('--e-quick').trim(), easein: 'cubic-bezier(.42,0,1,1)' };
var D = { slow: 1.2501, gentle: 1.0221, quick: 0.7443 };
/* Figma spring presets (mass 1): slow k80 c20, gentle k100 c15, quick k300 c20 */
function springFn(k, c, T){ var n = 400, arr = [], x = 0, v = 0, dt = T / n / 8; for (var i = 0; i <= n; i++){ arr.push(x); for (var j = 0; j < 8; j++){ var a = -k * (x - 1) - c * v; v += a * dt; x += v * dt; } } arr[n] = 1; return function(p){ p = Math.max(0, Math.min(1, p)); var f = p * n, i = Math.floor(f); if (i >= n) return 1; return arr[i] + (arr[i+1] - arr[i]) * (f - i); }; }
var SP = { slow: springFn(80, 20, D.slow), gentle: springFn(100, 15, D.gentle) };
function tween(dur, ease, fn, done){ if(reduce){fn(1);if(done)done();return;} var st = null; function f(ts){ if (st === null) st = ts; var p = Math.min(1, (ts - st) / (dur * 1000)); fn(ease(p)); if (p < 1) requestAnimationFrame(f); else if (done) done(); } requestAnimationFrame(f); }

/* ---------- kicker loops: Figma AFTER_TIMEOUT chains ---------- */
function chain(steps){ if (reduce) return; var i = 0; function next(){ var s = steps[i]; setTimeout(function(){ s.go(); i = (i + 1) % steps.length; setTimeout(next, s.dur * 1000); }, s.wait * 1000); } next(); }
function set(el, tr, props){ el.style.transition = tr; for (var k in props) el.style[k] = props[k]; }
// K1 manifesto: prisms drop in one by one (QUICK), hold .8, fall out (SLOW), reset after .8 (SLOW, invisible)
['k1','k1b'].forEach(function(kid){ var svg = document.getElementById(kid); if (!svg) return; var p = [].slice.call(svg.querySelectorAll('.kp')); var X = [0.4, 56, 111.5, 167.1];
  function pose(ys, op, dur, ease){ p.forEach(function(g, i){ set(g, 'transform ' + dur + 's ' + ease + ',opacity ' + dur + 's ' + ease, { transform: 'translate(' + X[i] + 'px,' + ys[i] + 'px)', opacity: op }); }); }
  var q = function(ys){ return { wait: .001, dur: D.quick, go: function(){ pose(ys, 1, D.quick, E.quick); } }; };
  chain([ q([1,-87,-87,-87]), q([1,1,-87,-87]), q([1,1,1,-87]), q([.4,.4,.4,.4]),
    { wait: .8, dur: D.slow, go: function(){ pose([84,84,84,84], 0, D.slow, E.slow); } },
    { wait: .8, dur: D.slow, go: function(){ pose([-87,-87,-87,-87], 0, D.slow, E.slow); } } ]); });
// K2 process: inner edges sweep (EASE_IN .4 -> SLOW -> fade EASE_IN .3 -> instant reset)
(function(){ var svg = document.getElementById('k2'); if (!svg) return; var L = [].slice.call(svg.querySelectorAll('.kl'));
  function pose(xs, op, dur, ease){ L.forEach(function(l, i){ set(l, 'transform ' + dur + 's ' + ease + ',opacity ' + dur + 's ' + ease, { transform: 'translateX(' + xs[i] + 'px)', opacity: op }); }); }
  chain([ { wait: .001, dur: .4, go: function(){ pose([19,74,130,185], 1, .4, E.easein); } },
          { wait: .001, dur: D.slow, go: function(){ pose([0,55,110.5,166], 1, D.slow, E.slow); } },
          { wait: .001, dur: .3, go: function(){ pose([0,55,110.5,166], 0, .3, E.easein); } },
          { wait: .001, dur: .002, go: function(){ pose([27,82.5,138,193.5], 1, .002, 'linear'); } } ]); })();
// K3 services: lean <-> upright (SLOW)
['k3','k3b'].forEach(function(kid){ var svg = document.getElementById(kid); if (!svg) return; var p = [].slice.call(svg.querySelectorAll('.kp')); var S0 = ["matrix(0.97,0.243,-0.243,0.97,8.853,-3.627)", "matrix(0.97,-0.243,0.243,0.97,48.794,6.404)", "matrix(0.97,0.243,-0.243,0.97,110.708,-3.627)", "matrix(0.97,-0.243,0.243,0.97,150.646,6.404)"], S1 = ["matrix(1,0,0,1,0.427,0.424)", "matrix(1,0,0,1,55.982,0.424)", "matrix(1,0,0,1,102.279,0.424)", "matrix(1,0,0,1,157.835,0.424)"];
  function pose(S){ p.forEach(function(g, i){ set(g, 'transform ' + D.slow + 's ' + E.slow, { transform: S[i] }); }); }
  chain([ { wait: .8, dur: D.slow, go: function(){ pose(S1); } }, { wait: .001, dur: D.slow, go: function(){ pose(S0); } } ]); });
// K4 case: slanted <-> crossing (SLOW)
(function(){ var svg = document.getElementById('k4'); if (!svg) return; var p = [].slice.call(svg.querySelectorAll('.kp')); var S0 = ["matrix(1,0,0,1,181.556,0.425)", "matrix(1,0,0,1,65.855,0.425)", "matrix(1,0,0,-1,0.3,64.575)", "matrix(1,0,0,-1,116,64.575)"], S1 = ["matrix(1,0,0,1,111,0.425)", "matrix(1,0,0,1,37,0.425)", "matrix(1,0,0,-1,0.3,64.575)", "matrix(1,0,0,-1,74,64.575)"];
  function pose(S){ p.forEach(function(g, i){ set(g, 'transform ' + D.slow + 's ' + E.slow, { transform: S[i] }); }); }
  chain([ { wait: .001, dur: D.slow, go: function(){ pose(S1); } }, { wait: .3, dur: D.slow, go: function(){ pose(S0); } } ]); })();
/* ---------- MOUSE_ENTER (one-way, Figma) ---------- */
function oneWay(el, fn){ if (!el) return; var done = false; var go = function(){ if (done) return; done = true; fn(); }; el.addEventListener('mouseenter', go);
  if (!canHover && 'IntersectionObserver' in window){ var io = new IntersectionObserver(function(es){ es.forEach(function(x){ if (x.isIntersecting){ go(); io.disconnect(); } }); }, { threshold: .35 }); io.observe(el); } }
// marquee: two circles grow + shift (SLOW spring)
(function(){ var A = document.getElementById('mqA'), B = document.getElementById('mqB'); if (!A) return;
  oneWay(document.getElementById('mq'), function(){ tween(D.slow, SP.slow, function(e){
    A.setAttribute('r', .5 + 836 * e); A.setAttribute('cx', 523.5 + (361.5 - 523.5) * e); A.setAttribute('cy', 79.5 + 4 * e);
    B.setAttribute('r', .5 + 836 * e); B.setAttribute('cx', 1546.5 + (2020.5 - 1546.5) * e); B.setAttribute('cy', 79.5 + 4 * e); }); }); })();
oneWay(document.getElementById('cases'), function(){ document.getElementById('cases').classList.add('on'); });
oneWay(document.getElementById('band'), function(){ document.getElementById('band').classList.add('on'); });

/* ---------- design graphic: smart-animate path morph on card hover ---------- */
[].slice.call(document.querySelectorAll('.pcard')).forEach(function(card){
  var ms = [].slice.call(card.querySelectorAll('.morph')); if (!ms.length) return;
  ms.forEach(function(m){ m._a = (m.getAttribute('d').match(/-?\d+(\.\d+)?/g) || []).map(Number); m._b = (m.getAttribute('data-d1').match(/-?\d+(\.\d+)?/g) || []).map(Number); m._t = m.getAttribute('d'); m._v = 0; });
  function run(to){ ms.forEach(function(m){ var from = m._v, id = (m._id || 0) + 1; m._id = id;
    tween(D.slow, SP.slow, function(e){ if (m._id !== id) return; var v = from + (to - from) * e; m._v = v; var i = 0;
      m.setAttribute('d', m._t.replace(/-?\d+(\.\d+)?/g, function(){ var a = m._a[i], b = m._b[i]; i++; return (a + (b - a) * v).toFixed(2); })); }); }); }
  card.addEventListener('mouseenter', function(){ run(1); }); card.addEventListener('mouseleave', function(){ run(0); });
  card.addEventListener('focus', function(){ run(1); }); card.addEventListener('blur', function(){ run(0); });
});

var LU = 38.69, LR = 67.02, D0 = .9;
function stand(cx, sl){ var TL=[cx-1,0],TR=[cx+1,0],BR=[cx+1,4],BL=[cx-1,4]; if(!sl) return {F:[TL,TR,BR,BL],K:[TL,[TL[0]+D0,0],[TR[0]+D0,0],TR],S:[TR,[TR[0]+D0,0],[BR[0]+D0,4],BR]}; return {F:[BL,BR,TR,TL],K:[BL,BR,[BR[0]+D0,4],[BL[0]+D0,4]],S:[BR,TR,[TR[0]+D0,0],[BR[0]+D0,4]]}; }
var FR = { S:[stand(1,0),stand(7,1),stand(13,0),stand(19,1)],
  C:[{F:[[0,1],[2,1],[5,4],[3,4]],K:[[0,1],[1,0],[3,0],[2,1]],S:[[2,1],[3,0],[6,3],[5,4]]},{F:[[6,3],[8,3],[11,0],[9,0]],K:[[6,3],[8,3],[9,4],[7,4]],S:[[8,3],[11,0],[12,1],[9,4]]},{F:[[10,1],[12,1],[15,4],[13,4]],K:[[10,1],[11,0],[13,0],[12,1]],S:[[12,1],[13,0],[16,3],[15,4]]},{F:[[16,3],[18,3],[21,0],[19,0]],K:[[16,3],[18,3],[19,4],[17,4]],S:[[18,3],[21,0],[22,1],[19,4]]}],
  L:[{F:[[0,1],[2,1],[3,2],[2,3]],K:[[0,1],[0,1],[2,1],[2,1]],S:[[2,1],[3,0],[4,1],[3,2]]},{F:[[4,3],[4,3],[7,0],[7,0]],K:[[2,3],[4,3],[5,4],[3,4]],S:[[4,3],[7,0],[8,1],[5,4]]},{F:[[4,1],[6,1],[5,2],[5,2]],K:[[4,1],[4,1],[6,1],[6,1]],S:[[6,1],[6,1],[5,2],[5,2]]},{F:[[8,3],[8,3],[11,0],[11,0]],K:[[6,3],[8,3],[9,4],[7,4]],S:[[8,3],[11,0],[12,1],[9,4]]}] };
var SEG = [['go',.26,'L','S'],['hold',.06,'S'],['go',.36,'S','C'],['hold',.08,'C'],['go',.3,'C','L']], TOT = 1.06;
function eio(x){ return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; } function cl(x){ return Math.max(0,Math.min(1,x)); }
/* contact: the same symbol motion, looping on its own (stand -> cross -> W, hold, repeat) */
(function(){ var svg=document.getElementById('k5'); if(!svg) return; var U5=10.8, R5=10.8*Math.sqrt(3), ps=[];
  for (var i=0;i<12;i++){ var q=document.createElementNS('http://www.w3.org/2000/svg','polygon'); q.setAttribute('fill','#fff'); q.setAttribute('stroke','#fff'); q.setAttribute('vector-effect','non-scaling-stroke'); svg.appendChild(q); ps.push(q); }
  var CEN={L:6,S:10.45,C:11};
  function draw(t){ var a='L',b='L',e=0,solid=1;
    if (t<TOT){ var acc=0; for (var i=0;i<SEG.length;i++){ var s=SEG[i]; if (t<=acc+s[1]||i===SEG.length-1){ var u=cl((t-acc)/s[1]); if (s[0]==='hold'){ a=b=s[2]; solid=0; } else { a=s[2]; b=s[3]; e=eio(u); solid = i===0 ? 1-cl(u/.6) : (i===2 ? 0 : cl((u-.3)/.5)); } break; } acc+=s[1]; } }
    var A=FR[a],B=FR[b],sh=6-(CEN[a]+(CEN[b]-CEN[a])*e),o=[0,2,1,3],fs=['S','K','F'],n=0;
    for (var oi=0;oi<4;oi++) for (var fi=0;fi<3;fi++){ var bi=o[oi],f=fs[fi],P=A[bi][f],Q=B[bi][f],pts=[];
      for (var k=0;k<4;k++) pts.push((((P[k][0]+(Q[k][0]-P[k][0])*e)+sh)*U5).toFixed(1)+','+((P[k][1]+(Q[k][1]-P[k][1])*e)*R5).toFixed(1));
      var pl=ps[n++]; pl.setAttribute('points',pts.join(' ')); pl.setAttribute('fill-opacity',solid.toFixed(3)); pl.setAttribute('stroke-width', solid>=.999?.4:1); } }
  draw(TOT); if (reduce) return;
  var SLOW=2.2, HOLD=1.4, st=null;   // the contact mark plays the 1.06s motion at a calmer pace
  function step(ts){ if(st===null) st=ts; var t=(ts-st)/1000; var cyc=TOT*SLOW+HOLD; t=t%cyc; draw(t<TOT*SLOW ? t/SLOW : TOT); requestAnimationFrame(step); }
  requestAnimationFrame(step); })();
/* ---------- marquee: fit the whole sentence to the viewport width ---------- */
(function(){ var svg=document.getElementById('mq'); if(!svg) return; var t=document.getElementById('mqp');
  function fit(){ try{ var b=t.getBBox(); if(!b.width) return; svg.setAttribute('viewBox',(b.x-6).toFixed(1)+' '+(b.y-4).toFixed(1)+' '+(b.width+12).toFixed(1)+' '+(b.height+8).toFixed(1)); }catch(e){} }
  fit(); if (document.fonts) document.fonts.ready.then(fit); setTimeout(fit,500); })();


})();
