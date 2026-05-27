'use client';

import dynamic from 'next/dynamic';
import { useModal } from './ModalContext';

const SplineScene = dynamic(() => import('./SplineScene'), { ssr: false });

export default function Hero() {
  const { openModal } = useModal();
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #CDD5DF 0%, #E2E7EF 50%, #FFFFFF 100%)',
        willChange: 'transform',
        contain: 'layout',
      }}
    >
      {/* ── BACKGROUND: Spline 3D (absolute cover, multiply blend) ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div
          style={{
            position: 'absolute',
            width: 'max(100%, calc(100vh * 16 / 9))',
            height: 'max(100%, calc(100vw * 9 / 16))',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SplineScene />
        </div>
      </div>

      {/* ── MOBILE OVERLAY: blur 제거 → GPU 재렌더 방지 ── */}
      <div
        className="absolute inset-0 z-10 lg:hidden"
        style={{ background: 'rgba(255, 255, 255, 0.38)' }}
      />

      {/* ── FOREGROUND: Text & Buttons ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-xl">

          {/* Main Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 animate-fade-in text-center sm:text-left"
            style={{ color: '#111827' }}
          >
            매일 반복되는 수기 업무,<br />
            <span style={{ color: '#0048FF' }}>시스템으로 대체해 보세요</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base leading-relaxed mb-8 animate-fade-in text-center sm:text-left"
            style={{ color: '#374151', animationDelay: '0.1s' }}
          >
            엑셀 취합, 수기 입력, 카톡 결재 등 소모적인 업무를 자동화하면 하루에 최소 2-3시간을 절약할 수 있어요.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0048FF, #3B82F6)' }}
            >
              업무 자동화 상담받기 →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
