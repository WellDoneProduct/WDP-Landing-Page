import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./newsletter.gs', import.meta.url), 'utf8');
const salesHeaders = [
  '접수시각', '회사명', '이름', '직함', '이메일', '연락처', '유입경로', '동의',
  '마케팅 수신 동의 여부', '프로젝트 설명', '희망 기간', '희망 견적', '마케팅 수신 동의 시각',
  '문의 ID', '분석 이벤트 ID', '분석 유입', '상담 시작 콘텐츠', '기존 열', '문의 사업영역',
];
const consent = {
  brand: 'welldoneproduct', form_id: 'consultation', is_test: true, qa_run_id: 'qa_wdp_20261124',
  st_source: 'instagram', st_medium: 'paid_social', st_campaign: 'wd_traffic', st_content: 'web_app',
  origin_content_id: 'web-app', origin_cta_location: 'hero', origin_service_type: null, origin_plan_tier: null,
};

function mockSheet(headers) {
  const rows = [[...headers]];
  return {
    rows,
    getLastColumn: () => rows[0].length,
    getLastRow: () => rows.length,
    getMaxRows: () => 100,
    getMaxColumns: () => 30,
    getRange(row, col, height = 1, width = 1) {
      const values = () => Array.from({ length: height }, (_, i) =>
        Array.from({ length: width }, (_, j) => rows[row - 1 + i]?.[col - 1 + j] ?? ''));
      return {
        getValues: values, getDisplayValues: values, getDisplayValue: () => values()[0][0],
        setNumberFormat() {},
        setValues(input) {
          for (const [i, cells] of input.entries()) {
            rows[row - 1 + i] ??= [];
            for (const [j, value] of cells.entries()) rows[row - 1 + i][col - 1 + j] = value;
          }
        },
        createTextFinder(needle) {
          return {
            matchEntireCell() { return this; }, matchCase() { return this; }, useRegularExpression() { return this; },
            findNext() {
              const index = values().findIndex(([entry]) => String(entry).toLowerCase() === String(needle).toLowerCase());
              return index === -1 ? null : { getRow: () => row + index };
            },
          };
        },
      };
    },
  };
}

function setup() {
  const sales = mockSheet(salesHeaders);
  const newsletter = mockSheet(['이메일', '구독 신청 시각 (KST)']);
  let locked = false;
  const lock = {
    waitLock() { assert.equal(locked, false); locked = true; },
    hasLock() { return locked; },
    releaseLock() { locked = false; },
  };
  const api = runInNewContext(source + '\n({doPost, NEWSLETTER_SHEET, WDP_SALES_SHEET})', {
    LockService: { getScriptLock: () => lock },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => '00' }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'SHA_256' }, computeDigest: () => [0], getUuid: randomUUID, formatDate: () => '2026-11-24' },
    SpreadsheetApp: {
      openById(id) {
        assert.equal(locked, true);
        assert([api.WDP_SALES_SHEET, api.NEWSLETTER_SHEET].includes(id));
        return { getSheetById: () => id === api.WDP_SALES_SHEET ? sales : newsletter };
      },
      flush() { assert(locked); },
    },
    ContentService: { createTextOutput: text => ({ setMimeType: () => text }), MimeType: { JSON: 'JSON' } },
  });
  const request = payload => JSON.parse(api.doPost({ postData: { contents: JSON.stringify({ ...payload, token: 'x'.repeat(64) }) } }));
  const lead = { id: randomUUID(), email: 'qa@example.invalid', phone: '01000000000', name: 'QA', marketing: false, privacy: true };
  const submit = fields => request({ kind: 'wdpInquiry', inquiry: { ...lead, ...fields } });
  return { sales, newsletter, submit, request };
}

test('stores the authoritative context in the next column and returns it unchanged on retries', () => {
  const { sales, newsletter, submit } = setup();
  const first = submit({ analytics_context: { ...consent, private_field: 'omit' }, marketing: true });
  assert.equal(first.saved, true);
  assert.equal(first.created, true);
  assert.match(first.analytics_event_id, /^[a-f0-9-]{36}$/);
  assert.deepEqual(first.analytics_context, consent);
  assert.deepEqual(sales.rows[0], [...salesHeaders, '분석 컨텍스트']);
  assert.deepEqual(JSON.parse(sales.rows[1][19]), consent);
  assert.deepEqual(submit({ analytics_context: null, marketing: true }), { ...first, created: false });
  assert.equal(submit({ analytics_context: consent, marketing: false }).ok, false);
  assert.equal(sales.rows.length, 2);
  assert.equal(newsletter.rows.length, 2);
});

test('never reclassifies absent, malformed, historical or legacy receipts from a retry', () => {
  const { sales, newsletter, submit } = setup();
  const old = submit({ attribution: { session_touch: { campaign: 'original' } }, origin: { origin_cta_location: 'hero' } });
  assert.equal(old.ok, true);
  assert.equal(old.saved, undefined);
  assert.deepEqual(JSON.parse(sales.rows[1][15]), { session_touch: { campaign: 'original' } });
  assert.deepEqual(JSON.parse(sales.rows[1][16]), { origin_cta_location: 'hero' });
  const retried = submit({ analytics_context: consent });
  assert.equal(retried.analytics_event_id, old.analytics_event_id);
  assert.equal(retried.analytics_context, null);
  for (const invalid of [null, { ...consent, brand: 'ontie' }, { ...consent, qa_run_id: null }, { ...consent, st_content: 'user@example.invalid' }]) {
    const id = randomUUID();
    const saved = submit({ id, analytics_context: invalid });
    assert.equal(saved.saved, true);
    assert.equal(saved.analytics_context, null);
    assert.deepEqual(submit({ id, analytics_context: consent }), { ...saved, created: false });
  }
  const normal = { ...consent, is_test: false, qa_run_id: null };
  assert.deepEqual(submit({ id: randomUUID(), analytics_context: normal }).analytics_context, normal);
  assert.equal(newsletter.rows.length, 1);
});

test('retries a partial newsletter write without creating a second lead or re-attributing it', () => {
  const { sales, newsletter, submit, request } = setup();
  const getRange = newsletter.getRange;
  newsletter.getRange = () => { throw Error('subscriber write unavailable'); };
  assert.equal(submit({ marketing: true, analytics_context: consent }).ok, false);
  assert.equal(sales.rows.length, 2);
  newsletter.getRange = getRange;
  const repaired = submit({ marketing: true, analytics_context: null });
  assert.equal(repaired.created, false);
  assert.equal(repaired.saved, true);
  assert.deepEqual(repaired.analytics_context, consent);
  assert.equal(newsletter.rows.length, 2);
  assert.equal(sales.rows.length, 2);

  const subscriber = { email: 'subscriber@example.invalid', requestId: randomUUID() };
  const first = request(subscriber);
  assert.equal(first.ok, true);
  assert(first.analytics_event_id);
  assert.deepEqual(request(subscriber), first);
  assert.equal(newsletter.rows.length, 3);
});
