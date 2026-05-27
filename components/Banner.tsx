'use client';
import { useModal } from './ModalContext';

export default function Banner() {
  const { openModal } = useModal();
  return (
    <div
      className="px-6 py-7"
      style={{ background: 'linear-gradient(90deg, #0048FF 0%, #3B82F6 100%)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white/70 text-sm font-medium mb-0.5">
            하나라도 공감됐다면
          </p>
          <p className="text-white text-xl font-bold">
            지금이 바로 바꿔야 할 때입니다.
          </p>
        </div>
        <button
          onClick={openModal}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
          style={{
            background: 'white',
            color: '#0048FF',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          업무 자동화 상담받기 →
        </button>
      </div>
    </div>
  );
}
