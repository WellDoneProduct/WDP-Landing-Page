import Script from 'next/script';
import { contactMarkup } from '@/lib/home-markup';

export default function ContactSection() {
  return <>
    <link rel="stylesheet" href="/contact-form.css" />
    <div className="editorial-contact" dangerouslySetInnerHTML={{ __html: contactMarkup }} />
    <Script src="/contact-form.js" strategy="afterInteractive" />
  </>;
}
