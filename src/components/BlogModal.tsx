import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Heart,
  Share2,
  MessageSquare,
  Send,
  CheckCircle2,
  ArrowRight,
  Tag,
  User,
} from 'lucide-react';
import { BlogPost, BlogComment } from '../types';
import { ContentResources } from './ContentResources';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: (serviceTitle?: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  post,
  isOpen,
  onClose,
  onOpenQuote,
  onSuccessToast,
}) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, BlogComment[]>>({
    'ia-negocios-mocambique': [
      {
        id: 'c1',
        author: 'Armando Cossa',
        date: 'Há 2 dias',
        text: 'Excelente artigo! Já estamos a usar um chatbot da Bilar no nosso retalho e a poupança de tempo foi imediata.',
      },
      {
        id: 'c2',
        author: 'Valéria Nhantumbo',
        date: 'Há 1 dia',
        text: 'A integração com WhatsApp é exatamente o que as PME moçambicanas precisavam.',
      },
    ],
    'erp-moderno-2026': [
      {
        id: 'c3',
        author: 'Manuel Sumbana',
        date: 'Há 3 dias',
        text: 'Muito claro o artigo do Dr. Bilar Fernando Bilar. O controlo de stocks é realmente a dor de cabeça de qualquer distribuidora.',
      },
    ],
    'historia-bilar-digitaltech': [
      {
        id: 'c4',
        author: 'Helena Mondlane',
        date: 'Há 5 dias',
        text: 'Inspirador ver o George Fernando Bilar e o irmão a erguerem esta empresa com tanta qualidade em Moçambique!',
      },
    ],
  });

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !post) return null;

  const currentLikes = likes[post.id] ?? post.likes;
  const userLiked = hasLiked[post.id] ?? false;
  const postComments = comments[post.id] || [];

  const handleToggleLike = () => {
    if (userLiked) {
      setLikes((prev) => ({ ...prev, [post.id]: currentLikes - 1 }));
      setHasLiked((prev) => ({ ...prev, [post.id]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [post.id]: currentLikes + 1 }));
      setHasLiked((prev) => ({ ...prev, [post.id]: true }));
      onSuccessToast('Obrigado pela sua reação ao artigo!');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onSuccessToast('Link do artigo copiado para a área de transferência!');
    } else {
      onSuccessToast('Artigo pronto para partilha!');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    const newComment: BlogComment = {
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      date: 'Agora mesmo',
      text: commentText.trim(),
    };

    setComments((prev) => ({
      ...prev,
      [post.id]: [newComment, ...(prev[post.id] || [])],
    }));

    setCommentAuthor('');
    setCommentText('');
    onSuccessToast('Comentário publicado com sucesso!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              {post.category}
            </span>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Partilhar artigo"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-8">
          {/* Title and Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Author Box */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-slate-100 shrink-0">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{post.author.name}</div>
                  <div className="text-xs text-[#0284c7] font-semibold">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 max-h-80 w-full bg-slate-900">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Formatted Article Paragraphs */}
          <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="text-justify sm:text-left">
                {paragraph}
              </p>
            ))}
          </div>

          <ContentResources extras={post.extras} onRequestDemo={()=>onOpenQuote('Recursos relacionados com o artigo')}/>


          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Like & Interaction Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleLike}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  userLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${userLiked ? 'fill-rose-600' : ''}`} />
                <span>{currentLikes} Gostos</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-600 text-xs sm:text-sm font-medium border border-slate-200">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{postComments.length} Comentários</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQuote(post.title);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
            >
              <span>Implementar na Minha Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Comments Section */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Deixe o seu Comentário</span>
            </h3>

            {/* Form */}
            <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="O seu nome / Empresa"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <textarea
                placeholder="Escreva a sua opinião ou dúvida sobre este artigo..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Comentário</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {postComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{comment.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
