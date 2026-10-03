import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { BilarLogo } from './BilarLogo';
import { useSiteData } from '../context/SiteContext';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onSuccessToast: (msg: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onSuccessToast,
}) => {
  const { addContactMessage, companyInfo, services } = useSiteData();
  const [service, setService] = useState(services.find(s=>s.active!==false)?.title||'Outro Serviço Tecnológico');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('Moçambique');
  const [interestType, setInterestType] = useState('Serviço');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Por favor, preencha os dados de contacto.');
      return;
    }

    setIsSubmitting(true);
    addContactMessage({ name, email, phone, company, country, interestType, budget, timeline, message: `${service}: ${details || 'Pedido de orçamento'}` });
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSuccessToast(`Solicitação recebida com sucesso pela Bilar DigitalTech.`);
    }, 700);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Olá Bilar DigitalTech Solutions!\nMeu nome é ${name || 'um cliente'}.\nServiço pretendido: *${service}*.\nContacto: ${phone || email}\nDetalhes: ${details || 'Gostaria de uma proposta e atendimento personalizado.'}`
    );
    window.open(`${companyInfo.whatsappUrl.split('?')[0]}?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full text-[#10b981] flex items-center justify-center mx-auto shadow">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a]">
              Solicitação Enviada com Sucesso!
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Obrigado, <strong>{name}</strong>. A nossa equipa da Bilar DigitalTech Solutions
              entrará em contacto direto consigo nas próximas horas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleWhatsAppRedirect}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp Agora</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header with Unified Bilar Logo */}
            <div className="border-b border-slate-100 pb-4">
              <BilarLogo size="sm" theme="light" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mt-3">
                Fale Connosco & Solicite Proposta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Preencha o formulário abaixo ou fale diretamente via WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Serviço Pretendido
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"
                >
                  {services.filter(s=>s.active!==false).map(s=><option key={s.id} value={s.title}>{s.title}</option>)}
                  <option value="Outro Serviço Tecnológico">Outro Serviço Tecnológico</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Contacto / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+258 84..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Empresa / Organização</label><input type="text" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Nome da empresa" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"/></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">País</label><input type="text" value={country} onChange={e=>setCountry(e.target.value)} placeholder="Moçambique" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"/></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Tipo de pedido</label><select value={interestType} onChange={e=>setInterestType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm"><option>Serviço</option><option>Produto</option><option>Consultoria</option><option>Parceria</option><option>Suporte</option><option>Outro</option></select></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Orçamento</label><input type="text" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Opcional" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm"/></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Prazo</label><input type="text" value={timeline} onChange={e=>setTimeline(e.target.value)} placeholder="Ex.: 2 meses" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm"/></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Detalhes do Projeto
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Conte-nos brevemente o que pretende desenvolver..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'A enviar...' : 'Enviar Solicitação'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
