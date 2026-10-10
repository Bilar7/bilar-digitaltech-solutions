export type ActionType='internal'|'external'|'page'|'video'|'document'|'form';
export interface ContentAction { id:string; label:string; type:ActionType; target:string; newTab?:boolean; }
export interface VideoResource { url:string; title:string; description?:string; thumbnail?:string; }
export interface TutorialStep { id:string; title:string; text:string; image?:string; videoUrl?:string; linkUrl?:string; documentUrl?:string; }
export interface ContentTutorial { title:string; description?:string; steps:TutorialStep[]; }
export interface ContentDocument { id:string; name:string; description?:string; type:string; url:string; download?:boolean; }
export interface FAQItem { id:string; question:string; answer:string; }
export interface RelatedResource { id:string; label:string; url?:string; targetId?:string; }
export interface SEOConfig { title?:string; description?:string; slug?:string; }
export interface ContentExtras { actions?:ContentAction[]; gallery?:string[]; video?:VideoResource; tutorial?:ContentTutorial; documents?:ContentDocument[]; faqs?:FAQItem[]; related?:RelatedResource[]; seo?:SEOConfig; }

export interface Service { id:string; title:string; description:string; fullDescription:string; iconName:string; features:string[]; deliverables:string[]; active?:boolean; order?:number; image?:string; price?:string; extras?:ContentExtras; }
export interface Project { id:string; title:string; category:'Websites'|'Aplicações'|'Sistemas'|'Design'; subtitle:string; description:string; imageType:'gestao'|'shopsmart'|'mobile'|'ai'; metrics?:string; technologies:string[]; client:string; link?:string; image?:string; gallery?:string[]; date?:string; results?:string; promotion?:string; status?:'published'|'draft'|'archived'; featured?:boolean; extras?:ContentExtras; }
export interface Testimonial { id:string; name:string; role:string; company:string; quote:string; rating:number; avatar:string; }
export type TeamHierarchy='leadership'|'management'|'coordination'|'specialist'|'team';
export interface TeamMember { id:string; name:string; role:string; badge?:string; hierarchy?:TeamHierarchy; avatar:string; bio:string; specialty:string; email?:string; phone?:string; linkedin?:string; github?:string; instagram?:string; facebook?:string; x?:string; youtube?:string; website?:string; isLeadership?:boolean; department?:string; skills?:string[]; active?:boolean; order?:number; }
export interface Specialist { id:string; name:string; role:string; area:string; specialization:string; bio:string; avatar:string; skills:string[]; technologies:string[]; linkedin?:string; github?:string; active?:boolean; order?:number; }
export interface BlogPost { id:string; title:string; slug:string; excerpt:string; content:string[]; category:'Tecnologia & IA'|'Gestão & Negócios'|'Transformação Digital'|'História Bilar'; author:{name:string;role:string;avatar:string}; date:string; readTime:string; coverImage:string; tags:string[]; likes:number; commentsCount:number; status?:'published'|'draft'|'archived'; publishedAt?:string; extras?:ContentExtras; }
export interface BlogComment { id:string; author:string; date:string; text:string; }
export interface ContactMessage { id:string; name:string; email:string; phone?:string; company?:string; country?:string; interestType?:string; budget?:string; timeline?:string; message:string; createdAt:string; status:'new'|'read'|'replied'|'archived'; }
export interface MediaAsset { id:string; name:string; url:string; type:'logo'|'team'|'project'|'blog'|'institutional'|'banner'; category?:string; createdAt:string; }
export type AdminRole='Super Admin'|'Admin'|'Editor'|'Team Manager';
export interface AdminUser { id:string; name:string; username:string; email?:string; role:AdminRole; active:boolean; createdAt:string; salary?:number|null; salaryCurrency?:string|null; }
export type ProductStatus='research'|'prototype'|'testing'|'available'|'soon';
export interface BilarProduct { id:string; name:string; category:string; description:string; problem:string; benefits:string[]; features:string[]; audience:string; businessModel:string; price:string; promotion:string; image?:string; status:ProductStatus; featured?:boolean; active?:boolean; websiteUrl?:string; appUrl?:string; supportUrl?:string; documentationUrl?:string; extras?:ContentExtras; }
export interface ProductOperation { productId:string; adminUrl:string; updatedAt:string; }
export interface RevenueStream { id:string; name:string; type:'Serviço'|'Produto'|'Subscrição'|'Manutenção'|'Outro'; model:string; description?:string; active?:boolean; }
export interface CareerOpening { id:string; title:string; department:string; location:string; type:string; description:string; requirements:string[]; status:'open'|'closed'|'draft'; applyEmail?:string; order?:number; }
export interface Partner { id:string; name:string; category:string; country?:string; description?:string; logo?:string; url?:string; active?:boolean; order?:number; }
export interface LabProject { id:string; title:string; description:string; status:'idea'|'research'|'prototype'|'testing'|'ready'; owner:string; collaborators:string[]; repositoryUrl?:string; demoUrl?:string; notes?:string; createdAt:string; updatedAt:string; updatedBy?:string; }
export interface AdminSettings { loginBackground?:string; dashboardBackground?:string; dashboardLayout?:'corporate'|'operations'; accent:'blue-green'|'blue'|'green'; density:'comfortable'|'compact'; welcomeTitle:string; welcomeText:string; showStats:boolean; }
