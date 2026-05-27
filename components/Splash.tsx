'use client';

import { useEffect, useState } from 'react';


export default function Splash() {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [slideUp,  setSlideUp]  = useState(false);

  useEffect(() => {
    // 24시간 이내 재방문 스킵
    const stored = localStorage.getItem('splash-ts');
    if (stored && Date.now() - Number(stored) < 24 * 60 * 60 * 1000) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    let current = 0;
    const tick = () => {
      // 진행도에 따라 증가량을 감속 (자연스러운 로딩감)
      // 총 약 5초에 걸쳐 0→100% 감속
      const increment =
        current < 60 ? 1.8 :
        current < 85 ? 0.9 :
        current < 98 ? 0.45 : 0.15;

      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current < 100) {
        timer = window.setTimeout(tick, 40);
      } else {
        // 완료 후 잠깐 대기 → 슬라이드 업
        window.setTimeout(() => {
          setSlideUp(true);
          // 슬라이드 애니메이션(0.7s) 후 언마운트
          window.setTimeout(() => {
            setVisible(false);
            document.body.style.overflow = '';
            localStorage.setItem('splash-ts', String(Date.now()));
          }, 750);
        }, 350);
      }
    };

    let timer = window.setTimeout(tick, 40);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5"
      style={{
        background: '#FFFFFF',
        transform: slideUp ? 'translateY(-100%)' : 'translateY(0)',
        transition: slideUp ? 'transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }}
    >
      {/* 상태 레이블 */}
      <p
        className="text-sm font-medium tracking-tight"
        style={{ color: '#9CA3AF' }}
      >
        Getting ready &apos;welldone&apos;...
      </p>

      {/* Progress bar */}
      <div
        className="rounded-full overflow-hidden"
        style={{ width: 200, height: 6, background: '#F3F4F6' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0048FF, #3B82F6)',
            transition: 'width 0.08s linear',
          }}
        />
      </div>

      {/* 퍼센트 */}
      <p
        className="text-xs tabular-nums"
        style={{ color: '#D1D5DB' }}
      >
        {Math.round(progress)}%
      </p>
    </div>
  );
}
