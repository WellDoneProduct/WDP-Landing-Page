import assert from 'node:assert/strict';
import test from 'node:test';
import { createAnalytics } from '../public/analytics/analytics.js';

test('events retain their original fields while the GTM initialization tags load', async () => {
  const location = new URL('https://www.welldoneproduct.com/?utm_campaign=qa');
  globalThis.window = { location, setTimeout: () => {} };
  globalThis.document = {
    cookie: '',
    referrer: '',
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    head: { appendChild() {} },
  };

  let page = { area: 'marketing', type: 'home', path: '/' };
  const analytics = createAnalytics({ brand: 'welldoneproduct', getConsent: () => true, getPage: () => page });

  assert.equal(analytics.pageView(), true);
  page = { area: 'marketing', type: 'blog_detail', path: '/blog/fixture', contentId: 'cms-id' };
  assert.equal(analytics.track('content_view'), true);
  const id = crypto.randomUUID();
  assert.equal(analytics.track('generate_lead', { form_id: 'consultation', event_id: id }), true);
  assert.equal(analytics.track('generate_lead', { form_id: 'consultation', event_id: id }), false);

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
