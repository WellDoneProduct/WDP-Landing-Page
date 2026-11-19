// The newsletter and contact forms share one authenticated Sheets writer and lock.
export async function writeLeadData(payload: object, inquiryId?: string): Promise<boolean> {
  const url = process.env.NEWSLETTER_WEBHOOK_URL;
  const token = process.env.NEWSLETTER_WEBHOOK_TOKEN;
  if (!url || !token) return false;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, token }),
        cache: 'no-store',
        signal: AbortSignal.timeout(20000),
      });
      if (response.ok) {
        const saved = await response.json();
        if (saved?.ok === true && (!inquiryId || saved.inquiryId === inquiryId)) return true;
      }
    } catch {
      // The same inquiry ID or newsletter address can be retried after a timeout.
    }
  }
  return false;
}
