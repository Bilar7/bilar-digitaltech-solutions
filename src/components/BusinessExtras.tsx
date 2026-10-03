import React from 'react';
import { ArrowRight, ArrowUpRight, FlaskConical, Handshake, Users, Globe2, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

export const BusinessExtras: React.FC<{onOpenQuote:()=>void}> = ({ onOpenQuote }) => {
  const { labProjects, careerOpenings, partners } = useSiteData();
  const { tr } = useLanguage();
  const openCareers = careerOpenings.filter(x => x.status === 'open');
  const activePartners = partners.filter(x => x.active !== false);

  return <div className="bilar-extras">
    <section id="labs" className="bilar-business-section bilar-labs-section">
      <div className="bilar-business-container">
        <div className="bilar-section-heading split">
          <div><span>{tr('labs')}</span><h2>{tr('labsTitle')}</h2></div>
          <p>{tr('labsText')} Trabalhamos com pesquisa, prototipagem e testes antes de transformar uma ideia num produto pronto para utilização.</p>
        </div>
        <div className="bilar-labs-grid compact">
          <div className="bilar-lab-feature premium-dark-card">
            <div className="labs-feature-icon"><FlaskConical size={22}/></div>
            <div className="labs-feature-badge">PRODUTOS EM DESENVOLVIMENTO</div>
            <h3>Da ideia ao produto que pode ser usado.</h3>
            <p>{labProjects.length ? `${labProjects.length} projecto(s) em desenvolvimento no Bilar Labs.` : 'Ideias, pesquisa, protótipos e testes acompanhados pela equipa Bilar Labs.'}</p>
            <div className="bilar-lab-flow"><span>Ideia</span><span>Pesquisa</span><span>Protótipo</span><span>Testes</span><span>Produto</span></div>
          </div>
          <div className="bilar-lab-list premium-dark-list">
            {labProjects.slice(0,4).map(p=><div key={p.id}><FlaskConical size={16}/><div><strong>{p.title}</strong><small>{p.status}</small></div>{p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${p.title}`}><ArrowUpRight size={15}/></a>}</div>)}
            {!labProjects.length && <div><FlaskConical size={16}/><div><strong>Projectos de inovação</strong><small>Geridos pela equipa Bilar Labs</small></div></div>}
          </div>
        </div>
      </div>
    </section>

    <section id="carreiras" className="bilar-business-section bilar-careers-section">
      <div className="bilar-business-container">
        <div className="bilar-careers-card premium-light-card">
          <Users size={25}/>
          <div><span>{tr('team')}</span><h2>{tr('careersTitle')}</h2><p>{tr('careersText')}</p></div>
          <button onClick={onOpenQuote}>{tr('talk')} <ArrowRight size={15}/></button>
        </div>
        {openCareers.length>0&&<div className="bilar-career-list">{openCareers.slice(0,3).map(x=><article key={x.id}><strong>{x.title}</strong><small>{x.department} · {x.location} · {x.type}</small><p>{x.description}</p></article>)}</div>}
      </div>
    </section>

    <section id="parceiros" className="bilar-business-section bilar-partners-section">
      <div className="bilar-business-container partners-premium-wrap">
        <div className="partners-premium-intro">
          <div><div className="eyebrow"><span />{tr('company')}</div><h2>{tr('partnersTitle')}</h2><p>{tr('partnersText')}</p></div>
          <div className="partners-premium-icon"><Handshake size={28}/><Globe2 size={17}/></div>
        </div>
        {activePartners.length ? <div className="bilar-partner-grid premium-partners-grid">{activePartners.slice(0,8).map(x=><a key={x.id} href={x.url||'#'} target={x.url?'_blank':undefined} rel={x.url?'noreferrer':undefined} className="premium-partner-card"><div>{x.logo?<img src={x.logo} alt={x.name}/>:<Handshake size={23}/>}</div><strong>{x.name}</strong><small>{x.category}{x.country?' · '+x.country:''}</small>{x.url&&<span className="partner-open"><ExternalLink size={13}/></span>}</a>)}</div> : <div className="partners-empty-premium"><div><Handshake size={28}/></div><section><strong>Vamos construir em conjunto.</strong><span>Parcerias tecnológicas, comerciais e institucionais para ampliar o alcance da Bilar.</span></section><button onClick={onOpenQuote}>Falar sobre parceria <ArrowRight size={15}/></button></div>}
      </div>
    </section>

    <section id="contacto-empresa" className="bilar-business-section bilar-contact-section">
      <div className="bilar-business-container bilar-contact-card premium-contact-card">
        <div><span>{tr('contact')}</span><h2>{tr('contactTitle')}</h2><p>{tr('contactText')}</p></div>
        <button onClick={onOpenQuote}>{tr('quote')} <ArrowRight size={16}/></button>
      </div>
    </section>
  </div>;
};
