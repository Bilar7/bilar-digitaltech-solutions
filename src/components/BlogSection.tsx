import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Calendar,
  Heart,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { BlogPost } from '../types';
import { BlogModal } from './BlogModal';

interface BlogSectionProps {
  onOpenQuote: (serviceTitle?: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenQuote, onSuccessToast }) => {
  const { blogPosts } = useSiteData();
  const { tr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = [
    'Todos',
    'Tecnologia & IA',
    'Gestão & Negócios',
    'Transformação Digital',
    'História Bilar',
  ];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      if (post.status && post.status !== 'published') return false;
      const matchesCategory =
        selectedCategory === 'Todos' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  return (
    <section id="blog" className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] tracking-wider uppercase">
              <span className="w-5 h-0.5 bg-[#059669] rounded-full" />
              <span>{tr('insights')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Insights Tecnológicos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Conheça ideias, análises e experiências da Bilar sobre inteligência artificial, IoT, sistemas embebidos, gestão empresarial, inovação tecnológica e transformação digital em Moçambique.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={tr('search')+'...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="blog-category-filters flex flex-wrap items-center gap-2 pt-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Categorias:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`blog-category-button px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#10b981] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-base font-bold text-slate-700">Ainda não há artigos publicados</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              A área de Insights está preparada para receber conteúdos reais da Bilar. Quando um artigo for publicado na Gestão, aparecerá aqui.
            </p>
            
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePost(post)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Post Cover Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-800 font-bold text-xs shadow-sm">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Post Content Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#059669] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Author & Read CTA */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">
                        {post.author.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {post.author.role}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#10b981] group-hover:translate-x-1 transition-transform">
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Banner inside Blog */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-black flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Deseja publicar uma ideia ou precisa de uma solução digital personalizada?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              A nossa equipa liderada por George Fernando Bilar e Bilar Fernando Bilar está pronta para transformar os seus requisitos em código de excelência.
            </p>
          </div>

          <button
            onClick={() => onOpenQuote('Consultoria Geral a partir do Blog')}
            className="px-6 py-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            Fale com a Nossa Direção
          </button>
        </div>
      </div>

      {/* Blog Full Reader Modal */}
      <BlogModal
        post={activePost}
        isOpen={Boolean(activePost)}
        onClose={() => setActivePost(null)}
        onOpenQuote={onOpenQuote}
        onSuccessToast={onSuccessToast}
      />
    </section>
  );
};
