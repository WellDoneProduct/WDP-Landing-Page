import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

// The home page (public/ai-native.html) is the single source of truth for the site header and
// footer. Editorial pages read them from it at build time, so a nav or footer change is made once.
const homeHtml = fs.readFileSync(path.join(process.cwd(), 'public/ai-native.html'), 'utf8');

// Fail the build loudly instead of shipping pages with a silently empty header or footer.
const extract = (pattern: RegExp, name: string) => {
  const markup = homeHtml.match(pattern)?.[0];
  if (!markup) throw new Error(`${name} markup not found in public/ai-native.html`);
  return markup;
};

export const headerMarkup = extract(/<header class="wdp-header">[\s\S]*?<\/header>/, 'Header');

export const footerInviteMarkup = extract(/<div class="footer-band">[\s\S]*?(?=\s*<!-- END_FOOTER_INVITE -->)/, 'Footer invite')
  .replace(/(<div class="footer-band-tagline">[\s\S]*?<\/div>)/, '$1<a class="wdp-contact footer-contact" href="/#cta">상담 신청</a>');

export const footerMainMarkup = extract(/<div class="footer-main">[\s\S]*?(?=\s*<\/footer>)/, 'Footer information')
  .replace('src="Logo.svg"', 'src="/Logo.svg"');

export const contactMarkup = extract(/<section class="section cta-section" id="cta">[\s\S]*?<\/section>/, 'Contact')
  + extract(/<dialog class="privacy-modal-dialog" id="privacyModal"[\s\S]*?<\/dialog>/, 'Privacy notice')
  + extract(/<dialog class="privacy-modal-dialog" id="marketingModal"[\s\S]*?<\/dialog>/, 'Marketing notice');
