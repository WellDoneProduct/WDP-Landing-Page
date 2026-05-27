'use client';
import { useModal } from './ModalContext';

export default function Footer() {
  const { openModal } = useModal();
  return (
    <footer style={{ background: "#111827" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Left: Brand */}
          <div className="flex-1">
            {/* Logo */}
            <a href="#" className="flex items-center mb-4">
              <img src="/Logo-white.svg" alt="Systemic" className="h-8 w-auto" />
            </a>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "#9CA3AF" }}>
              반복되는 수기 업무를 시스템으로 자동화합니다
            </p>

            {/* CTA */}
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0048FF, #3B82F6)" }}
            >
              업무 자동화 상담받기 →
            </button>
          </div>

          {/* Right: Contact */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 text-sm">
                <span style={{ color: "#6B7280" }} className="shrink-0 w-16">대표자</span>
                <span style={{ color: "#D1D5DB" }}>이신일</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span style={{ color: "#6B7280" }} className="shrink-0 w-16">이메일</span>
                <a
                  href="mailto:garry@welldoneproduct.com"
                  className="transition-colors hover:text-white"
                  style={{ color: "#D1D5DB" }}
                >
                  garry@welldoneproduct.com
                </a>
              </div>
              <div className="flex gap-3 text-sm">
                <span style={{ color: "#6B7280" }} className="shrink-0 w-16">전화</span>
                <span style={{ color: "#D1D5DB" }}>010-9880-9254</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span style={{ color: "#6B7280" }} className="shrink-0 w-16">주소</span>
                <span style={{ color: "#D1D5DB" }}>
                  서울특별시 영등포구 선유로49길 23 7층, 708호
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Copyrightⓒ2026. All rights reserved
            </p>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Systemic by Welldone Product
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
