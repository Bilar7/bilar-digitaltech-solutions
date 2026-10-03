import React from 'react';
import { Send, Play, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface HeroProps {
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices }) => {
  const { companyInfo } = useSiteData();
  const scrollToProjects = () => {
    document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[570px] lg:min-h-[600px] overflow-hidden text-white flex items-start bilar-reference-hero"
    >
      {/* Hero inteiro sobre uma única imagem: sem divisão entre texto e fotografia. */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#071d2b]">
        <img
          src={companyInfo.heroImage || '/bilar_hero_bilar_office.webp'}
          alt="Bilar DigitalTech Solutions — ambiente profissional de trabalho"
          className="w-full h-full object-cover object-center bilar-reference-hero-image"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />

        {/*
          Contraste localizado apenas onde o texto está.
          A fotografia continua visível em toda a largura do Hero.
          Não existe painel azul a separar os dois lados.
        */}
        <div className="absolute inset-0 pointer-events-none bilar-hero-reading-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-26 pb-18 relative z-10 w-full">
        <div className="max-w-[590px] bilar-hero-copy">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 backdrop-blur-sm px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.08em] text-white uppercase">
            <span className="w-2 h-2 rounded-full bg-[#20d477] shadow-[0_0_10px_rgba(32,212,119,.8)]" />
            <span>{companyInfo.badge || 'INOVAÇÃO QUE TRANSFORMA'}</span>
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-white leading-[0.98] drop-shadow-[0_3px_18px_rgba(0,0,0,.35)]">
            {(companyInfo.heroTitle || 'Transformamos ideias em soluções digitais.').split(/(ideias|soluções digitais)/i).map((part, i) => <React.Fragment key={i}>{/^(ideias|soluções digitais)$/i.test(part) ? <span className="bg-gradient-to-r from-[#18a7ff] via-[#20c8a0] to-[#49e46b] bg-clip-text text-transparent">{part}</span> : part}</React.Fragment>)}
          </h1>

          <p className="mt-5 text-sm sm:text-[15px] lg:text-base text-white/95 leading-relaxed font-medium max-w-[545px] drop-shadow-[0_2px_10px_rgba(0,0,0,.55)]">
            {companyInfo.heroSubtitle || 'Não criamos apenas tecnologia. Criamos produtos, serviços e soluções que transformam ideias em oportunidades reais.'}
          </p>

          <div className="pt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreServices}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#10b981] text-white font-bold text-xs sm:text-sm shadow-[0_10px_28px_rgba(8,124,240,.30)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Conheça os Nossos Serviços</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToProjects}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0757b8] hover:bg-black/35 text-white font-bold text-xs sm:text-sm border border-white/70 backdrop-blur-sm transition-all duration-200 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Ver Projetos</span>
            </button>
          </div>

          <div className="pt-5 text-sm sm:text-base font-semibold italic text-white/95 drop-shadow-[0_2px_9px_rgba(0,0,0,.65)]">
            Ideias que conectam. Soluções que transformam.
          </div>

          <div className="bilar-hero-trust-grid" aria-label="Compromissos Bilar">
            <div className="bilar-hero-trust-item"><strong>Privacidade</strong><span>Dados tratados com responsabilidade.</span></div>
            <div className="bilar-hero-trust-item"><strong>Segurança</strong><span>Boas práticas desde o início.</span></div>
            <div className="bilar-hero-trust-item"><strong>Crescimento</strong><span>Soluções preparadas para evoluir.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
