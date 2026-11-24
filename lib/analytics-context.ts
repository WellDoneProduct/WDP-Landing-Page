// Only the package's attribution fields may be stored with the consultation.
const campaignFields = ['source', 'medium', 'campaign', 'content', 'landing_path', 'referrer_host'] as const;
const originFields = ['origin_content_id', 'origin_cta_location', 'origin_service_type', 'origin_plan_tier'] as const;
const sessionFields = ['st_source', 'st_medium', 'st_campaign', 'st_content'] as const;
const consultationFields = [...sessionFields, ...originFields] as const;
const safeContextValue = /^[a-zA-Z0-9_:./-]{1,100}$/;
const qaIdPattern = /^qa_[a-z0-9_]{8,60}$/;

type ConsultationContext = Record<(typeof consultationFields)[number], string | null> & {
  brand: 'welldoneproduct';
  form_id: 'consultation';
  is_test: boolean;
  qa_run_id: string | null;
};

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

export function consultationContext(value: unknown): ConsultationContext | null {
  const input = record(value);
  const { is_test: isTest, qa_run_id: qaRunId } = input;
  if (input.brand !== 'welldoneproduct' || input.form_id !== 'consultation' || typeof isTest !== 'boolean') return null;
  if (isTest ? typeof qaRunId !== 'string' || !qaIdPattern.test(qaRunId) : qaRunId !== null) return null;

  const fields = {} as Record<(typeof consultationFields)[number], string | null>;
  for (const key of consultationFields) {
    const field = input[key];
    if (field == null) fields[key] = null;
    else if (typeof field === 'string' && safeContextValue.test(field)) fields[key] = field;
    else return null;
  }
  return {
    brand: 'welldoneproduct', form_id: 'consultation',
    is_test: isTest, qa_run_id: typeof qaRunId === 'string' ? qaRunId : null, ...fields,
  };
}
