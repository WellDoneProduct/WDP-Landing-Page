// The server authenticates with the token whose SHA-256 is in TOKEN_SHA256.
const NEWSLETTER_SHEET = '147Sw4G7EhhjWFH8wm2TxLwMaxTqUnQU9wBS4pN7KDso';
const WDP_SALES_SHEET = '1krMgs9WWiwGqAWTVcVAaqTlsE3s7B-MSQ4g7F1SUaEI';

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(event.postData.contents);
    if (!data || !authorized(data.token)) return result({ ok: false });
    lock.waitLock(15000);
    if (data.kind === 'wdpInquiry') {
      const receipt = saveInquiry(data.inquiry);
      SpreadsheetApp.flush();
      return result({ ok: true, ...receipt });
    }
    if (data.kind !== undefined) return result({ ok: false });
    const requestId = typeof data.requestId === 'string' && /^[a-f0-9-]{36}$/i.test(data.requestId) ? data.requestId : null;
    const eventId = subscribe(emailAddress(data.email), new Date(), requestId);
    SpreadsheetApp.flush();
    return result({ ok: true, analytics_event_id: eventId });
  } catch {
    return result({ ok: false });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function authorized(token) {
  if (typeof token !== 'string' || token.length !== 64) return false;
  const expected = PropertiesService.getScriptProperties().getProperty('TOKEN_SHA256');
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)
    .map(byte => ('0' + (byte & 255).toString(16)).slice(-2)).join('');
  return digest === expected;
}

function emailAddress(value) {
  const email = String(value || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('email');
  return email;
}

function columnMap(sheet, names) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const columns = {};
  for (const name of names) {
    const index = headers.indexOf(name);
    if (index === -1 || index !== headers.lastIndexOf(name)) throw Error('header');
    columns[name] = index + 1;
  }
  return columns;
}

function findCell(sheet, column, value) {
  const rows = sheet.getLastRow() - 1;
  return rows > 0 && sheet.getRange(2, column, rows, 1).createTextFinder(value)
    .matchEntireCell(true).matchCase(false).useRegularExpression(false).findNext();
}

function appendFields(sheet, columns, fields, textColumns) {
  const rowNumber = sheet.getLastRow() + 1;
  if (rowNumber > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 1);
  const row = Array(sheet.getLastColumn()).fill('');
  for (const name of textColumns) sheet.getRange(rowNumber, columns[name]).setNumberFormat('@');
  for (const [name, value] of Object.entries(fields)) {
    row[columns[name] - 1] = typeof value === 'string' && value.startsWith('=') ? "'" + value : value;
  }
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
}

function analyticsColumns(sheet, names) {
  const last = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, last).getDisplayValues()[0];
  const missing = names.filter(name => !headers.includes(name));
  if (!missing.length) return;
  const required = last + missing.length - sheet.getMaxColumns();
  if (required > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), required);
  sheet.getRange(1, last + 1, 1, missing.length).setValues([missing]);
}

function subscribe(email, time, requestId) {
  const sheet = SpreadsheetApp.openById(NEWSLETTER_SHEET).getSheetById(0);
  const fields = { '이메일': email, '구독 신청 시각 (KST)': Utilities.formatDate(time, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') };
  if (requestId) {
    analyticsColumns(sheet, ['구독 요청 ID', '분석 이벤트 ID']);
    fields['구독 요청 ID'] = requestId;
    fields['분석 이벤트 ID'] = Utilities.getUuid();
  }
  const columns = columnMap(sheet, Object.keys(fields));
  const previous = findCell(sheet, columns['이메일'], email);
  if (previous) {
    if (!requestId || sheet.getRange(previous.getRow(), columns['구독 요청 ID']).getDisplayValue() !== requestId) return null;
    return sheet.getRange(previous.getRow(), columns['분석 이벤트 ID']).getDisplayValue();
  }
  appendFields(sheet, columns, fields, ['이메일']);
  return fields['분석 이벤트 ID'] || null;
}

function normalizeInquiryContext(raw) {
  if (!raw || raw.brand !== 'welldoneproduct' || raw.form_id !== 'consultation' ||
      typeof raw.is_test !== 'boolean') return null;
  const runId = raw.qa_run_id;
  if (raw.is_test) {
    if (typeof runId !== 'string' || !/^qa_[a-z0-9_]{8,60}$/.test(runId)) return null;
  } else if (runId !== null) return null;

  const clean = { brand: raw.brand, form_id: raw.form_id, is_test: raw.is_test, qa_run_id: runId };
  const keys = ['st_source', 'st_medium', 'st_campaign', 'st_content',
    'origin_content_id', 'origin_cta_location', 'origin_service_type', 'origin_plan_tier'];
  for (const key of keys) {
    const value = raw[key];
    if (key.startsWith('st_') && value === undefined) return null;
    if (value != null && (typeof value !== 'string' || !/^[A-Za-z0-9_:./-]{1,100}$/.test(value))) return null;
    clean[key] = value ?? null;
  }
  return clean;
}

function saveInquiry(inquiry) {
  if (!inquiry || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(inquiry.id)
      || typeof inquiry.marketing !== 'boolean' || !inquiry.name || !inquiry.phone) throw Error('inquiry');
  const email = emailAddress(inquiry.email);
  const time = new Date();
  const fields = {
    '접수시각': time, '회사명': inquiry.company || '', '이름': inquiry.name, '직함': inquiry.position || '',
    '이메일': email, '연락처': inquiry.phone, '유입경로': 'WDP 랜딩페이지',
    '동의': inquiry.privacy === true ? '동의' : '',
    '마케팅 수신 동의 여부': inquiry.marketing ? '동의' : '미동의',
    '문의 사업영역': inquiry.serviceArea || '', '프로젝트 설명': inquiry.description || '', '희망 기간': inquiry.duration || '', '희망 견적': inquiry.budget || '',
    '마케팅 수신 동의 시각': inquiry.marketing ? time : '', '문의 ID': inquiry.id,
  };
  const modern = Object.prototype.hasOwnProperty.call(inquiry, 'analytics_context');
  let context = modern ? normalizeInquiryContext(inquiry.analytics_context) : null;
  const headers = ['분석 이벤트 ID', '분석 유입', '상담 시작 콘텐츠', '문의 사업영역'];
  if (modern) {
    headers.push('분석 컨텍스트');
    fields['분석 컨텍스트'] = JSON.stringify(context);
  }
  const sheet = SpreadsheetApp.openById(WDP_SALES_SHEET).getSheetById(0);
  analyticsColumns(sheet, headers);
  fields['분석 이벤트 ID'] = null;
  if (modern) {
    const source = context && Object.fromEntries(['source', 'medium', 'campaign', 'content'].map(key => [key, context['st_' + key]]));
    const origin = context && Object.fromEntries(Object.entries(context).filter(([key]) => key.startsWith('origin_')));
    fields['분석 유입'] = source ? JSON.stringify({ session_touch: source }) : '';
    fields['상담 시작 콘텐츠'] = origin ? JSON.stringify(origin) : '';
  } else {
    fields['분석 유입'] = inquiry.attribution ? JSON.stringify(inquiry.attribution) : '';
    fields['상담 시작 콘텐츠'] = inquiry.origin ? JSON.stringify(inquiry.origin) : '';
  }
  const columns = columnMap(sheet, Object.keys(fields));
  const previous = findCell(sheet, columns['문의 ID'], inquiry.id);
  if (previous) {
    const row = sheet.getRange(previous.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0];
    if (row[columns['이메일'] - 1] !== email ||
        row[columns['마케팅 수신 동의 여부'] - 1] !== fields['마케팅 수신 동의 여부']) throw Error('conflict');
    fields['분석 이벤트 ID'] = row[columns['분석 이벤트 ID'] - 1] || null;
    if (modern) {
      // A historic receipt has no reliable record of the user's consent or QA run.
      const stored = row[columns['분석 컨텍스트'] - 1];
      try { context = stored ? normalizeInquiryContext(JSON.parse(stored)) : null; }
      catch (_) { context = null; }
    }
  } else {
    fields['분석 이벤트 ID'] = Utilities.getUuid();
    appendFields(sheet, columns, fields, ['연락처', '이메일']);
    SpreadsheetApp.flush();
  }
  // A retry after a partial write reuses the lead and completes the subscriber upsert.
  if (inquiry.marketing) subscribe(email, time);
  const receipt = { inquiryId: inquiry.id, created: !previous, analytics_event_id: fields['분석 이벤트 ID'] };
  if (modern) return { ...receipt, saved: true, analytics_context: context };
  return receipt;
}

function result(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
