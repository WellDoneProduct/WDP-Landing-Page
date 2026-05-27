import FadeIn from './FadeIn';

const problems = [
  {
    number: '01',
    icon: '⏰',
    headline: '직원 1명이\n하루 3시간을 엑셀에 씁니다',
    desc: '재고 현황 취합, 매출 집계, 발주서 작성. 10명이 하루 1시간씩만 반복 입력을 줄여도, 한 달에 200시간이 생깁니다.',
    tag: '반복 수작업',
    tagColor: '#EF4444',
    tagBg: 'rgba(239,68,68,0.1)',
  },
  {
    number: '02',
    icon: '🔗',
    headline: '팀장이 바뀌면\n업무 인수인계가 2주씩 걸립니다',
    desc: '담당자 PC 안에 있는 파일, 카톡으로 공유된 결재, 기억 속에만 있는 프로세스. 시스템이 아닌 사람에게 의존하면, 그 사람이 빠지는 순간 업무가 멈춥니다.',
    tag: '단절된 시스템',
    tagColor: '#F97316',
    tagBg: 'rgba(249,115,22,0.1)',
  },
  {
    number: '03',
    icon: '💸',
    headline: '이전 개발에 많은 시간과 돈을 썼지만, 지금도 엑셀을 씁니다',
    desc: '납기는 밀리고, 원하는 기능은 빠졌고, 유지보수 연락은 끊겼습니다. 중소기업 외주 개발 실패율은 60%가 넘습니다.',
    tag: '외주 실패 경험',
    tagColor: '#8B5CF6',
    tagBg: 'rgba(139,92,246,0.1)',
  },
];

export default function Problems() {
  return (
    <section id="problems" className="py-24 px-6 overflow-hidden" style={{ background: "#141414" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}
            >
              문제점
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "#F9FAFB" }}
            >
              지금 이 비용, 전부 사람이 감당하고 있습니다
            </h2>
          </div>
        </FadeIn>

        {/* Problem Cards */}
        <FadeIn delay={150}>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.number}
              className="rounded-3xl p-8 hover:shadow-lg transition-shadow border"
              style={{ background: "#1F1F1F", borderColor: "rgba(255,255,255,0.06)" }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: p.tagBg, color: p.tagColor }}
                >
                  {p.tag}
                </span>
                <span className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.07)" }}>
                  {p.number}
                </span>
              </div>

              {/* Icon */}
              <div className="text-4xl mb-5">{p.icon}</div>

              {/* Headline */}
              <h3
                className="text-xl font-bold leading-snug mb-4 whitespace-pre-line"
                style={{ color: "#F9FAFB" }}
              >
                {p.headline}
              </h3>

              {/* Desc */}
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                {p.desc}
              </p>

              {/* Bottom accent */}
              <div
                className="mt-6 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${p.tagColor}, transparent)` }}
              />
            </div>
          ))}
        </div>
        </FadeIn>

      </div>

    </section>
  );
}
