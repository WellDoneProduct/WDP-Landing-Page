// The server authenticates with the token whose SHA-256 is in TOKEN_SHA256.
const NEWSLETTER_SHEET = '147Sw4G7EhhjWFH8wm2TxLwMaxTqUnQU9wBS4pN7KDso';
const WDP_SALES_SHEET = '1krMgs9WWiwGqAWTVcVAaqTlsE3s7B-MSQ4g7F1SUaEI';

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(event.postData.contents);
    if (!data || !authorized(data.token)) return result({ ok: false });
    if (data.kind === 'blogEngagement') {
      if (data.action !== 'read') lock.waitLock(15000);
      return result({ ok: true, counts: blogEngagement(data) });
    }
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
  const sheet = SpreadsheetApp.openById(WDP_SALES_SHEET).getSheetById(0);
  analyticsColumns(sheet, ['분석 이벤트 ID', '분석 유입', '상담 시작 콘텐츠', '문의 사업영역']);
  fields['분석 이벤트 ID'] = Utilities.getUuid();
  fields['분석 유입'] = inquiry.attribution ? JSON.stringify(inquiry.attribution) : '';
  fields['상담 시작 콘텐츠'] = inquiry.origin ? JSON.stringify(inquiry.origin) : '';
  const columns = columnMap(sheet, Object.keys(fields));
  const previous = findCell(sheet, columns['문의 ID'], inquiry.id);
  if (previous) {
    const row = sheet.getRange(previous.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0];
    if (row[columns['이메일'] - 1] !== email ||
        row[columns['마케팅 수신 동의 여부'] - 1] !== fields['마케팅 수신 동의 여부']) throw Error('conflict');
    fields['분석 이벤트 ID'] = row[columns['분석 이벤트 ID'] - 1] || null;
  } else {
    appendFields(sheet, columns, fields, ['연락처', '이메일']);
    SpreadsheetApp.flush();
  }
  // A retry after a partial write reuses the lead and completes the subscriber upsert.
  if (inquiry.marketing) subscribe(email, time);
  return { inquiryId: inquiry.id, created: !previous, analytics_event_id: fields['분석 이벤트 ID'] };
}

function result(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

// The visible totals are formulas over these per-reader records. Retrying a write
// cannot increment a separate counter twice, even if a previous response was lost.
function blogEngagement(data) {
  const reading = data.action === 'read';
  const items = data.items;
  if (!Array.isArray(items) || !items.length || items.length > 6 ||
      (!reading && (items.length !== 1 || !['view','like','unlike'].includes(data.action)))) throw Error('action');
  const book = SpreadsheetApp.openById('12lYZtAZ1M5KxCudhfOqPEhxx4rf2DgQXDCoZiD41LsE');
  const totals = book.getSheetById(0);
  const readers = book.getSheetById(745201);
  const rows = totals.getDataRange().getValues();
  const counts = {};
  for (const item of items) {
    if (!item || typeof item.post !== 'string' || !/^[a-zA-Z0-9_.-]{1,128}$/.test(item.post) ||
        !(reading && item.key === null) && !/^[a-f0-9]{64}$/.test(item.key)) throw Error('post');
    const index = rows.findIndex(row => row[3] === item.post);
    let liked = false;
    const cell = item.key && findCell(readers, 1, item.key);
    const previous = cell && readers.getRange(cell.getRow(), 1, 1, 5).getValues()[0];
    if (previous) liked = Number(previous[4]) === 1;
    if (reading) {
      counts[item.post] = { views: index < 1 ? 0 : Number(rows[index][2]), likes: index < 1 ? 0 : Number(rows[index][1]), liked };
      continue;
    }
    if (typeof item.title !== 'string' || !item.title.trim()) throw Error('title');
    const title = item.title.startsWith('=') ? "'" + item.title : item.title;
    const row = index < 1 ? totals.getLastRow() + 1 : index + 1;
    if (index < 1) {
      const source = "'" + readers.getName().replace(/'/g,"''") + "'!";
      const sum = col => '=SUMIF(' + source + 'B$2:B,D' + row + ',' + source + col + '$2:' + col + ')';
      totals.appendRow([title, sum('E'), sum('D'), item.post]);
    } else if (rows[index][0] !== item.title) totals.getRange(row, 1).setValue(title);
    const today = 'KST-' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd');
    const lastDay = previous ? previous[2] : '';
    const newView = data.action === 'view' && lastDay !== today;
    const nextLiked = data.action === 'view' ? liked : data.action === 'like';
    if (newView || liked !== nextLiked) {
      const record = [item.key, item.post, newView ? today : lastDay, Number(previous ? previous[3] : 0) + Number(newView), Number(nextLiked)];
      if (cell) readers.getRange(cell.getRow(), 1, 1, 5).setValues([record]);
      else readers.appendRow(record);
    }
    SpreadsheetApp.flush();
    const [likes, views] = totals.getRange(row, 2, 1, 2).getValues()[0];
    counts[item.post] = { views: Number(views), likes: Number(likes), liked: nextLiked };
  }
  return counts;
}
