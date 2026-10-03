import React from 'react';
import { X, Target, Rocket, HeartHandshake, Award, Globe, Users, ShieldCheck, Briefcase } from 'lucide-react';
import { BilarLogo } from './BilarLogo';
import { useSiteData } from '../context/SiteContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenQuote }) => {
  const { companyInfo } = useSiteData();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Logo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <BilarLogo size="md" theme="light" />
          <div className="text-xs text-[#059669] font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 w-fit">
            📍 Moçambique • Atendimento Global
          </div>
        </div>

        {/* Company Vision & Story */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#059669] tracking-wider uppercase">
            <span className="w-5 h-0.5 bg-[#059669] rounded-full" />
            <span>SOBRE A NOSSA EMPRESA</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            A Bilar DigitalTech Solutions
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            A <strong>Bilar DigitalTech Solutions</strong> é uma empresa de ponta no setor de engenharia de software e inovação digital em Moçambique. Fundada e liderada pelo CEO <strong>George Fernando Bilar</strong>, juntamente com o seu irmão <strong>Bilar Fernando Bilar</strong> (Gestor Geral e Investidor Principal), a empresa desenvolve ecossistemas digitais de alta performance, desde websites e lojas online até sistemas ERP integrados, aplicações móveis nativas e inteligência artificial corporativa.
          </p>
        </div>

        {/* Leadership Duo Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-cyan-50/50 to-white border border-emerald-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Liderança Executiva & Estratégica</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={companyInfo.aboutImage || '/bilar_hero_bilar_office.webp'}
                  alt="George Fernando Bilar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  CEO & FUNDADOR
                </span>
                <div className="text-sm font-black text-slate-900 mt-1">George Fernando Bilar</div>
                <div className="text-[11px] text-slate-500">Visão Tecnológica & Liderança</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src="/bilar_manager_profile_final.webp"
                  alt="Bilar Fernando Bilar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#0284c7] bg-cyan-50 px-2 py-0.5 rounded-full">
                  GESTOR & INVESTIDOR
                </span>
                <div className="text-sm font-black text-slate-900 mt-1">Bilar Fernando Bilar</div>
                <div className="text-[11px] text-slate-500">Gestão Geral & Finanças</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars: Missão, Visão e Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center">
              <Rocket className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Nossa Missão</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Criar soluções tecnológicas ágeis e acessíveis que acelerem negócios e conectem ideias a resultados práticos.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Nossa Visão</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidar-nos como a referência líder em inovação de software e engenharia digital de Moçambique para o mundo.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Nossos Valores</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ética inabalável, inovação contínua, compromisso com a qualidade técnica e relações duradouras com clientes.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
          <div><div className="text-xl sm:text-2xl font-black text-[#0f172a]">{companyInfo.stats?.[0]?.value || '0'}</div><div className="text-[11px] text-slate-600 font-medium">{companyInfo.stats?.[0]?.label || 'Projectos publicados'}</div></div>
          <div><div className="text-xl sm:text-2xl font-black text-[#0f172a]">{companyInfo.stats?.[1]?.value || '0'}</div><div className="text-[11px] text-slate-600 font-medium">{companyInfo.stats?.[1]?.label || 'Produtos Bilar'}</div></div>
          <div><div className="text-xl sm:text-2xl font-black text-[#0f172a]">{companyInfo.stats?.[2]?.value || '0'}</div><div className="text-[11px] text-slate-600 font-medium">{companyInfo.stats?.[2]?.label || 'Pessoas na equipa'}</div></div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 italic">
            "Tecnologia que aproxima ideias e pessoas." — <strong>Bilar</strong>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="px-6 py-2.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Fale Connosco
          </button>
        </div>
      </div>
    </div>
  );
};
