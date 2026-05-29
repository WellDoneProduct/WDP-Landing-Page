'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const shouldSkipSplash = () => {
  try {
    const stored = window.localStorage.getItem('splash-ts');
    return !!stored && Date.now() - Number(stored) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const subscribeSkip = () => () => {};
const getSkipSnapshot = () => shouldSkipSplash();
const getSkipServerSnapshot = () => false;

const DURATION_MS = 5000;
const SLIDE_GAP_MS = 300;
const SLIDE_MS = 750;
const SAFETY_MS = 8000;

export default function Splash() {
  const skip = useSyncExternalStore(
    subscribeSkip,
    getSkipSnapshot,
    getSkipServerSnapshot,
  );
  const [visible, setVisible] = useState(true);
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    if (skip) return;

    document.body.style.overflow = 'hidden';

    let mainTimer = 0;
    let slideTimer = 0;
    let unmountTimer = 0;
    let safetyTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      slideTimer = window.setTimeout(() => {
        setSlideUp(true);
        unmountTimer = window.setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = '';
          try {
            localStorage.setItem('splash-ts', String(Date.now()));
          } catch {
            // 무시
          }
        }, SLIDE_MS);
      }, SLIDE_GAP_MS);
    };

    // performance.now() = navigation 이후 경과 ms.
    // hydration 늦으면 elapsed가 이미 DURATION 넘어 즉시 finish.
    const elapsed = performance.now();
    const remaining = Math.max(0, DURATION_MS - elapsed);
    mainTimer = window.setTimeout(finish, remaining);

    // safety net: 어떤 이유로 stuck 돼도 8초 후 강제 해제
    safetyTimer = window.setTimeout(finish, SAFETY_MS);

    return () => {
      window.clearTimeout(mainTimer);
      window.clearTimeout(slideTimer);
      window.clearTimeout(unmountTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [skip]);

  if (skip || !visible) return null;

  return (
    <>
      <style>{`
        @property --splash-num {
          syntax: '<integer>';
          initial-value: 0;
          inherits: false;
        }
        @keyframes splash-count {
          from { --splash-num: 0; }
          to   { --splash-num: 100; }
        }
        @keyframes splash-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .splash-percent {
          --splash-num: 0;
          animation: splash-count 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          counter-reset: splash-n var(--splash-num);
        }
        .splash-percent::after {
          content: counter(splash-n) '%';
        }
        .splash-bar {
          width: 0%;
          animation: splash-fill 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
      <div
        className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-5"
        style={{
          background: '#FFFFFF',
          transform: slideUp ? 'translateY(-100%)' : 'translateY(0)',
          transition: slideUp
            ? 'transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)'
            : 'none',
        }}
      >
        <p
          className="text-sm font-medium tracking-tight"
          style={{ color: '#9CA3AF' }}
        >
          Getting ready &apos;welldone&apos;...
        </p>

        <div
          className="rounded-full overflow-hidden"
          style={{ width: 200, height: 6, background: '#F3F4F6' }}
        >
          <div
            className="splash-bar h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #0048FF, #3B82F6)',
            }}
          />
        </div>

        <p
          className="splash-percent text-xs tabular-nums"
          style={{ color: '#D1D5DB' }}
        />
      </div>
    </>
  );
}
