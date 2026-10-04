import React, { useEffect, useMemo, useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { BilarProduct, Project } from '../types';
import { ContentResources } from './ContentResources';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Trophy, Users, Star, ShieldCheck, Send, X, ExternalLink } from 'lucide-react';

interface ProjectsAndAboutSectionProps {
  onOpenAboutModal: () => void;
  onOpenQuoteModal: () => void;
}

type PublicProject = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  client: string;
  promotion?: string;
  metrics?: string;
  link?: string;
  extras?: Project['extras'];
};

export const ProjectsAndAboutSection: React.FC<ProjectsAndAboutSectionProps> = ({ onOpenAboutModal, onOpenQuoteModal }) => {
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<BilarProduct | null>(null);
  const [projectPage, setProjectPage] = useState(0);
  const { projects: managedProjects, companyInfo, bilarProducts } = useSiteData();
  const projects: PublicProject[] = managedProjects.filter(p => !p.status || p.status === 'published').map(p => ({
    id:p.id,
    title:p.title,
    category:p.subtitle || p.category,
    image:p.image || '/products/agro-sentinela.svg',
    description:p.description,
    technologies:p.technologies,
    client:p.client,
    promotion:p.promotion,
    metrics:p.metrics,
    link:p.link,
    extras:{...(p.extras||{}), gallery:p.gallery?.length?p.gallery:p.extras?.gallery}
  }));
  const products = bilarProducts.filter(p => p.active !== false && p.featured !== false);
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(projects.length / pageSize));
  const visibleProjects = useMemo(() => projects.slice(projectPage * pageSize, projectPage * pageSize + pageSize), [projects, projectPage]);

  useEffect(() => {
    if (projectPage > pageCount - 1) setProjectPage(Math.max(0, pageCount - 1));
  }, [pageCount, projectPage]);

  useEffect(() => {
    const isOpen = Boolean(selectedProject || selectedProduct);
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedProject, selectedProduct]);

  const statusLabel = (status: BilarProduct['status']) => status === 'available' ? 'Em funcionamento' : status === 'research' ? 'Pesquisa' : status === 'prototype' ? 'Protótipo' : status === 'testing' ? 'Testes' : 'Em breve';

  return <div className="space-y-0 bg-white">
    <section id="sobre" className="about-modern-section">
      <div className="about-modern-shell">
        <div className="about-modern-visual">
          <img src={companyInfo.aboutImage || '/bilar_hero_bilar_office.webp'} alt="Bilar DigitalTech Solutions — empresa e ambiente de trabalho" loading="lazy" decoding="async" />
          <div className="about-modern-badge"><Trophy className="w-4 h-4" /><span>{companyInfo.location || 'Moçambique'}</span><small>Base de operação</small></div>
        </div>
        <div className="about-modern-copy">
          <div className="eyebrow"><span />SOBRE NÓS</div>
          <h2>{companyInfo.aboutTitle || 'Uma empresa tecnológica criada para resolver problemas reais.'}</h2>
          <p>{companyInfo.aboutDescription || 'A Bilar DigitalTech Solutions desenvolve software, produtos digitais e soluções tecnológicas com foco em utilidade, clareza e crescimento.'}</p>
          <div className="about-modern-actions"><button onClick={onOpenAboutModal} className="primary">Conhecer a Bilar <ArrowUpRight className="w-4 h-4" /></button><button onClick={onOpenQuoteModal} className="secondary">Falar connosco</button></div>
        </div>
        <div className="about-modern-stats">
          {[
            { icon: Users, value: companyInfo.stats?.[0]?.value || '0', label: companyInfo.stats?.[0]?.label || 'Projectos publicados' },
            { icon: Star, value: companyInfo.stats?.[1]?.value || '0', label: companyInfo.stats?.[1]?.label || 'Produtos Bilar' },
            { icon: ShieldCheck, value: companyInfo.stats?.[2]?.value || '0', label: companyInfo.stats?.[2]?.label || 'Pessoas na equipa' },
          ].map(({icon:Icon,value,label}) => <div key={label} className="about-stat"><div className="about-stat-icon"><Icon className="w-4 h-4" /></div><strong>{value}</strong><span>{label}</span></div>)}
        </div>
        <div className="about-modern-quote"><span>“</span><p>{companyInfo.aboutQuote || 'Ideias claras. Tecnologia útil. Resultados preparados para crescer.'}</p><strong>Bilar DigitalTech Solutions</strong></div>
      </div>
    </section>

    {products.length > 0 && <section id="bilar-products" className="products-modern-section">
      <div className="products-modern-shell">
        <div className="section-heading-with-meta">
          <div><div className="eyebrow"><span />BILAR PRODUCTS</div><h2>Soluções próprias da Bilar, concebidas para resolver necessidades reais e prontas para utilização.</h2><p>Conheça as soluções que a Bilar está a desenvolver para empresas, organizações e diferentes mercados.</p></div>
          <div className="section-meta-pill"><span />Conteúdo gerido pela Bilar</div>
        </div>
        <div className="products-modern-grid">
          {products.map(product => <article key={product.id} className="product-modern-card">
            <div className="product-modern-image"><img src={product.image || '/bilar_hero_bilar_office.webp'} alt={product.name} loading="lazy" decoding="async" /><div className="product-status-pill">{statusLabel(product.status)}</div></div>
            <div className="product-modern-body">
              <div className="product-category">{product.category}</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-purpose"><span>Benefício</span><strong>{product.benefits?.[0] || product.promotion || 'Solução tecnológica Bilar'}</strong></div>
              <div className="product-modern-bottom"><span>{product.price || 'Sob consulta'}</span><div className="product-modern-actions">{product.status === 'available' && product.appUrl && <a className="product-app-link" href={product.appUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />Ver aplicação</a>}<button className="product-details-link" onClick={() => setSelectedProduct(product)}>Saber mais <ArrowUpRight className="w-4 h-4" /></button></div></div>
            </div>
          </article>)}
        </div>
      </div>
    </section>}

    <section id="projetos" className="projects-modern-section">
      <div className="projects-modern-shell">
        <div className="projects-heading-row">
          <div><div className="eyebrow"><span />PROJETOS EM DESTAQUE</div><h2>Nossos Trabalhos</h2><p>Veja soluções, produtos e projectos que mostram como a Bilar transforma desafios em experiências digitais claras, úteis e pensadas para gerar resultados.</p></div>
          <div className="projects-heading-actions"><button onClick={() => setProjectPage(Math.max(projectPage - 1, 0))} disabled={projectPage === 0} aria-label="Projetos anteriores" className="project-nav-button"><ChevronLeft className="w-5 h-5" /></button><span>{pageCount > 1 ? `${projectPage + 1} / ${pageCount}` : 'Portfólio'}</span><button onClick={() => setProjectPage(Math.min(projectPage + 1, pageCount - 1))} disabled={projectPage >= pageCount - 1} aria-label="Próximos projetos" className="project-nav-button accent"><ChevronRight className="w-5 h-5" /></button></div>
        </div>

        {visibleProjects.length > 0 ? <div className="projects-modern-grid">
          {visibleProjects.map(project => <article key={project.id} className="project-modern-card">
            <div className="project-modern-media"><img src={project.image} alt={project.title} loading="lazy" decoding="async" /><div className="project-modern-overlay" /><span className="project-modern-category">{project.category}</span></div>
            <div className="project-modern-body"><div className="project-modern-title-row"><div><h3>{project.title}</h3><p>{project.description}</p></div><button onClick={() => setSelectedProject(project)} aria-label={`Ver ${project.title}`} className="project-open-icon"><ArrowUpRight className="w-4 h-4" /></button></div>
              {project.technologies?.length > 0 && <div className="project-tech-row">{project.technologies.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>}
              <div className="project-modern-actions"><button onClick={() => setSelectedProject(project)} className="project-details-button">Ver projecto <ArrowRight className="w-4 h-4" /></button>{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="project-link-button"><ExternalLink className="w-4 h-4" />Abrir aplicação</a>}</div>
            </div>
          </article>)}
        </div> : <div className="empty-portfolio-state"><strong>Em breve</strong><span>Novos projectos publicados pela Bilar serão apresentados aqui.</span></div>}
      </div>
    </section>

    {selectedProduct && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
      <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
        <button onClick={() => setSelectedProduct(null)} aria-label="Fechar produto" className="modal-close-button"><X className="w-5 h-5" /></button>
        <div className="product-detail-media"><img src={selectedProduct.image || '/bilar_hero_bilar_office.webp'} alt={selectedProduct.name} /><div className="product-detail-media-overlay" /><div><span>BILAR PRODUCT · {selectedProduct.category}</span><h3>{selectedProduct.name}</h3></div></div>
        <div className="product-detail-body"><div className="product-detail-lead">{selectedProduct.promotion || selectedProduct.description}</div><p>{selectedProduct.description}</p><div className="product-detail-info-grid"><div><small>Público</small><strong>{selectedProduct.audience || 'Empresas e utilizadores'}</strong></div><div><small>Modelo</small><strong>{selectedProduct.price || 'Sob consulta'}</strong></div></div><ContentResources extras={selectedProduct.extras} onRequestDemo={onOpenQuoteModal} /><div className="product-detail-links">{selectedProduct.appUrl && <a className="primary" href={selectedProduct.appUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setSelectedProduct(null)}>Abrir aplicação <ExternalLink className="w-4 h-4" /></a>}{!selectedProduct.appUrl && selectedProduct.websiteUrl && <a className="primary" href={selectedProduct.websiteUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setSelectedProduct(null)}>Abrir página <ExternalLink className="w-4 h-4" /></a>}{selectedProduct.documentationUrl && <a href={selectedProduct.documentationUrl} target="_blank" rel="noopener noreferrer">Documentação</a>}{selectedProduct.supportUrl && <a href={selectedProduct.supportUrl} target="_blank" rel="noopener noreferrer">Suporte</a>}{!selectedProduct.appUrl && !selectedProduct.websiteUrl && <button className="primary" onClick={()=>{setSelectedProduct(null); onOpenQuoteModal();}}>Quero saber mais <ArrowRight className="w-4 h-4" /></button>}<button onClick={()=>setSelectedProduct(null)}>Fechar</button></div></div>
      </div>
    </div>}

    {selectedProject && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
      <div className="project-detail-modal" onClick={e => e.stopPropagation()}>
        <button onClick={() => setSelectedProject(null)} className="modal-close-button"><X className="w-5 h-5" /></button>
        <div className="project-detail-media"><img src={selectedProject.image} alt={selectedProject.title} /><div className="project-detail-media-overlay" /><span>{selectedProject.category}</span></div>
        <div className="project-detail-body"><div className="project-detail-title-row"><div><h3>{selectedProject.title}</h3><p>{selectedProject.client ? `Cliente: ${selectedProject.client}` : 'Projecto Bilar'}</p></div>{selectedProject.link && <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="project-open-large"><ExternalLink className="w-4 h-4" />Abrir projecto</a>}</div><p className="project-detail-description">{selectedProject.description}</p>{selectedProject.technologies?.length > 0 && <div className="project-detail-tech">{selectedProject.technologies.map(t=><span key={t}>{t}</span>)}</div>}<ContentResources extras={selectedProject.extras} onRequestDemo={onOpenQuoteModal}/><div className="project-detail-footer"><button className="primary" onClick={()=>{setSelectedProject(null);onOpenQuoteModal();}}>Solicitar projecto semelhante <Send className="w-4 h-4" /></button><button className="secondary" onClick={()=>setSelectedProject(null)}>Fechar</button></div></div>
      </div>
    </div>}
  </div>;
};
