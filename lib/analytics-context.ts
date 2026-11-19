// Only the package's attribution fields may be stored with the consultation.
const campaignFields = ['source', 'medium', 'campaign', 'content', 'landing_path', 'referrer_host'] as const;
const originFields = ['origin_content_id', 'origin_cta_location', 'origin_service_type', 'origin_plan_tier'] as const;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function pick(value: unknown, fields: readonly string[]) {
  const source = record(value);
  return Object.fromEntries(fields.flatMap(key => {
    const entry = source[key];
    return typeof entry === 'string' && /^[a-zA-Z0-9_:./() -]{1,200}$/.test(entry) ? [[key, entry]] : [];
  }));
}

export function analyticsContext(attribution: unknown, origin: unknown) {
  const context = record(attribution);
  return {
    attribution: attribution ? Object.fromEntries(['first_touch', 'session_touch', 'last_non_direct_touch']
      .filter(key => context[key]).map(key => [key, pick(context[key], campaignFields)])) : null,
    origin: origin ? pick(origin, originFields) : null,
  };
}
