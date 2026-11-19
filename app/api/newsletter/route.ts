export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return Response.json({ ok: false }, { status: 415 });
  }

  const data = await request.json().catch(() => null);
  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false }, { status: 422 });
  }

  const url = process.env.NEWSLETTER_WEBHOOK_URL;
  const token = process.env.NEWSLETTER_WEBHOOK_TOKEN;
  if (!url || !token) return Response.json({ ok: false }, { status: 503 });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok && (await response.json())?.ok === true) {
      return Response.json({ ok: true });
    }
  } catch {
    // Apps Script returns HTML for some deployment and permission errors.
  }
  return Response.json({ ok: false }, { status: 503 });
}
