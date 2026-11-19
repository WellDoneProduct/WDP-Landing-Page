import { writeLeadData } from '@/lib/lead-store';

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return Response.json({ ok: false }, { status: 415 });
  }

  const data = await request.json().catch(() => null);
  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false }, { status: 422 });
  }

  const ok = await writeLeadData({ email });
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
