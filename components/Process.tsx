'use client';

import { useState } from 'react';
import FadeIn from './FadeIn';

const steps = [
  {
    step: '01',
    timing: 'Day 1',
    title: '킥오프',
    desc: '어떤 업무에서 시간이 가장 많이 새는지 함께 찾습니다.',
  },
  {
    step: '02',
    timing: 'Week 1~2',
    title: '업무 분석 · 요구사항 정의',
    desc: '자동화 가능한 범위와 예상 효과를 문서로 확정합니다.',
  },
  {
    step: '03',
    timing: 'Week 2~3',
    title: '기획 · 화면 설계',
    desc: '어떤 업무 단계에서 무엇이 줄어드는지, 화면 흐름으로 시각화합니다.',
  },
  {
    step: '04',
    timing: 'Month 3',
    title: '개발',
    desc: '2주마다 실제 작동하는 화면으로 진행 상황을 직접 확인합니다.',
  },
  {
    step: '05',
    timing: 'Week 2',
    title: '내부 QA',
    desc: '핵심 기능을 먼저 완성하고, 우선순위에 따라 추가 요구사항을 반영합니다.',
  },
  {
    step: '06',
    timing: 'Week 2',
    title: '고객 QA',
    desc: '실제 업무 환경과 유사하게 세팅 후, 직접 써보며 나오는 피드백을 반영합니다.',
  },
  {
    step: '07',
    timing: 'Week 1',
    title: '통합 테스트 · 배포',
    desc: '모든 기능이 운영 환경에서 문제없이 작동하는지 최종 확인 후 배포합니다.',
    highlight: true,
  },
  {
    step: '08',
    timing: '배포 이후',
    title: '유지보수 · 파트너십',
    desc: '무상 하자보수 기간 이후에도 유지보수 계약으로 이슈 대응과 기능 개발을 이어갑니다.',
    isLast: true,
  },
];

type Step = typeof steps[0];

function StepItem({ s }: { s: Step }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex gap-6 pb-8 last:pb-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle */}
      <div
        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-200"
        style={
          s.highlight
            ? {
                background: "linear-gradient(135deg, #0048FF, #3B82F6)",
                color: "white",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                boxShadow: hovered
                  ? "0 6px 24px rgba(0,72,255,0.6)"
                  : "0 4px 16px rgba(0,72,255,0.4)",
                transform: hovered ? "scale(1.1)" : "scale(1)",
              }
            : s.isLast
            ? {
                background: hovered ? "rgba(99,130,255,0.2)" : "rgba(99,130,255,0.1)",
                color: "#93B4FF",
                border: "1.5px dashed rgba(99,130,255,0.3)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                transform: hovered ? "scale(1.1)" : "scale(1)",
              }
            : {
                background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                color: "#93B4FF",
                border: hovered ? "1.5px solid rgba(99,130,255,0.5)" : "1.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                transform: hovered ? "scale(1.1)" : "scale(1)",
              }
        }
      >
        {s.step}
      </div>

      {/* Content */}
      <div
        className="flex-1 rounded-2xl px-5 py-4 transition-all duration-200"
        style={
          s.highlight
            ? {
                background: hovered
                  ? "linear-gradient(135deg, rgba(0,72,255,0.25), rgba(59,130,246,0.18))"
                  : "linear-gradient(135deg, rgba(0,72,255,0.18), rgba(59,130,246,0.12))",
                border: `1px solid ${hovered ? "rgba(99,130,255,0.5)" : "rgba(99,130,255,0.25)"}`,
                boxShadow: hovered ? "0 4px 24px rgba(0,72,255,0.25)" : "none",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
              }
            : s.isLast
            ? {
                background: hovered ? "rgba(99,130,255,0.12)" : "rgba(99,130,255,0.06)",
                border: `1px dashed ${hovered ? "rgba(99,130,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
              }
            : {
                background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(99,130,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
              }
        }
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-sm font-bold transition-colors duration-200"
            style={{ color: hovered || s.highlight ? "#93B4FF" : "#F9FAFB" }}
          >
            {s.title}
          </span>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 transition-all duration-200"
            style={{
              background: hovered || s.highlight ? "rgba(99,130,255,0.2)" : "rgba(255,255,255,0.06)",
              color: hovered || s.highlight ? "#93B4FF" : "rgba(255,255,255,0.35)",
            }}
          >
            {s.timing}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          {s.desc}
        </p>
        {s.isLast && (
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold"
            style={{ color: "#93B4FF" }}
          >
            파트너십 문의하기 →
          </a>
        )}
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section
      id="process"
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 15% 85%, rgba(0,72,255,0.18) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 55%, rgba(99,102,241,0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 100%, rgba(0,48,180,0.2) 0%, transparent 50%),
          linear-gradient(to bottom, #05091A 0%, #070D24 60%, #08112E 100%)
        `,
      }}
    >
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(99,130,255,0.15)", color: "#93B4FF" }}
            >
              프로젝트 과정
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: "#F9FAFB" }}>
              처음 연락부터 자동화 완료까지, 이렇게 진행됩니다
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              6개월 일정 기준 · 프로젝트에 따라 상이할 수 있습니다
            </p>
          </div>
        </FadeIn>

        {/* Timeline */}
        <FadeIn delay={150}>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <div className="flex flex-col gap-0">
            {steps.map((s, i) => (
              <StepItem key={i} s={s} />
            ))}
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
