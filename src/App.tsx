/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsAndAboutSection } from './components/ProjectsAndAboutSection';
import { TeamSection } from './components/TeamSection';
import { BlogSection } from './components/BlogSection';
import { TestimonialsAndCTA } from './components/TestimonialsAndCTA';
import { BusinessExtras } from './components/BusinessExtras';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { QuoteModal } from './components/QuoteModal';
import { AboutModal } from './components/AboutModal';
import { SearchModal } from './components/SearchModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState<'privacy'|'terms'|'cookies'|null>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('main section'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!nodes.length || !('IntersectionObserver' in window)) return;
    nodes.forEach((node) => node.classList.add('scroll-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -55px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 4500);
  };
  const openQuote = (service?: string) => { setSelectedServiceForQuote(service); setQuoteModalOpen(true); };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return <div className="min-h-screen bg-white text-slate-900 selection:bg-[#10b981] selection:text-white relative font-sans">
    {toastMessage && <div className="fixed top-20 right-5 z-50 max-w-sm bg-slate-900 border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
      <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm font-semibold leading-snug flex-1">{toastMessage}</div>
      <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-0.5" aria-label="Fechar notificação"><X className="w-4 h-4" /></button>
    </div>}

    <Navbar onOpenQuoteModal={() => openQuote()} onOpenSearchModal={() => setSearchModalOpen(true)} />

    <main>
      <Hero onExploreServices={() => scrollTo('servicos')} />
      <ServicesSection onSelectServiceForQuote={openQuote} />
      <ProjectsAndAboutSection onOpenAboutModal={() => setAboutModalOpen(true)} onOpenQuoteModal={() => openQuote()} />
      <TeamSection onContactClick={(note) => openQuote(note || 'Contacto com a Equipa Bilar')} />
      <BlogSection onOpenQuote={openQuote} onSuccessToast={showToast} />
      <TestimonialsAndCTA onSuccessToast={showToast} />
      <BusinessExtras onOpenQuote={() => openQuote()} />
    </main>

    <Footer onSuccessToast={showToast} onOpenLegal={setLegalOpen} />
    {legalOpen && <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />}
    <WhatsAppWidget />
    <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} preselectedService={selectedServiceForQuote} onSuccessToast={showToast} />
    <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} onOpenQuote={() => { setAboutModalOpen(false); openQuote(); }} />
    <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSelectService={openQuote} />
  </div>;
}
