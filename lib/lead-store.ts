export async function callSheetsWriter(payload: object) {
  const url = process.env.NEWSLETTER_WEBHOOK_URL;
  const token = process.env.NEWSLETTER_WEBHOOK_TOKEN;
  if (!url || !token) throw new Error('Sheets writer unavailable');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, token }),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Sheets writer unavailable');
  return response.json();
}

// The newsletter and contact forms share one authenticated Sheets writer and lock.
export async function writeLeadData(payload: object, inquiryId?: string): Promise<{ created?: boolean; analytics_event_id?: string } | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const saved = await callSheetsWriter(payload);
      if (saved?.ok === true && (!inquiryId || saved.inquiryId === inquiryId)) {
        return {
          created: typeof saved.created === 'boolean' ? saved.created : undefined,
          analytics_event_id: typeof saved.analytics_event_id === 'string' && /^[a-f0-9-]{36}$/i.test(saved.analytics_event_id)
            ? saved.analytics_event_id : undefined,
        };
      }
    } catch {
      // The same inquiry ID or newsletter address can be retried after a timeout.
    }
  }
  return null;
}
