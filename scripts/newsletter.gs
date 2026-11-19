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
      const inquiryId = saveInquiry(data.inquiry);
      SpreadsheetApp.flush();
      return result({ ok: true, inquiryId });
    }
    if (data.kind !== undefined) return result({ ok: false });
    subscribe(emailAddress(data.email), new Date());
    SpreadsheetApp.flush();
    return result({ ok: true });
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

function subscribe(email, time) {
  const sheet = SpreadsheetApp.openById(NEWSLETTER_SHEET).getSheetById(0);
  const fields = { '이메일': email, '구독 신청 시각 (KST)': Utilities.formatDate(time, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') };
  const columns = columnMap(sheet, Object.keys(fields));
  if (!findCell(sheet, columns['이메일'], email)) appendFields(sheet, columns, fields, ['이메일']);
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
    '프로젝트 설명': inquiry.description || '', '희망 기간': inquiry.duration || '', '희망 견적': inquiry.budget || '',
    '마케팅 수신 동의 시각': inquiry.marketing ? time : '', '문의 ID': inquiry.id,
  };
  const sheet = SpreadsheetApp.openById(WDP_SALES_SHEET).getSheetById(0);
  const columns = columnMap(sheet, Object.keys(fields));
  const previous = findCell(sheet, columns['문의 ID'], inquiry.id);
  if (previous) {
    const row = sheet.getRange(previous.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0];
    if (row[columns['이메일'] - 1] !== email ||
        row[columns['마케팅 수신 동의 여부'] - 1] !== fields['마케팅 수신 동의 여부']) throw Error('conflict');
  } else {
    appendFields(sheet, columns, fields, ['연락처', '이메일']);
    SpreadsheetApp.flush();
  }
  // A retry after a partial write reuses the lead and completes the subscriber upsert.
  if (inquiry.marketing) subscribe(email, time);
  return inquiry.id;
}

function result(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
