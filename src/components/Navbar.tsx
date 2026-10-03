import React, { useState, useEffect } from 'react';
import { Send, Menu, X, MessageCircle, Instagram, Linkedin, Youtube, Search } from 'lucide-react';
import { BilarLogo } from './BilarLogo';
import { useSiteData } from '../context/SiteContext';

interface NavbarProps {
  onOpenQuoteModal: () => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal, onOpenSearchModal }) => {
  const { companyInfo } = useSiteData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const sectionIds = ['inicio', 'sobre', 'servicos', 'projetos', 'equipa', 'blog', 'contacto'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio', id: 'inicio' },
    { label: 'Sobre Nós', href: '#sobre', id: 'sobre' },
    { label: 'Serviços', href: '#servicos', id: 'servicos' },
    { label: 'Projetos', href: '#projetos', id: 'projetos' },
    { label: 'Equipa', href: '#equipa', id: 'equipa' },
    { label: 'Insights', href: '#blog', id: 'blog' },
    { label: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header sticky top-0 z-40">
      <div className="site-header-inner">
        <div className="header-color-ribbon" aria-hidden="true" />
        <div className="site-header-content">
          <div className="site-header-row site-header-grid">
            <div className="site-header-brand">
              <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="inline-flex items-center">
                <BilarLogo size="lg" theme="dark" className="scale-[0.88] origin-left" />
              </a>
            </div>

            <nav className="site-header-nav" aria-label="Navegação principal">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={isActive ? 'active' : ''}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="site-header-actions">
              <button onClick={onOpenSearchModal} aria-label="Pesquisar" className="header-icon-button">
                <Search className="w-4 h-4" />
              </button>

              <button onClick={onOpenQuoteModal} className="header-contact inline-flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Fale Connosco</span>
              </button>

              <div className="header-socials" aria-label="Redes sociais">
                <a href={companyInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Bilar"><MessageCircle className="w-4 h-4" /></a>
                {companyInfo.instagram && <a href={companyInfo.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Bilar"><Instagram className="w-4 h-4" /></a>}
                {companyInfo.linkedin && <a href={companyInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Bilar"><Linkedin className="w-4 h-4" /></a>}
                {companyInfo.youtube && <a href={companyInfo.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube Bilar"><Youtube className="w-4 h-4" /></a>}
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="header-menu-button md:hidden" aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-panel md:hidden">
            <nav aria-label="Navegação móvel">
              {navLinks.map((link) => (
                <a key={link.id} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={activeSection === link.id ? 'active' : ''}>
                  {link.label}
                </a>
              ))}
            </nav>
            <button onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal(); }} className="mobile-contact-button">
              <Send className="w-4 h-4" /> Fale Connosco
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
