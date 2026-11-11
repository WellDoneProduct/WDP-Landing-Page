import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

// The home page (public/Architect.html) is the single source of truth for the site header and
// footer. Editorial pages read them from it at build time, so a nav or footer change is made once.
const homeHtml = fs.readFileSync(path.join(process.cwd(), 'public/Architect.html'), 'utf8');

// Fail the build loudly instead of shipping pages with a silently empty header or footer.
const extract = (pattern: RegExp, name: string) => {
  const markup = homeHtml.match(pattern)?.[0];
  if (!markup) throw new Error(`${name} markup not found in public/Architect.html`);
  return markup;
};

export const headerMarkup = extract(/<header class="wdp-header">[\s\S]*?<\/header>/, 'Header');

export const footerMarkup = extract(/<footer class="site-footer">[\s\S]*?<\/footer>/, 'Footer')
  .replace('src="Logo.svg"', 'src="/Logo.svg"')
  .replace(/(<div class="footer-band-tagline">[\s\S]*?<\/div>)/, '$1<a class="wdp-contact footer-contact" href="/#cta">상담 신청</a>');
