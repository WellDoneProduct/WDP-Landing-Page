import { footerInviteMarkup, footerMainMarkup } from '@/lib/home-markup';
import FooterInvite from './FooterInvite';

export default function SiteFooter() {
  return <div className="editorial-footer">
    <footer className="site-footer">
      <FooterInvite><div dangerouslySetInnerHTML={{ __html: footerInviteMarkup }} /></FooterInvite>
      <div dangerouslySetInnerHTML={{ __html: footerMainMarkup }} />
    </footer>
  </div>;
}
