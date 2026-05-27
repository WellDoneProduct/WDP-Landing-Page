'use client';

export default function SplineScene() {
  return (
    <iframe
      src="https://my.spline.design/interactiveaiwebsite-Yo2FZcWa4X0jb0XarZDCyUG9/"
      frameBorder="0"
      title="Systemic 3D Background"
      allow="autoplay"
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        filter: 'brightness(1.15) saturate(0.80)',
        mixBlendMode: 'multiply',
        willChange: 'transform',
        transform: 'translateZ(0)',
        // iframe이 스크롤 이벤트를 가로채지 않도록 — 핵심 jank 원인 제거
        pointerEvents: 'none',
      }}
    />
  );
}
