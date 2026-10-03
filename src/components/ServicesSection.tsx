import React, { useState } from 'react';
import { ContentResources } from './ContentResources';
import { useSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { serviceCopy } from '../i18n';
import { Code2, Smartphone, LayoutDashboard, Cloud, ShieldCheck, Network, Globe, BrainCircuit, Palette, BriefcaseBusiness, Cpu, RadioTower, ArrowRight, ArrowUpRight, X, Send, CheckCircle } from 'lucide-react';

interface ServicesSectionProps { onSelectServiceForQuote: (serviceTitle: string) => void; }

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const { services: managedServices } = useSiteData();
  const { language, tr } = useLanguage();
  const iconMap: Record<string, any> = { Globe, Smartphone, LayoutDashboard, Cloud, ShieldCheck, Network, BrainCircuit, Palette, BriefcaseBusiness, Cpu, RadioTower, Code2 };
  // Fotografias contextuais reais (Unsplash). O SVG/local definido no conteúdo continua como fallback.
  const contextualImages: Record<string,string> = {
    web:'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=82&w=1200',
    mobile:'https://images.unsplash.com/photo-1590291146261-883bd94677a5?auto=format&fit=crop&q=82&w=1200',
    sistemas:'https://images.unsplash.com/photo-1771923082503-0a3381c46cef?auto=format&fit=crop&q=82&w=1200',
    cloud:'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&q=82&w=1200',
    seguranca:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=82&w=1200',
    redes:'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?auto=format&fit=crop&q=82&w=1200',
    ia:'https://images.unsplash.com/photo-1695144244472-a4543101ef35?auto=format&fit=crop&q=82&w=1200',
    embebidos:'/services/embedded-systems.svg',
    iot:'/services/internet-of-things.svg',
    design:'https://images.unsplash.com/photo-1764588037085-a78240016f8b?auto=format&fit=crop&q=82&w=1200',
    consultoria:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=82&w=1200'
  };
  const services = managedServices.filter(s => s.active !== false).sort((a,b)=>(a.order??0)-(b.order??0)).map((s,i) => ({
    id:s.id,
    title:serviceCopy[language][s.id]?.title || s.title,
    subtitle:serviceCopy[language][s.id]?.description || s.description,
    icon:iconMap[s.iconName] || Code2,
    accent:s.id==='web'?'blue':s.id==='mobile'?'green':s.id==='sistemas'?'violet':s.id==='cloud'?'cyan':s.id==='seguranca'?'red':s.id==='redes'?'orange':s.id==='ia'?'indigo':s.id==='embebidos'?'teal':s.id==='iot'?'sky':s.id==='design'?'pink':'gold',
    image:contextualImages[s.id] || s.image || '/bilar_hero_bilar_office.webp',
    features:s.features,
    extras:s.extras,
    price:s.price,
  }));

  return <section id="servicos" className="services-modern-section bg-white text-slate-900">
    <div className="services-shell">
      <div className="services-heading-row">
        <div className="services-heading-copy">
          <div className="eyebrow"><span />{tr('services')}</div>
          <h2>{tr('servicesTitle')}</h2>
          <p>{tr('servicesText')} Escolha uma área, veja o que entregamos e avance directamente para o próximo passo.</p>
        </div>
        <button onClick={() => onSelectServiceForQuote('Geral / Todos os Serviços')} className="section-outline-button">Falar sobre um projecto <ArrowRight className="w-4 h-4" /></button>
      </div>
      <div className="services-card-grid">
        {services.map(service => {
          const IconComponent = service.icon;
          return <article key={service.id} className={`service-modern-card service-accent-${service.accent}`}>
            <div className="service-card-media">
              <img src={service.image} alt={service.title} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = '/services/web.svg'; }} />
              <div className="service-card-media-overlay" />
              <div className="service-icon"><IconComponent className="w-5 h-5" /></div>
            </div>
            <div className="service-modern-body">
              <div className="service-modern-meta"><span>{service.price || 'Sob consulta'}</span><span>Serviço Bilar</span></div>
              <h3>{service.title}</h3>
              <p>{service.subtitle}</p>
              {!!service.features?.length && <ul className="service-feature-chips">{service.features.slice(0, 3).map((feature:string, index:number) => <li key={index}><CheckCircle className="w-3.5 h-3.5" />{feature}</li>)}</ul>}
              <div className="service-modern-actions">
                <button onClick={() => setSelectedService(service)} className="service-action-primary">Ver detalhes <ArrowUpRight className="w-4 h-4" /></button>
                <button onClick={() => onSelectServiceForQuote(service.title)} className="service-action-secondary">Solicitar orçamento</button>
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
    {selectedService && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
      <div className="service-detail-modal" onClick={e => e.stopPropagation()}>
        <button onClick={() => setSelectedService(null)} className="modal-close-button" aria-label="Fechar"><X className="w-5 h-5" /></button>
        <div className="service-detail-hero"><img src={selectedService.image} alt={selectedService.title} /><div className="service-detail-hero-overlay" /><div><span>Serviço Bilar</span><h3>{selectedService.title}</h3></div></div>
        <div className="service-detail-content">
          <p className="service-detail-lead">{selectedService.subtitle}</p>
          {selectedService.features?.length > 0 && <div><h4>{tr('features')}</h4><ul className="service-feature-list">{selectedService.features.map((f:string,i:number)=><li key={i}><CheckCircle className="w-4 h-4" />{f}</li>)}</ul></div>}
          <ContentResources extras={selectedService.extras} onRequestDemo={() => { const title=selectedService.title; setSelectedService(null); onSelectServiceForQuote(title); }} />
          <div className="service-detail-footer-actions">
            <button onClick={() => { const title=selectedService.title; setSelectedService(null); onSelectServiceForQuote(title); }} className="primary">Solicitar orçamento <Send className="w-4 h-4" /></button>
            <button onClick={() => setSelectedService(null)} className="secondary">{tr('close')}</button>
          </div>
        </div>
      </div>
    </div>}
  </section>;
};
