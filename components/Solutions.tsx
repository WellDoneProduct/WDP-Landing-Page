import FadeIn from './FadeIn';

function ERPVisual() {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
      {/* Top bar */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#FAFAFA" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "#0048FF" }}>E</div>
          <span className="text-sm font-semibold" style={{ color: "#111827" }}>ERP Dashboard</span>
        </div>
        <div className="flex gap-2">
          {['재고', '발주', '회계', '인사'].map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: "rgba(0,72,255,0.08)", color: "#0048FF" }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-0 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        {[
          { label: '총 재고', value: '2,847', unit: '개', color: '#0048FF' },
          { label: '발주 필요', value: '12', unit: '건', color: '#EF4444' },
          { label: '이번달 매출', value: '₩45M', unit: '', color: '#22c55e' },
        ].map((s) => (
          <div key={s.label} className="px-4 py-4 text-center border-r last:border-r-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="text-lg font-bold mb-0.5" style={{ color: s.color }}>{s.value}<span className="text-xs ml-0.5">{s.unit}</span></div>
            <div className="text-xs" style={{ color: "#9CA3AF" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 py-2 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          {['품목', '재고', '발주량', '상태'].map((h) => (
            <div key={h} className="text-xs font-semibold px-1" style={{ color: "#9CA3AF" }}>{h}</div>
          ))}
        </div>
        {[
          ['A4 용지', '320', '-', '정상', '#22c55e'],
          ['프린터 토너', '8', '50', '발주중', '#F97316'],
          ['사무용 의자', '45', '-', '정상', '#22c55e'],
          ['노트북', '12', '5', '검토중', '#0048FF'],
        ].map(([item, stock, order, status, color], i) => (
          <div key={i} className={`grid grid-cols-4 py-2.5 border-b last:border-b-0 row-highlight-${i + 1}`} style={{ borderColor: "rgba(0,0,0,0.04)" }}>
            <div className="text-xs px-1 font-medium" style={{ color: "#111827" }}>{item}</div>
            <div className="text-xs px-1" style={{ color: "#6B7280" }}>{stock}</div>
            <div className="text-xs px-1" style={{ color: "#6B7280" }}>{order}</div>
            <div className="text-xs px-1 font-semibold" style={{ color: color as string }}>{status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CRMVisual() {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-14 border-r flex flex-col items-center py-4 gap-3" style={{ background: "#FAFAFA", borderColor: "rgba(0,0,0,0.06)" }}>
          {['😊', '💼', '📊', '✉️'].map((icon, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base animate-avatar-pulse`}
              style={{
                background: i === 0 ? "rgba(0,72,255,0.1)" : "transparent",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-4">
          {/* Customer profile */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl" style={{ background: "rgba(0,72,255,0.05)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #0048FF, #3B82F6)" }}>
              김
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#111827" }}>김영업</div>
              <div className="text-xs" style={{ color: "#6B7280" }}>ABC Trading</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold" style={{ color: "#22c55e" }}>89%</div>
              <div className="text-xs" style={{ color: "#9CA3AF" }}>성사율</div>
            </div>
          </div>
          {/* Timeline */}
          <div className="flex flex-col gap-2 mb-4">
            {[
              { time: '2일 전', text: '견적서 발송 완료', icon: '📄', color: '#0048FF' },
              { time: '1주 전', text: '미팅 진행 · 요구사항 확인', icon: '🤝', color: '#22c55e' },
              { time: '2주 전', text: '첫 통화 · 관심 표명', icon: '📞', color: '#F97316' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="text-sm">{item.icon}</div>
                <div className="flex-1">
                  <span style={{ color: "#111827", fontWeight: 500 }}>{item.text}</span>
                </div>
                <div style={{ color: "#9CA3AF" }}>{item.time}</div>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(34,197,94,0.08)" }}>
              <div className="text-sm font-bold" style={{ color: "#22c55e" }}>89%</div>
              <div className="text-xs" style={{ color: "#9CA3AF" }}>성사율</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(0,72,255,0.08)" }}>
              <div className="text-sm font-bold" style={{ color: "#0048FF" }}>₩1.2B</div>
              <div className="text-xs" style={{ color: "#9CA3AF" }}>누적매출</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupwareVisual() {
  const messages = [
    { sender: '이팀장', msg: '마케팅 예산 집행 건 결재 요청드립니다', type: 'request', time: '10:23' },
    { sender: '박부장', msg: '내용 확인했습니다. 승인하겠습니다 ✓', type: 'approved', time: '10:31' },
    { sender: '시스템', msg: '✅ 전자결재 승인 완료 · 자동 기록됨', type: 'system', time: '10:31' },
    { sender: '이팀장', msg: '감사합니다! 바로 진행하겠습니다', type: 'reply', time: '10:33' },
  ];
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#FAFAFA" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "#0048FF" }}>G</div>
        <span className="text-sm font-semibold" style={{ color: "#111827" }}>전자결재 · 그룹웨어</span>
        <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>● 온라인</span>
      </div>
      {/* Messages */}
      <div className="p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.type === 'request' || m.type === 'reply' ? 'justify-start' : m.type === 'approved' ? 'justify-end' : 'justify-center'}`}
          >
            {m.type === 'system' ? (
              <div className="text-xs px-3 py-2 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                {m.msg}
              </div>
            ) : (
              <div className={`max-w-[75%] ${m.type === 'approved' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className="text-xs" style={{ color: "#9CA3AF" }}>{m.sender}</div>
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm"
                  style={{
                    background: m.type === 'approved' ? 'rgba(0,72,255,0.08)' : m.type === 'request' ? '#F3F4F6' : '#F9FAFB',
                    color: m.type === 'approved' ? '#0048FF' : '#111827',
                    borderRadius: m.type === 'request' ? '4px 18px 18px 18px' : m.type === 'approved' ? '18px 4px 18px 18px' : '18px',
                  }}
                >
                  {m.msg}
                </div>
                <div className="text-xs" style={{ color: "#D1D5DB" }}>{m.time}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppVisual() {
  return (
    <div className="flex items-center justify-center">
      {/* Web preview */}
      <div className="w-full rounded-2xl overflow-hidden shadow-xl border" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: "#FAFAFA", borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3 rounded-lg px-3 py-1 text-xs" style={{ background: "rgba(0,0,0,0.06)", color: "#9CA3AF" }}>
            app.systemic.kr/admin
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm font-bold mb-3" style={{ color: "#111827" }}>예약 관리 대시보드</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: '오늘 예약', value: '24건', color: '#0048FF' },
              { label: '신규 고객', value: '8명', color: '#22c55e' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-2.5" style={{ background: `rgba(${s.color === '#0048FF' ? '0,72,255' : '34,197,94'},0.07)` }}>
                <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#9CA3AF" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>오늘 예약 현황</div>
          {[
            ['14:00', '홍길동', '1인 테이블', '확정'],
            ['15:30', '이영희', '4인 룸', '확정'],
            ['17:00', '박철수', '2인 테이블', '대기'],
          ].map(([time, name, table, status], i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-xs border-b last:border-b-0" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
              <span className="font-mono w-10" style={{ color: "#0048FF" }}>{time}</span>
              <span className="flex-1 font-medium" style={{ color: "#111827" }}>{name}</span>
              <span style={{ color: "#9CA3AF" }}>{table}</span>
              <span
                className="px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  background: status === '확정' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                  color: status === '확정' ? '#22c55e' : '#F97316',
                }}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const solutions = [
  {
    side: 'left',
    badgeText: 'ERP / 업무 시스템',
    badgeColor: '#0048FF',
    badgeBg: 'rgba(0,72,255,0.1)',
    headline: '수작업으로 4시간 걸리던 마감,\n클릭 한 번으로 해결하세요',
    desc: '재고·발주·회계·인사를 하나의 화면에서 처리합니다. 부서마다 따로 관리하던 엑셀을 없애고, 데이터가 자동으로 연결됩니다.',
    list: ['기존 엑셀 데이터 그대로 이관', '수기 입력 → 자동 집계로 전환', '담당자 없이도 돌아가는 결재·승인 라인 구축'],
    visual: <ERPVisual />,
  },
  {
    side: 'right',
    badgeText: 'CRM / 영업 관리',
    badgeColor: '#FF7A00',
    badgeBg: 'rgba(255,122,0,0.1)',
    headline: '영업 담당자가 바뀌어도\n고객 히스토리는 사라지지 않아요',
    desc: '통화 내용, 견적 이력, 다음 액션까지 시스템이 기록합니다. 보고서 작성에 쓰던 시간을 영업 활동으로 돌릴 수 있습니다.',
    list: ['수기 보고서 작성 → 자동 파이프라인 집계', '견적·계약서 자동 생성으로 행정 시간 단축', '메일·카카오·문자 발송 자동화'],
    visual: <CRMVisual />,
  },
  {
    side: 'left',
    badgeText: '그룹웨어 / 사내 포털',
    badgeColor: '#0048FF',
    badgeBg: 'rgba(0,72,255,0.1)',
    headline: '카톡 결재, 전화 확인, 구두 지시.\n이제 기록으로 관리하세요',
    desc: '전자결재, 일정, 공지, 자료 공유가 하나로 연결됩니다. 누가 무엇을 언제 승인했는지, 검색 한 번으로 찾을 수 있습니다.',
    list: ['구두·카톡 결재 → 전자결재로 전환', '반복 공지·알림 자동 발송', '모바일 앱 + 웹 동시 지원'],
    visual: <GroupwareVisual />,
  },
  {
    side: 'right',
    badgeText: '앱 / 웹 서비스',
    badgeColor: '#FF7A00',
    badgeBg: 'rgba(255,122,0,0.1)',
    headline: '고객 응대, 예약, 주문 등\n플랫폼화하고 간편하게 처리해 보세요',
    desc: '전화로 받던 주문, 수기로 쓰던 예약, 엑셀로 관리하던 고객 목록. 앱 하나로 자동화하면 야간·주말에도 접수가 끊기지 않습니다.',
    list: ['주문·예약·접수 자동화', 'iOS · 안드로이드 동시 출시', 'MVP 기준 평균 8~12주 내 출시'],
    visual: <AppVisual />,
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ background: "rgba(0,72,255,0.08)", color: "#0048FF" }}
            >
              자동화 사례
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "#111827" }}>
              반복되는 업무를 시스템으로 바꾸면 직원들은 진짜 일에 집중할 수 있습니다
            </h2>
          </div>
        </FadeIn>

        {/* Solution rows */}
        <div className="flex flex-col gap-8">
          {solutions.map((sol, i) => {
            const isRight = sol.side === 'right';
            return (
              <FadeIn key={i} delay={i * 100}>
              <div
                className="rounded-3xl border p-8 md:p-10"
                style={{ background: "#F9FAFB", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
                  {/* Text side */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-flex text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
                      style={{ background: sol.badgeBg, color: sol.badgeColor }}
                    >
                      {sol.badgeText}
                    </span>
                    <h3
                      className="text-2xl md:text-3xl font-bold leading-snug mb-5 whitespace-pre-line"
                      style={{ color: "#111827" }}
                    >
                      {sol.headline}
                    </h3>
                    <p className="text-base leading-relaxed mb-7" style={{ color: "#6B7280" }}>
                      {sol.desc}
                    </p>
                    <ul className="flex flex-col gap-3">
                      {sol.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#374151" }}>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: sol.badgeBg }}
                          >
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke={sol.badgeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Visual side */}
                  <div className="flex-1 w-full min-w-0">
                    {sol.visual}
                  </div>
                </div>
              </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
