import fs from 'node:fs';
import path from 'node:path';

// The home remains a static document; reuse its actual footer markup.
export default function SiteFooter() {
  const home = fs.readFileSync(path.join(process.cwd(), 'public/Architect.html'), 'utf8');
  const footer = home.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? '';
  const markup = footer
    .replace('src="Logo.svg"', 'src="/Logo.svg"')
    .replace(/(<div class="footer-band-tagline">[\s\S]*?<\/div>)/, '$1<a class="wdp-contact footer-contact" href="/#cta">상담 신청</a>');
  return <div className="editorial-footer" dangerouslySetInnerHTML={{ __html: markup }} />;
}
