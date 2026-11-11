import { footerMarkup } from '@/lib/home-markup';

export default function SiteFooter() {
  return <div className="editorial-footer" dangerouslySetInnerHTML={{ __html: footerMarkup }} />;
}
