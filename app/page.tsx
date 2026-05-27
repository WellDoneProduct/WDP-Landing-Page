import { ModalProvider } from '@/components/ModalContext';
import ContactModal from '@/components/ContactModal';
import Navbar from '@/components/Navbar';
import Splash from '@/components/Splash';
import Banner from '@/components/Banner';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Problems from '@/components/Problems';
import Solutions from '@/components/Solutions';
import Process from '@/components/Process';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <ModalProvider>
      <Splash />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Problems />
        <Solutions />
        <Banner />
        <Process />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
      <ContactModal />
    </ModalProvider>
  );
}
