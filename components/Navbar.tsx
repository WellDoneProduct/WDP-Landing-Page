'use client';
import { useModal } from './ModalContext';

export default function Navbar() {
  const { openModal } = useModal();
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img src="/Logo-primary.svg" alt="Systemic" className="h-8 w-auto" />
        </a>

        {/* Nav Links */}
        {/* <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-text-sub hover:text-text-main transition-colors text-sm font-medium">
            회사 소개
          </a>
          <a href="#portfolio" className="text-text-sub hover:text-text-main transition-colors text-sm font-medium">
            포트폴리오
          </a>
        </div> */}

        {/* CTA Button */}
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg cursor-pointer"
          style={{ background: "linear-gradient(135deg, #0048FF, #3B82F6)" }}
        >
          업무 자동화 상담받기
        </button>
      </div>
    </nav>
  );
}
