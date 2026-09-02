'use client';

import FadeIn from './FadeIn';

const qualityBadges = [
  {
    title: '사내 검수 체크리스트',
    desc: 'AI 산출물은 모든 단계에서 사내 표준 체크리스트로 점검합니다.',
  },
  {
    title: '전문가의 최종 검수',
    desc: '결과물의 모든 라인은 전문가가 확인하고 책임집니다.',
  },
  {
    title: '변경 이력 자동 정리',
    desc: '산출물·변경 이력을 정리해 인수인계까지 그대로 전달합니다.',
  },
];

const processCards = [
  {
    title: '기획',
    tasks: ['요구사항 정의', '기능명세서 작성', '회의록 정리'],
    role: '담당 PM',
    img: '/process-icons/planning.png',
    imgLeft: '2.8%',
    imgTop: '12.6%',
    imgSize: '151%',
    imgTransform: 'scaleY(-1) rotate(164.98deg)',
  },
  {
    title: '디자인',
    tasks: ['요구사항 기반 UX/UI 디자인 초안 작성', '디자인 시스템 컴포넌트 적용'],
    role: '담당 디자이너',
    img: '/process-icons/design.png',
    imgLeft: '-5%',
    imgTop: '15%',
    imgSize: '127%',
    imgTransform: 'none',
  },
  {
    title: '개발',
    tasks: ['명세 기반 코드 작성', '리팩토링 및 코드 리뷰 보조'],
    role: '담당 개발자',
    img: '/process-icons/dev.png',
    imgLeft: '-7.9%',
    imgTop: '8.2%',
    imgSize: '149%',
    imgTransform: 'rotate(-7.86deg)',
  },
  {
    title: '테스트',
    tasks: ['요구사항 기반 테스트 시나리오 작성', '자동화 테스트 진행 작성'],
    role: '담당 QA',
    img: '/process-icons/test.png',
    imgLeft: '5.8%',
    imgTop: '26.2%',
    imgSize: '136%',
    imgTransform: 'rotate(5.9deg)',
  },
  {
    title: '유지보수 · 인수인계',
    tasks: ['기획 · 디자인 · 코드 등 인수인계 자료 자동 정리', '변경 이력·유지보수 가이드 작성'],
    role: '담당 PM',
    img: '/process-icons/maintenance.png',
    imgLeft: '5.8%',
    imgTop: '-16.5%',
    imgSize: '173%',
    imgTransform: 'rotate(-1.76deg)',
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="py-20 md:py-24 px-6 relative overflow-hidden bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight mb-4"
              style={{ color: '#111827', letterSpacing: '-1px' }}
            >
              <span style={{ color: '#0048ff' }}>처음부터 끝까지,</span>
              <br />
              AI와 전문가가 함께합니다
            </h2>
            <p className="text-base md:text-lg" style={{ color: '#5b6478' }}>
              기획·디자인·개발·테스트까지 외주 개발의 모든 단계에서 AI를 활용해 일합니다.
            </p>
          </div>
        </FadeIn>

        {/* Quality badges */}
        <FadeIn delay={100}>
          <div
            className="rounded-2xl py-5 px-8 md:px-12 mb-7 md:mb-8"
            style={{ background: '#f9fafb' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
              {qualityBadges.map((badge, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center w-full">
                  {i > 0 && (
                    <div
                      className="hidden md:block shrink-0 w-px h-12 mx-10"
                      style={{ background: '#e3e4e4' }}
                    />
                  )}
                  <div className="flex flex-col gap-2 items-center text-center flex-1">
                    <p className="font-bold text-[17px] md:text-[18px]" style={{ color: '#374151' }}>
                      {badge.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Process cards */}
        <FadeIn delay={200}>
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 md:overflow-x-visible">
            {processCards.map((card, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl shrink-0 flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(to bottom, #111827, #3d578d)',
                  height: '285px',
                  padding: '20px',
                  boxShadow: '0px 8px 20px -3px rgba(0,0,0,0.08)',
                  flex: '1 1 0',
                  minWidth: '180px',
                }}
              >
                {/* 3D icon background */}
                <img
                  alt=""
                  src={card.img}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: card.imgLeft,
                    top: card.imgTop,
                    width: card.imgSize,
                    transform: card.imgTransform,
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />

                {/* Text content */}
                <div className="relative z-10 flex flex-col gap-2">
                  <p
                    className="font-semibold leading-tight"
                    style={{ fontSize: '20px', color: 'white', letterSpacing: '-1px' }}
                  >
                    {card.title}
                  </p>
                  <div className="flex flex-col" style={{ fontSize: '10px', color: 'white', lineHeight: '1.66', letterSpacing: '-0.3px' }}>
                    {card.tasks.map((task, j) => (
                      <span key={j}>{task}</span>
                    ))}
                  </div>
                </div>

                {/* Role badge */}
                <div className="relative z-10">
                  <span
                    className="text-white font-semibold"
                    style={{
                      background: 'rgba(102,171,255,0.4)',
                      borderRadius: '999px',
                      padding: '5px 9px',
                      fontSize: '10px',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {card.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
