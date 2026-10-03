import React, {useState} from 'react';
import {ArrowUpRight, BookOpen, ChevronDown, ChevronUp, Download, ExternalLink, FileText, PlayCircle} from 'lucide-react';
import {ContentAction, ContentExtras} from '../types';

const isYouTube=(u:string)=>/youtube\.com|youtu\.be/.test(u);
const isVimeo=(u:string)=>/vimeo\.com/.test(u);
const embedVideo=(url:string)=>{
  try{
    if(url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split(/[?&]/)[0]}`;
    const m=url.match(/[?&]v=([^&]+)/); if(m) return `https://www.youtube.com/embed/${m[1]}`;
    if(isVimeo(url)){const id=url.split('/').filter(Boolean).pop(); if(id) return `https://player.vimeo.com/video/${id}`;}
  }catch{}
  return url;
};

export function ContentActionButtons({actions=[]}:{actions?:ContentAction[]}){
  if(!actions.length) return null;
  const handle=(a:ContentAction)=>{
    if(a.type==='form' || a.type==='internal' || a.type==='page'){
      if(a.target.startsWith('#')) document.getElementById(a.target.slice(1))?.scrollIntoView({behavior:'smooth'});
      else if(a.target.startsWith('/')) window.location.href=a.target;
      else window.location.href=a.target;
      return;
    }
    if(a.target.startsWith('http')) window.open(a.target,a.newTab===false?'_self':'_blank','noopener,noreferrer');
  };
  return <div className="flex flex-wrap gap-2">{actions.map(a=><button key={a.id} type="button" onClick={()=>handle(a)} className="inline-flex items-center gap-2 rounded-full bg-[#10b981] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#059669] transition-colors"><span>{a.label}</span><ArrowUpRight className="w-3.5 h-3.5"/></button>)}</div>;
}

export function ContentResources({extras, onRequestDemo}:{extras?:ContentExtras;onRequestDemo?:()=>void}){
  const [openTutorial,setOpenTutorial]=useState<number|null>(null);
  if(!extras) return null;
  const hasVideo=Boolean(extras.video?.url);
  const hasTutorial=Boolean(extras.tutorial?.steps?.length);
  const hasDocs=Boolean(extras.documents?.length);
  const hasFaqs=Boolean(extras.faqs?.length);
  const hasGallery=Boolean(extras.gallery?.length);
  const hasRelated=Boolean(extras.related?.length);
  const hasActions=Boolean(extras.actions?.length);
  if(!hasVideo&&!hasTutorial&&!hasDocs&&!hasFaqs&&!hasGallery&&!hasRelated&&!hasActions) return null;

  return <div className="mt-5 space-y-4">
    {hasActions && <ContentActionButtons actions={extras.actions}/>} 
    {onRequestDemo && !hasActions && <button type="button" onClick={onRequestDemo} className="inline-flex items-center gap-2 rounded-full bg-[#10b981] px-4 py-2 text-xs font-extrabold text-white"><PlayCircle className="w-4 h-4"/> Solicitar demonstração</button>}

    {hasVideo && <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3"><PlayCircle className="w-4 h-4 text-[#0757b8]"/><h4 className="text-sm font-extrabold text-slate-900">{extras.video!.title || 'Demonstração'}</h4></div>
      {isYouTube(extras.video!.url)||isVimeo(extras.video!.url) ? <div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe title={extras.video!.title} src={embedVideo(extras.video!.url)} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div> : <video controls preload="metadata" poster={extras.video!.thumbnail} className="w-full max-h-[60vh] rounded-xl bg-black"><source src={extras.video!.url}/></video>}
      {extras.video!.description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{extras.video!.description}</p>}
    </section>}

    {hasGallery && <section className="grid grid-cols-2 sm:grid-cols-3 gap-2">{extras.gallery!.map((url,i)=><img key={`${url}-${i}`} src={url} alt={`Galeria ${i+1}`} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200" onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>)}</section>}

    {hasTutorial && <section className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200"><div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#10b981]"/><h4 className="text-sm font-extrabold text-slate-900">{extras.tutorial!.title || 'Como utilizar'}</h4></div>{extras.tutorial!.description&&<p className="mt-1 text-xs text-slate-600">{extras.tutorial!.description}</p>}</div>
      <div className="divide-y divide-slate-200">{extras.tutorial!.steps.map((step,i)=>{
        const open=openTutorial===i; return <div key={step.id} className="bg-white"><button type="button" onClick={()=>setOpenTutorial(open?null:i)} className="w-full px-4 py-3 flex items-center justify-between text-left"><span className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black flex items-center justify-center">{i+1}</span><span className="text-xs sm:text-sm font-extrabold text-slate-900">{step.title}</span></span>{open?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>{open&&<div className="px-4 pb-4 space-y-3">{step.text&&<p className="text-xs leading-relaxed text-slate-600">{step.text}</p>}{step.image&&<img src={step.image} alt={step.title} className="w-full max-h-64 object-cover rounded-xl"/>}{step.videoUrl&&<div className="aspect-video rounded-xl overflow-hidden bg-black"><iframe title={step.title} src={embedVideo(step.videoUrl)} className="w-full h-full" allowFullScreen/></div>}<div className="flex flex-wrap gap-2">{step.linkUrl&&<a href={step.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><ExternalLink className="w-3.5 h-3.5"/> Link</a>}{step.documentUrl&&<a href={step.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><FileText className="w-3.5 h-3.5"/> Documento</a>}</div></div>}</div>})}</div>
    </section>}

    {hasDocs && <section className="rounded-2xl border border-slate-200 overflow-hidden"><div className="px-4 py-3 bg-slate-50 border-b border-slate-200"><h4 className="text-sm font-extrabold text-slate-900">Documentação</h4></div><div className="divide-y divide-slate-200">{extras.documents!.map(d=><div key={d.id} className="px-4 py-3 flex items-center justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#0757b8]"/><strong className="text-xs sm:text-sm text-slate-900 truncate">{d.name}</strong></div>{d.description&&<p className="text-[11px] text-slate-500 mt-1">{d.description}</p>}</div><div className="flex items-center gap-2 shrink-0"><a href={d.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold">Abrir <ExternalLink className="w-3.5 h-3.5"/></a>{d.download&&<a href={d.url} download className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-3 py-2 text-xs font-bold">Descarregar <Download className="w-3.5 h-3.5"/></a>}</div></div>)}</div></section>}

    {hasFaqs && <section className="rounded-2xl border border-slate-200 overflow-hidden"><div className="px-4 py-3 bg-slate-50 border-b border-slate-200"><h4 className="text-sm font-extrabold text-slate-900">Perguntas frequentes</h4></div>{extras.faqs!.map(item=><details key={item.id} className="group border-b last:border-b-0 border-slate-100"><summary className="cursor-pointer list-none px-4 py-3 text-xs font-extrabold text-slate-900 flex items-center justify-between"><span>{item.question}</span><ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180"/></summary><p className="px-4 pb-4 text-xs leading-relaxed text-slate-600">{item.answer}</p></details>)}</section>}

    {hasRelated && <section><div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 mb-2">Recursos relacionados</div><div className="flex flex-wrap gap-2">{extras.related!.map(r=>r.url?<a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-2 text-xs font-bold">{r.label}<ExternalLink className="w-3.5 h-3.5"/></a>:<span key={r.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold">{r.label}</span>)}</div></section>}
  </div>;
}
