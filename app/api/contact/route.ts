import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

/* ── 서버사이드 입력 검증 ─────────────────────────────────────────── */
function validate(data: Record<string, unknown>): string | null {
  const { name, phone, email, position, description } = data;
  if (!name || typeof name !== 'string' || !/^[가-힣\s]{1,20}$/.test(String(name).trim()))
    return '이름 형식이 올바르지 않습니다.';
  if (!position || typeof position !== 'string' || String(position).trim().length < 1)
    return '직함을 입력해 주세요.';
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()))
    return '이메일 형식이 올바르지 않습니다.';
  if (!phone || typeof phone !== 'string' || !/^[\d\-]{7,15}$/.test(String(phone).trim()))
    return '연락처 형식이 올바르지 않습니다.';
  // 프로젝트 설명은 선택 항목 — 입력된 경우에만 최소 길이 검증
  if (typeof description === 'string' && description.trim().length > 0 && description.trim().length < 5)
    return '프로젝트 설명을 조금 더 자세히 입력해 주세요.';
  return null;
}

/* ── Rate limit (메모리 기반, 서버리스 재시작 시 초기화) ────────── */
const ipHits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;          // 5회
const WINDOW_MS = 60_000; // 1분

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= LIMIT) return true;
  entry.count++;
  return false;
}

/* ── POST handler ────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* Rate limit */
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: '잠시 후 다시 시도해 주세요.' },
      { status: 429 }
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  /* 서버사이드 검증 */
  const validationError = validate(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const { name, phone, email, position, company, description, duration, budget, marketing } = data;
  const payload = JSON.stringify({
    name, phone, email, position, company, description, duration, budget, marketing,
  });

  try {
    /* 1. Google Sheets */
    let url = APPS_SCRIPT_URL;
    for (let i = 0; i < 5; i++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        redirect: 'manual',
      });
      const location = res.headers.get('location');
      if (
        (res.status === 301 || res.status === 302 ||
         res.status === 307 || res.status === 308) &&
        location
      ) {
        url = location;
        continue;
      }
      console.log('[contact] Sheets status:', res.status);
      break;
    }

    /* 2. Slack 알림 */
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        icon_emoji: ':money_with_wings:',
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '📋 새 상담 신청이 들어왔어요!', emoji: true },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*회사명*\n${company || '-'}` },
              { type: 'mrkdwn', text: `*이름*\n${name}` },
              { type: 'mrkdwn', text: `*직함*\n${position || '-'}` },
              { type: 'mrkdwn', text: `*이메일*\n${email || '-'}` },
              { type: 'mrkdwn', text: `*연락처*\n${phone}` },
              { type: 'mrkdwn', text: `*뉴스레터 수신*\n${marketing ? '✅ 동의' : '미동의'}` },
              { type: 'mrkdwn', text: `*희망 기간*\n${duration || '-'}` },
              { type: 'mrkdwn', text: `*희망 견적*\n${budget || '-'}` },
            ],
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `*프로젝트 설명*\n${description || '-'}` },
          },
          { type: 'divider' },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `신청 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
              },
            ],
          },
        ],
      }),
    });

    return NextResponse.json({ result: 'success' });
  } catch (err) {
    console.error('[contact] failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
