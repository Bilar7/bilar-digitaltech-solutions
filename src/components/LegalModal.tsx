import React from 'react';
import { X, ShieldCheck, FileText, Cookie } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'cookies';

export const LegalModal: React.FC<{type: LegalType; onClose: () => void}> = ({ type, onClose }) => {
  const content = {
    privacy: {
      icon: ShieldCheck,
      label: 'PRIVACIDADE',
      title: 'Política de Privacidade',
      body: 'A Bilar DigitalTech Solutions trata os dados pessoais com responsabilidade e utiliza apenas as informações necessárias para prestar serviços, responder a pedidos de contacto e melhorar a experiência da plataforma. Os dados não devem ser utilizados para finalidades incompatíveis com aquelas comunicadas ao utilizador.',
      points: ['Recolha limitada ao necessário para a finalidade apresentada.', 'Acesso aos dados condicionado às necessidades de operação e gestão.', 'Pedidos relacionados com os seus dados podem ser encaminhados através dos canais oficiais da Bilar.']
    },
    terms: {
      icon: FileText,
      label: 'TERMOS',
      title: 'Termos e Condições',
      body: 'Ao utilizar o site da Bilar DigitalTech Solutions, o utilizador compromete-se a utilizar os conteúdos e funcionalidades de forma legal, responsável e respeitosa. Informações comerciais, serviços e funcionalidades podem ser actualizados pela empresa para acompanhar a evolução da plataforma.',
      points: ['Os conteúdos do site são apresentados para informação e comunicação comercial.', 'Não é permitido utilizar a plataforma para actividades ilícitas ou abusivas.', 'Condições específicas de serviços ou projectos podem ser definidas em propostas ou contratos próprios.']
    },
    cookies: {
      icon: Cookie,
      label: 'COOKIES',
      title: 'Política de Cookies',
      body: 'A plataforma pode utilizar armazenamento local e tecnologias semelhantes necessárias ao funcionamento de determinadas funcionalidades. Caso sejam adicionados serviços de análise, publicidade ou integrações externas que utilizem cookies, esta informação deverá ser actualizada para explicar a finalidade e as opções disponíveis.',
      points: ['Tecnologias essenciais podem ser necessárias para o funcionamento do site.', 'Serviços externos podem ter as suas próprias políticas de privacidade e cookies.', 'A política será revista quando novas tecnologias de rastreamento forem adicionadas.']
    }
  }[type];
  const Icon = content.icon;

  return <div className="legal-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <article className="legal-modal">
      <button className="legal-modal-close" onClick={onClose} aria-label="Fechar"><X size={19}/></button>
      <div className="legal-modal-icon"><Icon size={20}/></div>
      <span className="legal-eyebrow">{content.label}</span>
      <h2 id="legal-modal-title">{content.title}</h2>
      <p>{content.body}</p>
      <div className="legal-modal-points">{content.points.map((point,i)=><div key={i}><span>✓</span><p>{point}</p></div>)}</div>
      <small>Informação institucional da Bilar DigitalTech Solutions. O texto deve ser revisto juridicamente antes de uma publicação comercial definitiva.</small>
    </article>
  </div>;
};
