'use client';

import { useState } from 'react';
import FadeIn from './FadeIn';

function CheckItem({ label, desc }: { label: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-start gap-3 py-3 cursor-default transition-all duration-200 justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
        style={{
          background: hovered ? '#0048FF' : 'rgba(0,72,255,0.10)',
          boxShadow: hovered ? '0 0 10px rgba(0,72,255,0.4)' : 'none',
        }}
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={hovered ? 'white' : '#0048FF'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div
          className="font-semibold text-sm transition-colors duration-200"
          style={{ color: hovered ? '#0048FF' : '#111827' }}
        >
          {label}
        </div>
        <div className="text-sm mt-0.5 leading-relaxed" style={{ color: '#6B7280' }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: 'excel', label: '엑셀 업무 자동화' },
  { id: 'workflow', label: '워크플로우 결재' },
  { id: 'sync', label: '실시간 데이터 동기화' },
];

function ExcelVisual() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl h-full" style={{ background: "#1e293b" }}>
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-white/40 font-mono">재고_현황_2026Q1.xlsx</span>
      </div>
      {/* Column headers */}
      <div className="grid grid-cols-4 gap-0 px-4 py-2 border-b border-white/10">
        {['품목명', '수량', '단가', '합계'].map((h) => (
          <div key={h} className="text-xs font-semibold text-white/50 px-2">{h}</div>
        ))}
      </div>
      {/* Rows */}
      {[
        ['모니터 24"', '15', '₩320,000', '₩4,800,000'],
        ['키보드', '42', '₩85,000', '₩3,570,000'],
        ['마우스', '38', '₩45,000', '₩1,710,000'],
        ['헤드셋', '20', '₩120,000', '₩2,400,000'],
        ['웹캠', '8', '₩95,000', '₩760,000'],
      ].map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-4 gap-0 px-4 py-2.5 border-b border-white/5 row-highlight-${i + 1}`}
        >
          {row.map((cell, j) => (
            <div key={j} className={`text-xs px-2 ${j === 3 ? 'text-green-400 font-semibold' : 'text-white/70'}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
      {/* Progress bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">취합 중...</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #0048FF, #3B82F6)",
                animation: "grow-line 3s ease-in-out infinite",
                width: "75%",
              }}
            />
          </div>
          <span className="text-xs text-primary font-semibold">75%</span>
        </div>
      </div>
    </div>
  );
}

function WorkflowVisual() {
  return (
    <div className="rounded-2xl p-6 shadow-xl h-full flex flex-col justify-center" style={{ background: "#1e293b" }}>
      <div className="flex flex-col gap-3">
        {[
          { label: '1차 승인', name: '이팀장', role: '마케팅팀장', status: 'done', color: '#22c55e' },
          { label: '2차 승인', name: '박부장', role: '영업본부장', status: 'active', color: '#0048FF' },
          { label: '최종 결재', name: '최대표', role: '대표이사', status: 'pending', color: '#6B7280' },
        ].map((node, i) => (
          <div key={i} className="flex items-center gap-4">
            {/* Connector */}
            <div className="flex flex-col items-center" style={{ width: 40 }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${node.status === 'active' ? 'animate-timeline-glow' : ''}`}
                style={{ background: node.color }}
              >
                {node.status === 'done' ? '✓' : node.status === 'active' ? '●' : i + 1}
              </div>
              {i < 3 && (
                <div
                  className="w-0.5 h-5 mt-1"
                  style={{
                    background: i < 2 ? '#22c55e' : 'rgba(255,255,255,0.15)',
                  }}
                />
              )}
            </div>
            {/* Card */}
            <div
              className="flex-1 rounded-xl p-3 border"
              style={{
                background: node.status === 'active' ? 'rgba(0,72,255,0.12)' : 'rgba(255,255,255,0.05)',
                borderColor: node.status === 'active' ? 'rgba(0,72,255,0.4)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-white/40 mb-0.5">{node.label}</div>
                  <div className="text-sm font-semibold text-white">{node.name}</div>
                  <div className="text-xs text-white/50">{node.role}</div>
                </div>
                <div
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    background: node.status === 'done' ? 'rgba(34,197,94,0.15)' : node.status === 'active' ? 'rgba(0,72,255,0.2)' : 'rgba(107,114,128,0.2)',
                    color: node.status === 'done' ? '#22c55e' : node.status === 'active' ? '#60a5fa' : '#9CA3AF',
                  }}
                >
                  {node.status === 'done' ? '승인완료' : node.status === 'active' ? '검토중' : '대기'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SyncVisual() {
  const icons = ['☁️', '📊', '🔗', '📱', '🖥️', '📋'];
  return (
    <div className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center h-full" style={{ background: "#1e293b", minHeight: 280 }}>
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
          style={{ borderColor: "rgba(0,72,255,0.3)" }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full border-2 border-dashed animate-rotate"
          style={{
            inset: 24,
            borderColor: "rgba(255,122,0,0.3)",
            animationDirection: "reverse",
            animationDuration: "6s",
          }}
        />
        {/* Center icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 shadow-lg animate-pulse-dot"
          style={{ background: "linear-gradient(135deg, #0048FF, #3B82F6)" }}
        >
          🔄
        </div>
        {/* Orbit icons */}
        {icons.map((icon, i) => {
          const angle = (i / icons.length) * 2 * Math.PI;
          const r = 85;
          const x = 100 + r * Math.cos(angle) - 16;
          const y = 100 + r * Math.sin(angle) - 16;
          return (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center text-sm shadow"
              style={{
                left: x,
                top: y,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>
      <p className="text-white/50 text-sm mt-4 text-center">실시간 양방향 동기화</p>
    </div>
  );
}

const tabContent = {
  excel: {
    title: '더 이상 엑셀과\n싸우지 마세요',
    benefits: [
      { icon: '♾️', label: '무제한 데이터 취합', desc: '수백 개 파일도 클릭 한 번에' },
      { icon: '0️⃣', label: '휴먼 에러 제로', desc: '수동 입력으로 인한 실수 완전 제거' },
      { icon: '📊', label: '대시보드 시각화', desc: '실시간 차트와 KPI 자동 업데이트' },
    ],
    visual: <ExcelVisual />,
  },
  workflow: {
    title: '복잡한 결재선,\n한 줄로 줄이세요',
    benefits: [
      { icon: '💬', label: '메신저 기반 승인', desc: '카카오·슬랙에서 바로 결재' },
      { icon: '⚙️', label: '커스텀 워크플로우', desc: '우리 회사 결재 구조 그대로 설정' },
    ],
    visual: <WorkflowVisual />,
  },
  sync: {
    title: '어디서든 최신\n데이터를 유지하세요',
    benefits: [
      { icon: '☁️', label: '클라우드 통합 관리', desc: '구글, 네이버, AWS 등 연동' },
      { icon: '🔒', label: '강력한 보안 암호화', desc: 'AES-256 암호화 기본 적용' },
    ],
    visual: <SyncVisual />,
  },
};

export default function Features() {
  const [activeTab, setActiveTab] = useState<'excel' | 'workflow' | 'sync'>('excel');
  const content = tabContent[activeTab];

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ background: "rgba(0,72,255,0.08)", color: "#0048FF" }}
            >
              업무 자동화 개발사
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "#111827" }}>
              이런 업무들을 자동화 할 수 있어요
            </h2>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={150}>
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-1.5 rounded-2xl" style={{ background: "#F3F4F6" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'excel' | 'workflow' | 'sync')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#0048FF' : '#6B7280',
                  boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        </FadeIn>

        {/* Content */}
        <FadeIn delay={250}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="animate-fade-in flex flex-col items-center justify-center text-center">
            <h3
              className="text-3xl md:text-4xl font-bold mb-8 leading-tight whitespace-pre-line"
              style={{ color: "#111827" }}
            >
              {content.title}
            </h3>
            <div className="flex flex-col items-start w-fit text-left">
              {content.benefits.map((b) => (
                <CheckItem key={b.label} label={b.label} desc={b.desc} />
              ))}
            </div>

            {/* Visual: 모바일에서만 표시 */}
            <div className="md:hidden mt-8 w-full">
              {content.visual}
            </div>
          </div>

          {/* Right: Visual (데스크톱에서만 표시) */}
          <div className="hidden md:block animate-fade-in h-[360px]">
            <div className="w-full h-full [&>*]:h-full">
              {content.visual}
            </div>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
