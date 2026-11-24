import assert from 'node:assert/strict';
import test from 'node:test';
import { createAnalytics } from '../public/analytics/analytics.js';

function storage() {
  const entries = new Map();
  return {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: key => entries.delete(key),
  };
}

function setupBrowser(url, sessionStorage = storage(), localStorage = storage()) {
  globalThis.window = { location: new URL(url), sessionStorage, localStorage, setTimeout: () => {} };
  globalThis.document = {
    cookie: '',
    referrer: '',
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    head: { appendChild() {} },
  };
}

test('events retain their original fields while the GTM initialization tags load', async () => {
  setupBrowser('https://www.welldoneproduct.com/?utm_campaign=qa');

  let page = { area: 'marketing', type: 'home', path: '/' };
  const analytics = createAnalytics({ brand: 'welldoneproduct', getConsent: () => true, getPage: () => page });

  assert.equal(analytics.pageView(), true);
  page = { area: 'marketing', type: 'blog_detail', path: '/blog/fixture', contentId: 'cms-id' };
  assert.equal(analytics.track('content_view'), true);
  const id = crypto.randomUUID();
  assert.equal(analytics.track('generate_lead', { form_id: 'consultation', event_id: id }), true);
  assert.equal(analytics.track('generate_lead', { form_id: 'consultation', event_id: id }), false);

  const startup = window.dataLayer.slice(0, window.dataLayer.findIndex(entry => entry.event === 'gtm.js'));
  assert.ok(startup.some(command => command[0] === 'set' && command[1]?.send_page_view === false));
  const ready = window.dataLayer.find(entry => entry.event === 'analytics_ready');
  const published = () => window.dataLayer.filter(entry => entry.analytics && entry !== ready);
  assert.deepEqual(published(), []);
  ready.eventCallback();
  ready.eventCallback();
  await Promise.resolve();

  assert.deepEqual(
    published().map(({ event, analytics: payload }) => [event, payload.name, payload.props.page_path]),
    [
      ['page_view', 'page_view', '/'],
      ['content_view', 'content_view', '/blog/fixture'],
      ['generate_lead', 'generate_lead', '/blog/fixture'],
    ],
  );
});

test('the first QA page view and consultation use the original UTM and one stored ID', async () => {
  const sessionStorage = storage();
  const localStorage = storage();
  const expected = { st_source: 'instagram', st_medium: 'paid_social', st_campaign: 'wd_traffic', st_content: 'system' };
  const qaId = 'qa_20261124_system';
  const lead = { saved: true, analytics_event_id: crypto.randomUUID() };
  let consent = false;
  const install = path => createAnalytics({ brand: 'welldoneproduct', getConsent: () => consent, getPage: () => ({
    area: 'marketing', type: path === '/' ? 'home' : 'service', path,
  }) });
  const events = name => (window.dataLayer ?? []).filter(entry => entry.event === name);
  async function finishLoading() {
    events('analytics_ready')[0].eventCallback();
    await Promise.resolve();
  }

  const path = '/services/enterprise-system';
  setupBrowser('https://www.welldoneproduct.com' + path + '?utm_source=instagram&utm_medium=paid_social&utm_campaign=wd_traffic&utm_content=system&qa_run_id=' + qaId, sessionStorage, localStorage);
  const arrival = install(path);
  assert.equal(arrival.pageView(), false);
  assert.equal(events('analytics_ready').length, 0);
  consent = true;
  assert.equal(arrival.pageView(), true);
  assert.equal(arrival.pageView(), false);
  await finishLoading();
  assert.equal(events('page_view').length, 1);
  const initial = events('page_view')[0].analytics;
  assert.equal(initial.props.qa_run_id, qaId);
  assert.equal(initial.props.is_test, true);
  assert.equal(new URL(initial.page_location).searchParams.has('qa_run_id'), false);
  assert.equal(document.cookie, '');

  setupBrowser('https://www.welldoneproduct.com/#cta', sessionStorage, localStorage);
  const consultation = install('/');
  const context = consultation.consultationPayload('consultation');
  assert.deepEqual(Object.fromEntries(Object.keys(expected).map(key => [key, context[key]])), expected);
  const receipt = { ...lead, analytics_context: { ...context, origin_content_id: 'saved-service-id' } };
  assert.equal(consultation.trackConsultationSuccess({ ...receipt, saved: false }), false);
  assert.equal(consultation.trackConsultationSuccess({ ...receipt, analytics_context: null }), false);
  assert.equal(consultation.trackConsultationSuccess({ ...receipt, analytics_context: { ...context, qa_run_id: 'qa_other_test' } }), false);
  assert.equal(consultation.trackConsultationSuccess(receipt), true);
  assert.equal(consultation.trackConsultationSuccess(receipt), false);
  await finishLoading();
  assert.equal(events('generate_lead').length, 1);
  const conversion = events('generate_lead')[0].analytics.props;
  assert.equal(conversion.event_id, lead.analytics_event_id);
  assert.equal(conversion.qa_run_id, qaId);
  assert.equal(conversion.origin_content_id, 'saved-service-id');
  assert.deepEqual(Object.fromEntries(Object.keys(expected).map(key => [key, conversion[key]])), expected);

  setupBrowser('https://www.welldoneproduct.com/', sessionStorage, localStorage);
  assert.equal(install('/').trackConsultationSuccess(receipt), false);
  assert.equal(events('generate_lead').length, 0);
});
