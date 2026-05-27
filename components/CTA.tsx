'use client';

import { useState } from 'react';
import FadeIn from './FadeIn';
import { useModal } from './ModalContext';

const cards = [
  {
    icon: '🙌',
    title: '규모가 작아도,\n기획이 없어도 괜찮습니다.',
    desc: '어디서부터 시작해야 할지 몰라도 괜찮아요. 현재 상황만 말씀해 주시면 저희가 정리해 드립니다.',
  },
  {
    icon: '📋',
    title: '상담 후 견적까지\n무료로 전달드립니다.',
    desc: '상담 내용을 바탕으로 자동화 범위와 예상 비용까지 무료로 제안해 드립니다.',
  },
];

function CTACard({ card }: { card: typeof cards[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-start gap-5 rounded-2xl p-6 transition-all duration-300 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(255,255,255,0.22)'
          : 'rgba(255,255,255,0.12)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: hovered
          ? '0 0 32px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300"
        style={{
          background: hovered ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.15)',
          boxShadow: hovered ? '0 0 16px rgba(255,255,255,0.2)' : 'none',
        }}
      >
        {card.icon}
      </div>
      <div>
        <div
          className="text-base font-bold whitespace-pre-line leading-snug mb-1.5 transition-all duration-300"
          style={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.95)' }}
        >
          {card.title}
        </div>
        <div
          className="text-sm leading-relaxed transition-all duration-300"
          style={{ color: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)' }}
        >
          {card.desc}
        </div>
      </div>
    </div>
  );
}

export default function CTA() {
  const { openModal } = useModal();
  return (
    <section
      id="contact"
      className="py-28 px-6"
      style={{
        background: 'linear-gradient(135deg, #0048FF 0%, #2563EB 50%, #1D4ED8 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Title + Button */}
        <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-white">
            지금 가장 비효율적인 업무를 이야기해 주세요
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            자동화 가능한 범위와 예상 효과를 상담에서 바로 알려드립니다.
          </p>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: "white",
              color: "#0048FF",
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
            }}
          >
            업무 자동화 상담 받기 →
          </button>
        </div>
        </FadeIn>

        {/* Cards */}
        <FadeIn delay={150}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <CTACard key={i} card={card} />
          ))}
        </div>
        </FadeIn>

      </div>
    </section>
  );
}
