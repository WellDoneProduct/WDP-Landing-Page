// Deploy as a web app. TOKEN_SHA256 is the SHA-256 digest of the server-only token.
const NEWSLETTER_SHEET = '147Sw4G7EhhjWFH8wm2TxLwMaxTqUnQU9wBS4pN7KDso';

function doPost(event) {
  if (!event || !event.postData) return result(false);
  const data = JSON.parse(event.postData.contents);
  const expected = PropertiesService.getScriptProperties().getProperty('TOKEN_SHA256');
  if (!expected || typeof data.token !== 'string' || data.token.length !== 64) return result(false);
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data.token)
    .map(byte => ('0' + (byte & 255).toString(16)).slice(-2)).join('');
  if (digest !== expected) return result(false);

  const email = String(data.email || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return result(false);
  const sheet = SpreadsheetApp.openById(NEWSLETTER_SHEET).getSheetById(0);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const last = sheet.getLastRow();
    if (!last || sheet.getRange(1, 1).getValue() !== '이메일') return result(false);
    const found = last > 1 && sheet.getRange(2, 1, last - 1, 1)
      .createTextFinder(email).matchEntireCell(true).matchCase(false).useRegularExpression(false).findNext();
    if (!found) {
      const stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
      sheet.appendRow([email.startsWith('=') ? "'" + email : email, stamp]);
      SpreadsheetApp.flush();
    }
    return result(true);
  } finally {
    lock.releaseLock();
  }
}

function result(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON);
}
