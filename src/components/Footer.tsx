import React from 'react';
import {ArrowUp,Mail,MapPin,Phone,MessageCircle,Instagram,Linkedin,Youtube,ArrowRight,Globe2,Facebook} from 'lucide-react';
import {useSiteData} from '../context/SiteContext';
import {BilarLogo} from './BilarLogo';
import {useLanguage} from '../context/LanguageContext';
import {LANGUAGE_OPTIONS} from '../i18n';

const parseLinks=(raw?:string)=>String(raw||'').split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const [label,...rest]=x.split('|');return {label:label.trim(),url:rest.join('|').trim()||'#'}});
const TikTokIcon=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.2 3c.3 2.2 1.5 3.6 3.8 3.8v3.1c-1.4 0-2.7-.4-3.8-1.1v6.1c0 3.2-2.5 5.1-5.2 5.1A5.2 5.2 0 1 1 11.8 15v3.2a2.2 2.2 0 1 0 2.4-2.2V3h0Z"/></svg>;
const XIcon=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 4h4.1l3.2 4.5L16.4 4h2.4l-5.2 6.2L19.3 20h-4.1l-3.6-5-4.2 5H5l5.5-6.7L5.2 4Zm3.1 2 7.9 11.9h.9L9.2 6h-.9Z"/></svg>;

export const Footer:React.FC<{onSuccessToast?:(m:string)=>void;onOpenLegal?:(type:'privacy'|'terms'|'cookies')=>void}>=({onOpenLegal})=>{
  const {companyInfo,services}=useSiteData();
  const {tr,language,setLanguage}=useLanguage();
  const cleanPhone=companyInfo.phone.replace(/\s/g,'');
  const year=new Date().getFullYear();
  const footerDescription=companyInfo.footerDescription||'Tecnologia com propósito para criar experiências digitais claras, úteis e preparadas para crescer.';
  const ctaText=companyInfo.footerCtaText||'Fale connosco';
  const ctaUrl=companyInfo.footerCtaUrl||companyInfo.whatsappUrl||'#contacto';
  const extraLinks=parseLinks(companyInfo.footerNavLinks);
  const visibleServices=services.filter(s=>s.active!==false).sort((a,b)=>(a.order??0)-(b.order??0)).slice(0,5);
  return <footer className="site-footer">
    <div className="footer-brandbar">
      <div className="footer-brandbar-inner">
        <p>{footerDescription}</p>
        <div className="footer-social" aria-label="Redes sociais">
          {companyInfo.whatsappUrl?<a href={companyInfo.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a>:<span className="footer-social-placeholder" title="WhatsApp"><MessageCircle/></span>}
          {companyInfo.facebook?<a href={companyInfo.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook/></a>:<span className="footer-social-placeholder" title="Facebook"><Facebook/></span>}
          {companyInfo.instagram?<a href={companyInfo.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a>:<span className="footer-social-placeholder" title="Instagram"><Instagram/></span>}
          {companyInfo.linkedin?<a href={companyInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a>:<span className="footer-social-placeholder" title="LinkedIn"><Linkedin/></span>}
          {companyInfo.youtube?<a href={companyInfo.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube/></a>:<span className="footer-social-placeholder" title="YouTube"><Youtube/></span>}
          {companyInfo.tiktok?<a href={companyInfo.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon/></a>:<span className="footer-social-placeholder" title="TikTok"><TikTokIcon/></span>}
          {companyInfo.x?<a href={companyInfo.x} target="_blank" rel="noreferrer" aria-label="X"><XIcon/></a>:<span className="footer-social-placeholder" title="X"><XIcon/></span>}
        </div>
      </div>
    </div>

    <div className="footer-bluearea">
      <div className="footer-bluearea-inner">
        <div className="footer-column footer-company-links">
          <h4>{tr('company')}</h4>
          <a href="#sobre">{tr('company')}</a>
          <a href="#equipa">{tr('team')}</a>
          <a href="#projetos">{tr('projects')}</a>
          <a href="#blog">{tr('insights')}</a>
        </div>
        <div className="footer-column">
          <h4>{tr('home')}</h4>
          <a href="#inicio">{tr('home')}</a>
          <a href="#servicos">{tr('services')}</a>
          <a href="#contacto-empresa">{tr('contact')}</a>
          {extraLinks.map((l,i)=><a key={i} href={l.url}>{l.label}</a>)}
        </div>
        <div className="footer-column">
          <h4>{tr('services')}</h4>
          {visibleServices.map(s=><a key={s.id} href="#servicos">{s.title}</a>)}
        </div>
        <div className="footer-column footer-contact-clean">
          <h4>{tr('talk')}</h4>
          {companyInfo.email&&<a href={`mailto:${companyInfo.email}`}><Mail/> {companyInfo.email}</a>}{companyInfo.secondaryEmail&&<a href={`mailto:${companyInfo.secondaryEmail}`}><Mail/> {companyInfo.secondaryEmail}</a>}
          {companyInfo.phone&&<a href={`tel:${cleanPhone}`}><Phone/> {companyInfo.phone}</a>}
          {companyInfo.location&&<span><MapPin/> {companyInfo.location}</span>}
          <a className="footer-whatsapp" href={ctaUrl} target={/^https?:\/\//.test(ctaUrl)?'_blank':undefined} rel={/^https?:\/\//.test(ctaUrl)?'noreferrer':undefined}>{ctaText} <ArrowRight size={15}/></a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-bottom-brand"><BilarLogo size="sm" theme="dark"/></div>
      <div className="footer-language-switcher" aria-label="Idioma do site"><Globe2 size={13}/>{LANGUAGE_OPTIONS.map(([id,label,code])=><button key={id} className={language===id?'active':''} onClick={()=>setLanguage(id)} title={label}>{code}</button>)}</div>
      <span>© {year} Bilar DigitalTech Solutions. All rights reserved.</span>
      <div><button type="button" onClick={()=>onOpenLegal?.('privacy')}>Privacidade</button><button type="button" onClick={()=>onOpenLegal?.('terms')}>Termos</button><button type="button" onClick={()=>onOpenLegal?.('cookies')}>Cookies</button><a href="#inicio" className="back-top"><ArrowUp/> Voltar ao topo</a></div>
    </div>
  </footer>
}
