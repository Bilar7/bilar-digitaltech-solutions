import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (title: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');
  const {services, projects, bilarProducts, blogPosts} = useSiteData();

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        services: services.filter(s=>s.active!==false).slice(0, 4),
        projects: projects.filter(p=>!p.status || p.status==='published').slice(0, 3),
        products: bilarProducts.filter(p=>p.active!==false).slice(0,3),
        posts: blogPosts.filter(p=>p.status==='published').slice(0,3),
      };
    }

    const q = query.toLowerCase();
    const matchedServices = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q))
    );

    const matchedProjects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
    );

    const matchedProducts = bilarProducts.filter(p=>p.active!==false && [p.name,p.category,p.description,p.problem,p.audience].join(' ').toLowerCase().includes(q));
    const matchedPosts = blogPosts.filter(p=>p.status==='published' && [p.title,p.excerpt,p.category,p.author.name,...p.tags].join(' ').toLowerCase().includes(q));
    return {services: matchedServices, projects: matchedProjects, products: matchedProducts, posts: matchedPosts};
  }, [query, services, projects, bilarProducts, blogPosts]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative overflow-hidden space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 pb-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar produtos, serviços, projectos ou artigos..."
            autoFocus
            className="w-full bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-5 pr-1">
          {/* Services Matches */}
          <div>
            <div className="text-[11px] font-bold text-[#059669] uppercase tracking-wider mb-2">
              Serviços da Bilar DigitalTech
            </div>
            {filteredResults.services.length > 0 ? (
              <div className="space-y-1.5">
                {filteredResults.services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => {
                      onSelectService(svc.title);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#059669]">
                        {svc.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {svc.description}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#10b981] group-hover:text-white flex items-center justify-center shrink-0 ml-3 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic p-2">Nenhum serviço correspondente.</div>
            )}
          </div>

          {/* Projects Matches */}
          <div>
            <div className="text-[11px] font-bold text-[#0284c7] uppercase tracking-wider mb-2">
              Projetos Realizados
            </div>
            {filteredResults.projects.length > 0 ? (
              <div className="space-y-1.5">
                {filteredResults.projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      const el = document.getElementById('projetos');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0284c7]">
                        {proj.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {proj.category} • {proj.description}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0284c7] group-hover:text-white flex items-center justify-center shrink-0 ml-3 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic p-2">Nenhum projeto correspondente.</div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Produtos Bilar</div>
            {filteredResults.products.length > 0 ? <div className="space-y-1.5">{filteredResults.products.map((prod:any)=><div key={prod.id} onClick={()=>{document.getElementById('bilar-products')?.scrollIntoView({behavior:'smooth'});onClose();}} className="flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer group"><div><div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">{prod.name}</div><div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{prod.category} • {prod.description}</div></div><ArrowRight className="w-3.5 h-3.5"/></div>)}</div> : <div className="text-xs text-slate-400 italic p-2">Nenhum produto correspondente.</div>}
          </div>

          <div>
            <div className="text-[11px] font-bold text-violet-700 uppercase tracking-wider mb-2">Insights</div>
            {filteredResults.posts.length > 0 ? <div className="space-y-1.5">{filteredResults.posts.map((post:any)=><div key={post.id} onClick={()=>{document.getElementById('blog')?.scrollIntoView({behavior:'smooth'});onClose();}} className="flex items-center justify-between p-3 rounded-2xl hover:bg-violet-50 border border-transparent hover:border-violet-200 transition-all cursor-pointer group"><div><div className="text-sm font-bold text-slate-900 group-hover:text-violet-700">{post.title}</div><div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.category} • {post.excerpt}</div></div><ArrowRight className="w-3.5 h-3.5"/></div>)}</div> : <div className="text-xs text-slate-400 italic p-2">Nenhum artigo correspondente.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
