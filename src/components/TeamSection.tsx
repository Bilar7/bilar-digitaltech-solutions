import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Github, Award, Sparkles, X, ArrowRight, UserCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { TeamMember } from '../types';

interface TeamSectionProps {
  onContactClick: (prefillNote?: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onContactClick }) => {
  const { teamMembers } = useSiteData();
  const { tr } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section id="equipa" className="py-16 sm:py-20 bg-slate-50 text-slate-900 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] tracking-wider uppercase">
              <span className="w-5 h-0.5 bg-[#059669] rounded-full" />
              <span>{tr('team')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              {tr('careersTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Liderados pelo nosso Fundador e CEO <strong>George Fernando Bilar</strong> e pelo nosso Gestor Geral e Investidor <strong>Bilar Fernando Bilar</strong>, a nossa equipa reúne os melhores talentos em engenharia de software, inteligência artificial e design corporativo.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onContactClick('Gostaria de agendar uma reunião com a equipa da Bilar')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{tr('talk')}</span>
            </button>
          </div>
        </div>

        {/* Leadership Highlight Cards (George Fernando Bilar & Bilar Fernando Bilar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {teamMembers.filter((m) => m.isLeadership).map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
            >
              {/* Subtle accent ribbon */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />

              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-emerald-100 bg-slate-100">
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Official Leadership Badge */}
                <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full shadow tracking-wider uppercase">
                  LIDERANÇA
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                    {leader.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                    {leader.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0284c7] mt-0.5">
                    {leader.role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {leader.bio}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={() => setSelectedMember(leader)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors"
                  >
                    <span>Ver Perfil Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      title={leader.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {leader.phone && (
                    <a
                      href={`tel:${leader.phone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      title={leader.phone}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Team Members Grid */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span>CORPO TÉCNICO & ESPECIALISTAS</span>
            <span className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.filter((m) => !m.isLeadership).map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Photo & Badge */}
                  <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-bold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {member.badge}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 pt-1">
                      {member.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 leading-snug">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 text-center line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0284c7]">
                    {member.specialty.split(',')[0]}
                  </span>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Ver detalhes"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {selectedMember.badge}
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedMember.name}</h3>
                <p className="text-xs font-semibold text-[#0284c7]">{selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biografia & Trajetória</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedMember.bio}</p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-700">Áreas de Especialidade:</div>
              <div className="text-xs text-slate-600">{selectedMember.specialty}</div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedMember.email && (
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={selectedMember.email}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {selectedMember.phone && (
                  <a
                    href={`tel:${selectedMember.phone}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={selectedMember.phone}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  const name = selectedMember.name;
                  setSelectedMember(null);
                  onContactClick(`Gostaria de entrar em contacto direto com ${name}`);
                }}
                className="px-5 py-2.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Solicitar Contacto
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
