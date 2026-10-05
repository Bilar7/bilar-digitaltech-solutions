import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {collection,doc,getDoc,getDocs,onSnapshot,setDoc,addDoc,updateDoc,deleteDoc} from 'firebase/firestore';
import {onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut,updateProfile,updatePassword,User,GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {firebaseAuth,firebaseDb,firebaseConfigured,adminBootstrapEmail,createSecondaryAuth} from '../lib/firebase';
import {COMPANY_INFO as DEFAULT_COMPANY_INFO,BLOG_POSTS as DEFAULT_BLOG_POSTS,TEAM_MEMBERS as DEFAULT_TEAM_MEMBERS,PROJECTS as DEFAULT_PROJECTS,SERVICES as DEFAULT_SERVICES} from '../data/content';
import {AdminRole,AdminUser,BlogPost,ContactMessage,MediaAsset,Project,Service,Specialist,TeamMember,BilarProduct,RevenueStream,AdminSettings,LabProject,CareerOpening,Partner,ProductOperation} from '../types';

const ADMIN_BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_LOGIN_BACKGROUND = `${ADMIN_BASE_PATH}admin/bilar_admin_tech_environment.webp`;

export const resolveAssetUrl=(value?:string)=>{
  if (!value) return '';
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('#')) return value;

  const base=import.meta.env.BASE_URL || '/';
  const basePath=base.replace(/^\/+|\/+$/g, '');
  let path=value.replace(/^\/+/, '');

  if(basePath){
    const prefix=`${basePath}/`;
    while(path===basePath || path.startsWith(prefix)){
      path=path===basePath?'':path.slice(prefix.length);
    }
  }

  return `${base}${path}`;
};

export interface CompanyInfo {name:string;shortName:string;tagline:string;badge:string;heroTitle:string;heroImage?:string;heroSubtitle:string;founder:string;founderRole:string;manager:string;managerRole:string;phone:string;whatsappUrl:string;email:string;secondaryEmail:string;location:string;stats:{value:string;label:string;icon:string}[];instagram?:string;linkedin?:string;youtube?:string;facebook?:string;tiktok?:string;x?:string;footerDescription?:string;footerCtaText?:string;footerCtaUrl?:string;footerNavLinks?:string;aboutImage?:string;aboutTitle?:string;aboutDescription?:string;aboutQuote?:string;aboutSignature?:string;}
interface SiteData {companyInfo:CompanyInfo;bilarProducts:BilarProduct[];revenueStreams:RevenueStream[];blogPosts:BlogPost[];teamMembers:TeamMember[];projects:Project[];services:Service[];specialists:Specialist[];contactMessages:ContactMessage[];mediaAssets:MediaAsset[];careerOpenings:CareerOpening[];partners:Partner[];adminSettings:AdminSettings;}
export interface AuthResult {ok:boolean;message?:string;}
interface SiteContextType extends SiteData {currentAdminRole:AdminRole|null;mustChangePassword:boolean;labProjects:LabProject[];productOperations:ProductOperation[];adminUsers:AdminUser[];isAdminAuthenticated:boolean;firebaseReady:boolean;authReady:boolean;loginAdmin:(email:string,password:string)=>Promise<AuthResult>;loginAdminWithGoogle:()=>Promise<AuthResult>;resetAdminPassword:(email:string)=>Promise<AuthResult>;changeFirstPassword:(newPassword:string)=>Promise<AuthResult>;logoutAdmin:()=>void;updateCompanyInfo:(u:Partial<CompanyInfo>)=>Promise<void>;updateAdminSettings:(u:Partial<AdminSettings>)=>Promise<void>;addProduct:(p:Omit<BilarProduct,'id'>,operation?:Pick<ProductOperation,'adminUrl'>)=>Promise<void>;updateProduct:(id:string,p:Partial<BilarProduct>,operation?:Pick<ProductOperation,'adminUrl'>)=>Promise<void>;deleteProduct:(id:string)=>Promise<void>;addRevenueStream:(p:Omit<RevenueStream,'id'>)=>Promise<void>;updateRevenueStream:(id:string,p:Partial<RevenueStream>)=>Promise<void>;deleteRevenueStream:(id:string)=>Promise<void>;addBlogPost:(p:Omit<BlogPost,'id'>)=>Promise<void>;updateBlogPost:(id:string,p:Partial<BlogPost>)=>Promise<void>;deleteBlogPost:(id:string)=>Promise<void>;addTeamMember:(p:Omit<TeamMember,'id'>)=>Promise<void>;updateTeamMember:(id:string,p:Partial<TeamMember>)=>Promise<void>;deleteTeamMember:(id:string)=>Promise<void>;addService:(p:Omit<Service,'id'>)=>Promise<void>;updateService:(id:string,p:Partial<Service>)=>Promise<void>;deleteService:(id:string)=>Promise<void>;addProject:(p:Omit<Project,'id'>)=>Promise<void>;updateProject:(id:string,p:Partial<Project>)=>Promise<void>;deleteProject:(id:string)=>Promise<void>;addSpecialist:(p:Omit<Specialist,'id'>)=>Promise<void>;updateSpecialist:(id:string,p:Partial<Specialist>)=>Promise<void>;deleteSpecialist:(id:string)=>Promise<void>;addContactMessage:(p:Omit<ContactMessage,'id'|'createdAt'|'status'>)=>Promise<void>;updateContactStatus:(id:string,status:ContactMessage['status'])=>Promise<void>;deleteContactMessage:(id:string)=>Promise<void>;addMedia:(p:Omit<MediaAsset,'id'|'createdAt'>)=>Promise<void>;deleteMedia:(id:string)=>Promise<void>;updateAdminUser:(id:string,p:Partial<AdminUser>)=>Promise<void>;deleteAdminUser:(id:string)=>Promise<void>;createAdminAccess:(name:string,email:string,role:AdminRole)=>Promise<{email:string;role:AdminRole;inviteUrl:string;tempPassword:string}>;resendAdminCredentials:(uid:string)=>Promise<{email:string;role:AdminRole;inviteUrl:string;tempPassword:string}>;addLabProject:(p:Omit<LabProject,'id'|'createdAt'|'updatedAt'>)=>Promise<void>;updateLabProject:(id:string,p:Partial<LabProject>)=>Promise<void>;deleteLabProject:(id:string)=>Promise<void>;addCareerOpening:(p:Omit<CareerOpening,'id'>)=>Promise<void>;updateCareerOpening:(id:string,p:Partial<CareerOpening>)=>Promise<void>;deleteCareerOpening:(id:string)=>Promise<void>;addPartner:(p:Omit<Partner,'id'>)=>Promise<void>;updatePartner:(id:string,p:Partial<Partner>)=>Promise<void>;deletePartner:(id:string)=>Promise<void>;exportBackupJson:()=>void;importBackupJson:(s:string)=>Promise<boolean>;resetAllToDefaults:()=>Promise<void>;}
const Ctx=createContext<SiteContextType|undefined>(undefined);
const normalizeAssetTree=(input:any):any=>{
  if (!input || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(normalizeAssetTree);

  const next:Record<string, any> = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === 'string' && /\.(png|jpe?g|webp|svg|gif|avif|ico)(\?.*)?$/i.test(value) && !value.startsWith('data:')) {
      next[key] = resolveAssetUrl(value);
      return;
    }
    if (typeof value === 'string' && /\.(png|jpe?g|webp|svg|gif|avif|ico)(\?.*)?$/i.test(value) && value.startsWith('data:')) {
      next[key] = value;
      return;
    }
    if (typeof value === 'string' && /\.(png|jpe?g|webp|svg|gif|avif|ico)(\?.*)?$/i.test(value) === false && (key === 'image' || key === 'avatar' || key === 'coverImage' || key === 'logo' || key === 'url')) {
      next[key] = resolveAssetUrl(value);
      return;
    }
    next[key] = normalizeAssetTree(value);
  });
  return next;
};
const defaults:SiteData={
  companyInfo:{...DEFAULT_COMPANY_INFO},
  bilarProducts:[
    {id:'prod-agro-sentinela',name:'Agro-Sentinela',category:'Agricultura inteligente',description:'Produto tecnológico da Bilar para monitorização, automação, alertas e apoio à decisão na agricultura.',problem:'Apoiar produtores no acompanhamento das condições da produção e reduzir tarefas manuais.',benefits:['Monitorização','Automação','Alertas','Dados para decisão'],features:['Sensores','Automação','IA','Aplicação e plataforma web'],audience:'Produtores e explorações agrícolas',businessModel:'Venda, instalação e subscrição',price:'Sob consulta',promotion:'Tecnologia inteligente para produzir melhor.',image:'/products/agro-sentinela.svg',websiteUrl:'',appUrl:'',supportUrl:'',documentationUrl:'',status:'prototype',featured:true,active:true},
    {id:'prod-smart-poultry',name:'Bilar Smart Poultry',category:'Avicultura inteligente',description:'Produto Bilar orientado para monitorização e optimização das condições de funcionamento de aviários.',problem:'Acompanhar temperatura, humidade, ventilação, energia e outros indicadores relevantes.',benefits:['Monitorização ambiental','Alertas','Ventilação','Histórico'],features:['Temperatura e humidade','Ventilação','Energia','Água e alimentação'],audience:'Produtores avícolas',businessModel:'Equipamento + instalação + plataforma + manutenção',price:'Sob consulta',promotion:'Mais controlo no aviário. Mais segurança para a produção.',image:'/products/smart-poultry.svg',websiteUrl:'',appUrl:'',supportUrl:'',documentationUrl:'',status:'research',featured:true,active:true},
    {id:'prod-bilar-move',name:'Bilar Move',category:'Mobilidade e serviços digitais',description:'Solução digital da Bilar orientada para serviços de mobilidade e gestão através de uma experiência digital.',problem:'Centralizar operações e facilitar a utilização de serviços de mobilidade através de tecnologia.',benefits:['Experiência digital','Gestão centralizada','Acesso móvel','Escalabilidade'],features:['Aplicação digital','Gestão de operações','Dados e estados','Integração com serviços'],audience:'Utilizadores e operadores de serviços de mobilidade',businessModel:'Plataforma e serviços digitais',price:'Sob consulta',promotion:'Mobilidade apoiada por tecnologia.',image:'/products/bilar-move.svg',websiteUrl:'',appUrl:'',supportUrl:'',documentationUrl:'',status:'prototype',featured:true,active:true}
  ],
  revenueStreams:[
    {id:'revenue-software',name:'Desenvolvimento de software',type:'Serviço',model:'Projecto sob proposta',description:'Desenvolvimento de websites, aplicações e sistemas personalizados.',active:true},
    {id:'revenue-products',name:'Produtos tecnológicos próprios',type:'Produto',model:'Venda + instalação + suporte',description:'Produtos Bilar com componentes tecnológicos, instalação e acompanhamento.',active:true},
    {id:'revenue-support',name:'Manutenção e suporte',type:'Manutenção',model:'Contrato de suporte',description:'Acompanhamento técnico, manutenção e evolução das soluções entregues.',active:true},
    {id:'revenue-consulting',name:'Consultoria tecnológica',type:'Serviço',model:'Serviço sob proposta',description:'Apoio na definição de soluções, arquitectura, processos e prioridades tecnológicas.',active:true}
  ],
  blogPosts:DEFAULT_BLOG_POSTS,
  teamMembers:DEFAULT_TEAM_MEMBERS,
  projects:[
    ...DEFAULT_PROJECTS,
    {id:'bilar-digitaltech-platform',title:'Bilar DigitalTech Solutions — Plataforma Institucional',category:'Websites',subtitle:'Presença digital e plataforma de gestão da Bilar',description:'A própria plataforma institucional da Bilar, com site público e área de gestão para conteúdo, projectos, produtos, equipa, insights e contactos.',imageType:'gestao',metrics:'Em produção',promotion:'A plataforma que apresenta e gere o ecossistema digital da Bilar.',technologies:['React','Vite','TypeScript','Firebase','Firestore'],client:'Bilar DigitalTech Solutions',image:'/bilar_hero_bilar_office.webp',status:'published',featured:true}
  ],
  services:DEFAULT_SERVICES,
  specialists:[],
  contactMessages:[],
  careerOpenings:[{id:'career-software',title:'Software Engineer',department:'Tecnologia',location:'Moçambique / Remoto',type:'Candidatura aberta',description:'Vaga preparada para futuras necessidades da equipa de desenvolvimento.',requirements:['TypeScript / JavaScript','Git','Boa capacidade de aprendizagem'],status:'draft',order:1}],
  partners:[],
  mediaAssets:[
    {id:'media-hero',name:'Imagem principal Bilar',url:'/bilar_hero_bilar_office.webp',type:'banner',createdAt:'Conteúdo institucional'},
    {id:'media-ceo',name:'George Fernando Bilar',url:'/bilar_ceo_profile_final.webp',type:'team',createdAt:'Conteúdo institucional'},
    {id:'media-manager',name:'Bilar Fernando Bilar',url:'/bilar_manager_profile_final.webp',type:'team',createdAt:'Conteúdo institucional'},
    {id:'media-agro',name:'Agro-Sentinela',url:'/products/agro-sentinela.svg',type:'project',createdAt:'Produto Bilar'},
    {id:'media-poultry',name:'Bilar Smart Poultry',url:'/products/smart-poultry.svg',type:'project',createdAt:'Produto Bilar'}
  ],
  adminSettings:{loginBackground:DEFAULT_LOGIN_BACKGROUND,dashboardBackground:'',dashboardLayout:'corporate',accent:'blue-green',density:'comfortable',welcomeTitle:'Centro de Gestão Bilar',welcomeText:'Gira o conteúdo público, os produtos, os projectos, a equipa e as operações da Bilar.',showStats:true}
};

// Conteúdo editorial inicial para o lançamento público.
defaults.blogPosts=[
  {id:'insight-iot',title:'IoT aplicada a problemas reais',slug:'iot-aplicada-problemas-reais',excerpt:'Como sensores, conectividade e automação podem transformar processos físicos em informação útil para decisão.',content:['A Internet das Coisas permite ligar sensores e equipamentos a sistemas digitais para recolher informação sobre processos físicos.','Na Bilar, a IoT é explorada em soluções como o Agro-Sentinela, com foco em monitorização, alertas e automação.','O objectivo é usar tecnologia quando ela resolve um problema concreto e produz informação útil para quem toma decisões.'],category:'Tecnologia & IA',author:{name:'Bilar DigitalTech Solutions',role:'Tecnologia & Inovação',avatar:'/bilar_ceo_profile_final.webp'},date:'17/09/2026',readTime:'4 min',coverImage:'/products/agro-sentinela.svg',tags:['IoT','Automação','Tecnologia'],likes:0,commentsCount:0,status:'published'},
  {id:'insight-transformacao',title:'Transformação digital começa pelo problema',slug:'transformacao-digital-problema',excerpt:'Digitalizar não é apenas colocar tecnologia num processo: é compreender o problema e desenhar uma solução que possa ser usada.',content:['Uma transformação digital sustentável começa pela compreensão do processo que precisa de ser melhorado.','Depois vêm a arquitectura, a experiência do utilizador, os dados e as ferramentas adequadas.','A tecnologia deve simplificar o trabalho e criar capacidade para a organização crescer.'],category:'Transformação Digital',author:{name:'Bilar DigitalTech Solutions',role:'Transformação Digital',avatar:'/bilar_manager_profile_final.webp'},date:'17/09/2026',readTime:'3 min',coverImage:'/bilar_hero_bilar_office.webp',tags:['Digitalização','Sistemas','Gestão'],likes:0,commentsCount:0,status:'published'},
  {id:'insight-negocios',title:'Tecnologia como ferramenta de gestão',slug:'tecnologia-ferramenta-gestao',excerpt:'Sistemas de informação podem ajudar empresas a organizar dados, operações e decisões num único ambiente.',content:['Uma boa solução tecnológica aproxima a informação de quem precisa dela.','Dashboards, sistemas empresariais e automação podem reduzir tarefas repetitivas e melhorar o acompanhamento das operações.','A escolha da solução deve partir dos objectivos do negócio, dos recursos disponíveis e da realidade de utilização.'],category:'Gestão & Negócios',author:{name:'Bilar DigitalTech Solutions',role:'Gestão & Tecnologia',avatar:'/bilar_manager_profile_final.webp'},date:'17/09/2026',readTime:'3 min',coverImage:'/bilar_hero_bilar_office.webp',tags:['Gestão','Software','Produtividade'],likes:0,commentsCount:0,status:'published'},
  {id:'insight-historia-bilar',title:'Bilar DigitalTech Solutions: tecnologia com propósito',slug:'historia-bilar',excerpt:'A visão da Bilar DigitalTech Solutions: criar soluções digitais claras, úteis e preparadas para crescer.',content:['A Bilar DigitalTech Solutions nasceu com uma visão centrada na tecnologia aplicada a necessidades concretas.','A empresa trabalha na intersecção entre desenvolvimento de software, produtos tecnológicos, IoT e transformação digital.','A assinatura da marca resume essa visão: Ideias que conectam. Soluções que transformam.'],category:'História Bilar',author:{name:'Bilar DigitalTech Solutions',role:'Bilar DigitalTech Solutions',avatar:'/bilar_ceo_profile_final.webp'},date:'17/09/2026',readTime:'3 min',coverImage:'/bilar_hero_bilar_office.webp',tags:['Bilar','Empresa','Tecnologia'],likes:0,commentsCount:0,status:'published'}
];
defaults.companyInfo.aboutImage='/bilar_hero_bilar_office.webp';
defaults.companyInfo.aboutTitle='Inovação que transforma';
defaults.companyInfo.aboutDescription='A Bilar DigitalTech Solutions é uma empresa de inovação e tecnologia que cria produtos, serviços e soluções digitais pensados para resolver problemas concretos e apoiar o crescimento.';
defaults.companyInfo.aboutQuote='Ideias que conectam. Soluções que transformam.';
defaults.companyInfo.aboutSignature='Bilar DigitalTech Solutions';
defaults.companyInfo.footerDescription='Empresa de inovação e tecnologia dedicada a criar produtos, serviços e soluções digitais com valor real.';

const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const ensureAdminProfile=async(currentUser:User)=>{
  if(!firebaseDb||!currentUser.emailVerified||!currentUser.email)return null;
  const email=currentUser.email.trim().toLowerCase();
  const adminRef=doc(firebaseDb,'admins',currentUser.uid);
  let snap=await getDoc(adminRef);
  if(snap.exists())return snap;
  if(email===adminBootstrapEmail){
    try{
      await setDoc(adminRef,{id:currentUser.uid,name:currentUser.displayName||email.split('@')[0]||'Administrador',username:currentUser.email,email:currentUser.email,role:'Super Admin' as AdminRole,active:true,mustChangePassword:false,createdAt:new Date().toISOString()});
    }catch{}
    snap=await getDoc(adminRef);
    return snap.exists()?snap:null;
  }
  return null;
};
const normalizeServices=(savedServices:any):Service[]=>{
  const current:Array<any>=Array.isArray(savedServices)?savedServices:[];
  const allowed=['web','mobile','sistemas','cloud','seguranca','redes','ia','embebidos','iot','design','consultoria'];
  const defaultsById=new Map(DEFAULT_SERVICES.map(service=>[service.id,service]));
  const currentById=new Map(current.map(service=>[service.id,service]));
  return allowed.map(id=>{
    const base:any=defaultsById.get(id);
    const saved:any=currentById.get(id);
    return saved ? {...base,...saved,image:base.image,title:base.title,description:base.description,fullDescription:base.fullDescription,iconName:base.iconName,features:base.features,deliverables:base.deliverables} : {...base};
  });
};

const normalize=(saved:any):SiteData=>{
  const x:any=clone(saved||{});
  const pick=(value:any,fallback:any)=>value===undefined||value===null?clone(fallback):value;
  const companyInfo={...defaults.companyInfo,...(x.companyInfo||{})};
  delete (companyInfo as any).bilarMoveUrl;
  delete (companyInfo as any).bilarMoveAdminUrl;
  return {
    companyInfo:normalizeAssetTree(companyInfo),
    bilarProducts:(pick(x.bilarProducts,defaults.bilarProducts) ?? []).map((product:any)=>{
      const legacyWebsite=product.websiteUrl ?? product.url ?? '';
      const {url:_legacyUrl,adminUrl:_legacyAdminUrl,...cleanProduct}=product;
      return normalizeAssetTree({...cleanProduct,websiteUrl:legacyWebsite,appUrl:product.appUrl ?? '',supportUrl:product.supportUrl ?? '',documentationUrl:product.documentationUrl ?? ''});
    }),
    revenueStreams:normalizeAssetTree(pick(x.revenueStreams,defaults.revenueStreams) ?? []),
    blogPosts:normalizeAssetTree(pick(x.blogPosts,defaults.blogPosts) ?? []),
    teamMembers:normalizeAssetTree(pick(x.teamMembers,defaults.teamMembers) ?? []),
    projects:normalizeAssetTree(pick(x.projects,defaults.projects) ?? []),
    services:normalizeAssetTree(normalizeServices(x.services)),
    specialists:normalizeAssetTree(pick(x.specialists,defaults.specialists) ?? []),
    contactMessages:normalizeAssetTree(pick(x.contactMessages,defaults.contactMessages) ?? []),
    mediaAssets:normalizeAssetTree(pick(x.mediaAssets,defaults.mediaAssets) ?? []),
    careerOpenings:normalizeAssetTree(pick(x.careerOpenings,defaults.careerOpenings) ?? []),
    partners:normalizeAssetTree(pick(x.partners,defaults.partners) ?? []),
    adminSettings:{...defaults.adminSettings,...(x.adminSettings||{}),dashboardLayout:x.adminSettings?.dashboardLayout==='operations'?'operations':'corporate',loginBackground:resolveAssetUrl(x.adminSettings?.loginBackground || defaults.adminSettings.loginBackground)}
  };
};

export const SiteProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [data,setData]=useState<SiteData>(()=>{
   try{const raw=typeof window!=='undefined'?window.localStorage.getItem('bilar_site_cache_v2'):null;if(raw)return normalize(JSON.parse(raw));}catch{}
   return normalize(null);
 });
 const [productOperations,setProductOperations]=useState<ProductOperation[]>([]);
 const [adminUsers,setAdminUsers]=useState<AdminUser[]>([]);
 const [labProjects,setLabProjects]=useState<LabProject[]>([]);
 const [isAdminAuthenticated,setAuth]=useState(false);
 const [authReady,setAuthReady]=useState(!firebaseConfigured);
 const [user,setUser]=useState<User|null>(null);
 const [currentAdminRole,setCurrentAdminRole]=useState<AdminRole|null>(null);
 const [mustChangePassword,setMustChangePassword]=useState(false);
 useEffect(()=>{try{window.localStorage.setItem('bilar_site_cache_v2',JSON.stringify(data));}catch{}},[data]);

 useEffect(()=>{
   if(!firebaseConfigured||!firebaseAuth||!firebaseDb){setAuthReady(true);return;}
   let alive=true;
   const unsubscribe=onAuthStateChanged(firebaseAuth,async(currentUser)=>{
     if(!alive)return;
     setUser(currentUser);
     if(!currentUser){setAuth(false);setCurrentAdminRole(null);setMustChangePassword(false);setProductOperations([]);setAdminUsers([]);setLabProjects([]);setAuthReady(true);return;}
     if(!currentUser.emailVerified){setAuth(false);setCurrentAdminRole(null);setMustChangePassword(false);setProductOperations([]);setAdminUsers([]);setLabProjects([]);setAuthReady(true);return;}
     try{
       let adminSnap=await ensureAdminProfile(currentUser);
       if(!adminSnap) adminSnap=await getDoc(doc(firebaseDb,'admins',currentUser.uid));
       if(!adminSnap.exists() || adminSnap.data().active===false){await signOut(firebaseAuth);setAuth(false);setCurrentAdminRole(null);setMustChangePassword(false);setProductOperations([]);setAdminUsers([]);setLabProjects([]);setAuthReady(true);return;}
       setAuth(true);
       setCurrentAdminRole((adminSnap.data().role||'Editor') as AdminRole);
       setMustChangePassword(adminSnap.data().mustChangePassword===true);
       const siteRef=doc(firebaseDb,'site','main');
       const siteSnap=await getDoc(siteRef);
       if(!siteSnap.exists()) await setDoc(siteRef,clone(defaults));
       else {
         const rawSite:any=siteSnap.data();
         const normalized=normalize(rawSite);
         const legacyCompany=rawSite.companyInfo||{};
         const moveIndex=normalized.bilarProducts.findIndex((product:any)=>product.id==='prod-bilar-move'||product.name==='Bilar Move');
         if(moveIndex>=0 && legacyCompany.bilarMoveUrl && !normalized.bilarProducts[moveIndex].websiteUrl){
           normalized.bilarProducts[moveIndex].websiteUrl=legacyCompany.bilarMoveUrl;
         }
         await setDoc(siteRef,clone(normalized),{merge:true});
         if(moveIndex>=0 && legacyCompany.bilarMoveAdminUrl){
           const moveId=normalized.bilarProducts[moveIndex].id;
           await setDoc(doc(firebaseDb,'productOperations',moveId),{productId:moveId,adminUrl:String(legacyCompany.bilarMoveAdminUrl),updatedAt:new Date().toISOString()},{merge:true});
         }
       }
       const admins=await getDocs(collection(firebaseDb,'admins'));
       setAdminUsers(admins.docs.map(item=>({id:item.id,...item.data()} as AdminUser)));
     }catch{setAuth(false);}
     finally{if(alive)setAuthReady(true);}
   });
 const unsubscribeSite=onSnapshot(doc(firebaseDb,'site','main'),snapshot=>{
     if(snapshot.exists()){
       const next=normalize(snapshot.data());
       setData(next);
     }else if(firebaseConfigured){
       setData(normalize(null));
     }
   },()=>setAuthReady(true));
   return()=>{alive=false;unsubscribe();unsubscribeSite();};
 },[]);

 useEffect(()=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated){setLabProjects([]);return;}
   return onSnapshot(collection(firebaseDb,'labProjects'),snap=>{
     setLabProjects(snap.docs.map(item=>({id:item.id,...item.data()} as LabProject)).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))));
   },()=>setLabProjects([]));
 },[isAdminAuthenticated]);

 useEffect(()=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated){setProductOperations([]);return;}
   return onSnapshot(collection(firebaseDb,'productOperations'),snap=>{
     setProductOperations(snap.docs.map(item=>({productId:item.id,...item.data()} as ProductOperation)));
   },()=>setProductOperations([]));
 },[isAdminAuthenticated]);

 const writeState=async(next:SiteData)=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated)throw new Error('Acesso administrativo não autenticado.');
   const persisted=clone(next); delete persisted.contactMessages;
   await setDoc(doc(firebaseDb,'site','main'),persisted,{merge:true});
   setData(next);
 };
 const persistKey=async(key:keyof SiteData,value:any)=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated)throw new Error('Acesso administrativo não autenticado.');
   await updateDoc(doc(firebaseDb,'site','main'),{[key]:clone(value)});
   setData(current=>({...current,[key]:value}));
 };
 const requireAdmin=()=>{if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated)throw new Error('Acesso administrativo não autenticado.');};
 const update=(key:string,id:string,p:any)=>persistKey(key as keyof SiteData,(data as any)[key].map((x:any)=>x.id===id?{...x,...p}:x));
 const add=(key:string,p:any)=>persistKey(key as keyof SiteData,[...(data as any)[key],{...p,id:`${key}-${Date.now()}`}]);
 const remove=(key:string,id:string)=>persistKey(key as keyof SiteData,(data as any)[key].filter((x:any)=>x.id!==id));

 const friendlyAuthError=(code:string)=>({
   'auth/invalid-credential':'Email ou palavra-passe inválidos.',
   'auth/invalid-email':'Introduza um email válido.',
   'auth/too-many-requests':'Foram feitas demasiadas tentativas. Aguarde alguns minutos e tente novamente.',
   'auth/user-not-found':'Não existe uma conta com esse email.',
   'auth/wrong-password':'Email ou palavra-passe inválidos.',
   'auth/email-already-in-use':'Este email já possui uma conta.',
   'auth/weak-password':'A palavra-passe deve ter pelo menos 8 caracteres.',
   'auth/network-request-failed':'Não foi possível contactar o serviço de autenticação. Verifique a ligação à internet.',
   'auth/operation-not-allowed':'Este método de autenticação ainda não está activado no Firebase.',
   'auth/popup-closed-by-user':'A janela de autenticação foi fechada. Tente novamente.',
   'auth/popup-blocked':'O navegador bloqueou a janela de autenticação. Permita pop-ups para este site.',
   'auth/account-exists-with-different-credential':'Este email já está associado a outro método de autenticação. Entre com o método já registado.',
   'auth/unauthorized-domain':'Este domínio ainda não está autorizado no Firebase Authentication. No Firebase Console, abra Authentication → Settings → Authorized domains e adicione o domínio usado no navegador (por exemplo, 127.0.0.1 e localhost em desenvolvimento).',
   'permission-denied':'O Firebase recusou a gravação. Publique as regras Firestore desta versão e confirme que esta conta é Super Admin.',
   'failed-precondition':'O Firebase indicou uma pré-condição em falta. Confirme se o Firestore está criado e se as regras desta versão foram publicadas.',
   'unavailable':'O Firestore está temporariamente indisponível. Verifique a ligação à internet e tente novamente.',
   'internal':'O Firebase devolveu um erro interno. Abra a consola do navegador para ver o código exacto.',
   'auth/internal-error':'O Firebase devolveu um erro interno durante a criação da conta.',
   'auth/invalid-api-key':'A configuração Web do Firebase não é válida para este projecto.',
   'auth/configuration-not-found':'A configuração do Firebase Authentication não está disponível para este projecto.',
 } as Record<string,string>)[code] || 'Não foi possível concluir a operação. Tente novamente.';

 const loginAdmin=async(email:string,password:string):Promise<AuthResult>=>{
   if(!email.trim()||!password)return {ok:false,message:'Introduza o email e a palavra-passe.'};
   if(!firebaseConfigured||!firebaseAuth||!firebaseDb)return {ok:false,message:'O Firebase ainda não está configurado para esta instalação.'};
   try{
     const cred=await signInWithEmailAndPassword(firebaseAuth,email.trim(),password);
     if(!cred.user.emailVerified){try{await sendEmailVerification(cred.user);}catch(_error){} await signOut(firebaseAuth);return {ok:false,message:'O seu email ainda não foi confirmado. Enviámos novamente a mensagem de confirmação para o seu email. Verifique também Spam/Lixo eletrónico.'};}
     let adminSnap=await ensureAdminProfile(cred.user);
     if(!adminSnap) adminSnap=await getDoc(doc(firebaseDb,'admins',cred.user.uid));
     if(!adminSnap.exists()||adminSnap.data().active===false){await signOut(firebaseAuth);return {ok:false,message:'Esta conta está autenticada, mas não tem permissão de acesso à Gestão Bilar.'};}
     setAuth(true);setMustChangePassword(adminSnap.data().mustChangePassword===true);return {ok:true,message:adminSnap.data().mustChangePassword===true?'FIRST_PASSWORD_CHANGE':''};
   }catch(error:any){return {ok:false,message:friendlyAuthError(error?.code||'')};}
 };
 const loginAdminWithGoogle=async():Promise<AuthResult>=>{
   if(!firebaseConfigured||!firebaseAuth||!firebaseDb)return {ok:false,message:'O Firebase ainda não está configurado para esta instalação.'};
   try{
     const provider=new GoogleAuthProvider();
     provider.setCustomParameters({prompt:'select_account'});
     const cred=await signInWithPopup(firebaseAuth,provider);
     if(!cred.user.emailVerified){await signOut(firebaseAuth);return {ok:false,message:'Confirme a sua conta Google e tente novamente.'};}
     const adminSnap=await ensureAdminProfile(cred.user);
     if(!adminSnap||adminSnap.data().active===false){await signOut(firebaseAuth);return {ok:false,message:'Esta conta Google não tem acesso autorizado à Gestão Bilar. Peça um convite a um administrador.'};}
     setAuth(true);return {ok:true};
   }catch(error:any){return {ok:false,message:friendlyAuthError(error?.code||'')};}
 };

 const resetAdminPassword=async(email:string):Promise<AuthResult>=>{
   if(!email.trim())return {ok:false,message:'Introduza o email profissional.'};
   if(!firebaseConfigured||!firebaseAuth)return {ok:false,message:'O Firebase ainda não está configurado para esta instalação.'};
   try{await sendPasswordResetEmail(firebaseAuth,email.trim());return {ok:true,message:'Enviámos um link de recuperação para o seu email profissional.'};}
   catch(error:any){return {ok:false,message:friendlyAuthError(error?.code||'')};}
 };
 const changeFirstPassword=async(newPassword:string):Promise<AuthResult>=>{
   if(newPassword.length<8)return {ok:false,message:'A nova palavra-passe deve ter pelo menos 8 caracteres.'};
   if(!firebaseAuth.currentUser||!firebaseDb)return {ok:false,message:'Sessão de autenticação indisponível.'};
   try{
     await updatePassword(firebaseAuth.currentUser,newPassword);
     await updateDoc(doc(firebaseDb,'admins',firebaseAuth.currentUser.uid),{mustChangePassword:false,updatedAt:new Date().toISOString()});
     setMustChangePassword(false);
     return {ok:true,message:'Palavra-passe alterada com sucesso.'};
   }catch(error:any){return {ok:false,message:friendlyAuthError(error?.code||'')};}
 };
 const logoutAdmin=()=>{if(firebaseAuth)void signOut(firebaseAuth);setAuth(false);setUser(null);setCurrentAdminRole(null);setMustChangePassword(false);};

 const mutate=(fn:(current:SiteData)=>SiteData)=>writeState(fn(data));
 const addContactMessage=async(p:Omit<ContactMessage,'id'|'createdAt'|'status'>)=>{
   if(!firebaseConfigured||!firebaseDb)throw new Error('O serviço de contacto não está configurado.');
   await addDoc(collection(firebaseDb,'contactMessages'),{...p,status:'new',createdAt:new Date().toISOString()});
 };
 const updateContactStatus=async(id:string,status:ContactMessage['status'])=>{requireAdmin();await updateDoc(doc(firebaseDb!,'contactMessages',id),{status});};
 const deleteContactMessage=async(id:string)=>{requireAdmin();await deleteDoc(doc(firebaseDb!,'contactMessages',id));};
 useEffect(()=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated)return;
   return onSnapshot(collection(firebaseDb,'contactMessages'),snap=>setData(current=>({...current,contactMessages:snap.docs.map(x=>({id:x.id,...x.data()} as ContactMessage))})));
 },[isAdminAuthenticated]);
 useEffect(()=>{
   if(!firebaseConfigured||!firebaseDb||!isAdminAuthenticated)return;
   return onSnapshot(collection(firebaseDb,'admins'),snap=>setAdminUsers(snap.docs.map(item=>({id:item.id,...item.data()} as AdminUser))));
 },[isAdminAuthenticated]);
 const updateAdminUser=async(id:string,p:Partial<AdminUser>)=>{requireAdmin();await updateDoc(doc(firebaseDb!,'admins',id),p);};
 const deleteAdminUser=async(id:string)=>{requireAdmin();if(user?.uid===id)throw new Error('Não é possível remover a conta que está em uso.');await deleteDoc(doc(firebaseDb!,'admins',id));};
 const generateTemporaryPassword=()=>{
   const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
   const values=new Uint32Array(14); crypto.getRandomValues(values);
   return Array.from(values,v=>chars[v%chars.length]).join('');
 };
 const createAdminAccess=async(name:string,email:string,role:AdminRole)=>{
   requireAdmin();
   if(currentAdminRole!=='Super Admin')throw new Error('Apenas o Super Admin pode criar utilizadores.');
   if(role==='Super Admin')throw new Error('Não é permitido criar outro Super Admin pelo painel.');
   const normalizedEmail=email.trim().toLowerCase();
   if(!normalizedEmail||!normalizedEmail.includes('@'))throw new Error('Introduza um email válido.');
   if(!firebaseDb)throw new Error('Firebase Firestore não está disponível.');
   const existing=await getDocs(collection(firebaseDb,'admins'));
   if(existing.docs.some(x=>String(x.data().email||x.data().username||'').toLowerCase()===normalizedEmail))throw new Error('Já existe um utilizador Bilar com este email.');
   const tempPassword=generateTemporaryPassword();
   const secondaryAuth=createSecondaryAuth();
   try{
     const cred=await createUserWithEmailAndPassword(secondaryAuth,normalizedEmail,tempPassword);
     await updateProfile(cred.user,{displayName:name.trim()});
     await sendEmailVerification(cred.user);
     const newUid=cred.user.uid;
     // A conta Auth é criada numa instância secundária para preservar a sessão do Super Admin.
     // O perfil Firestore é gravado depois de voltar à sessão principal, permitindo que
     // as Security Rules reconheçam o Super Admin como criador do novo perfil.
     await signOut(secondaryAuth);
     const adminRef=doc(firebaseDb,'admins',newUid);
     await setDoc(adminRef,{id:newUid,name:name.trim(),username:normalizedEmail,email:normalizedEmail,role,active:true,mustChangePassword:true,createdAt:new Date().toISOString(),createdBy:user?.uid||''});
     const loginUrl=`${window.location.origin}${window.location.pathname}`;
     return {email:normalizedEmail,role,inviteUrl:loginUrl,tempPassword};
   }catch(error:any){
     try{await signOut(secondaryAuth)}catch{};
     const code=String(error?.code||'');
     console.error('[Bilar] createAdminAccess failed', {code, message:error?.message});
     throw new Error(friendlyAuthError(code)+(code?' ['+code+']':''));
   }
 };
 const resendAdminCredentials=async(uid:string)=>{
   requireAdmin();
   if(currentAdminRole!=='Super Admin')throw new Error('Apenas o Super Admin pode gerir credenciais.');
   const adminSnap=await getDoc(doc(firebaseDb!,'admins',uid));
   if(!adminSnap.exists())throw new Error('Utilizador não encontrado.');
   const a=adminSnap.data() as any;
   const normalizedEmail=String(a.email||a.username||'').trim().toLowerCase();
   if(!normalizedEmail)throw new Error('Este utilizador não tem email válido.');
   // Firebase Spark não permite ao cliente redefinir a palavra-passe de outra conta.
   // Enviamos o fluxo oficial de recuperação, mantendo a criação inicial com palavra-passe temporária.
   await sendPasswordResetEmail(firebaseAuth,normalizedEmail);
   return {email:normalizedEmail,role:(a.role||'Editor') as AdminRole,inviteUrl:`${window.location.origin}${window.location.pathname}`,tempPassword:''};
 };
 const addLabProject=async(p:Omit<LabProject,'id'|'createdAt'|'updatedAt'>)=>{
   requireAdmin(); const now=new Date().toISOString();
   const ref=doc(collection(firebaseDb!,'labProjects'));
   const item:LabProject={...p,id:ref.id,createdAt:now,updatedAt:now,updatedBy:user?.email||user?.displayName||'Utilizador autenticado'};
   await setDoc(ref,item); setLabProjects(prev=>[item,...prev]);
 };
 const updateLabProject=async(id:string,p:Partial<LabProject>)=>{
   requireAdmin(); const updatedAt=new Date().toISOString();
   const updatedBy=user?.email||user?.displayName||'Utilizador autenticado';
   await updateDoc(doc(firebaseDb!,'labProjects',id),{...p,updatedAt,updatedBy});
   setLabProjects(prev=>prev.map(x=>x.id===id?{...x,...p,updatedAt,updatedBy}:x));
 };
 const deleteLabProject=async(id:string)=>{requireAdmin();await deleteDoc(doc(firebaseDb!,'labProjects',id));setLabProjects(prev=>prev.filter(x=>x.id!==id));};
 const addCareerOpening=async(p:Omit<CareerOpening,'id'>)=>add('careerOpenings',{...p,id:`careerOpenings-${Date.now()}`});
 const updateCareerOpening=async(id:string,p:Partial<CareerOpening>)=>update('careerOpenings',id,p);
 const deleteCareerOpening=async(id:string)=>remove('careerOpenings',id);
 const addPartner=async(p:Omit<Partner,'id'>)=>add('partners',{...p,id:`partners-${Date.now()}`});
 const updatePartner=async(id:string,p:Partial<Partner>)=>update('partners',id,p);
 const deletePartner=async(id:string)=>remove('partners',id);
 const addProduct=async(p:Omit<BilarProduct,'id'>,operation?:Pick<ProductOperation,'adminUrl'>)=>{
   requireAdmin();
   const product={...p,id:`bilarProducts-${Date.now()}`};
   await persistKey('bilarProducts',[...data.bilarProducts,product]);
   if(operation?.adminUrl?.trim()){
     const op:ProductOperation={productId:product.id,adminUrl:operation.adminUrl.trim(),updatedAt:new Date().toISOString()};
     await setDoc(doc(firebaseDb!,'productOperations',product.id),op);
     setProductOperations(prev=>[...prev.filter(x=>x.productId!==product.id),op]);
   }
 };
 const updateProduct=async(id:string,p:Partial<BilarProduct>,operation?:Pick<ProductOperation,'adminUrl'>)=>{
   requireAdmin();
   await update('bilarProducts',id,p);
   if(operation?.adminUrl?.trim()){
     const op:ProductOperation={productId:id,adminUrl:operation.adminUrl.trim(),updatedAt:new Date().toISOString()};
     await setDoc(doc(firebaseDb!,'productOperations',id),op);
     setProductOperations(prev=>[...prev.filter(x=>x.productId!==id),op]);
   }else if(operation){
     await deleteDoc(doc(firebaseDb!,'productOperations',id));
     setProductOperations(prev=>prev.filter(x=>x.productId!==id));
   }
 };
 const deleteProduct=async(id:string)=>{
   requireAdmin();
   await remove('bilarProducts',id);
   await deleteDoc(doc(firebaseDb!,'productOperations',id));
   setProductOperations(prev=>prev.filter(x=>x.productId!==id));
 };
 const exportBackupJson=()=>{const a=document.createElement('a');const backup={...data,productOperations};a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(backup,null,2));a.download=`bilar-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();};
 const importBackupJson=async(s:string)=>{try{const parsed=JSON.parse(s);const operations:Array<ProductOperation>=Array.isArray(parsed.productOperations)?parsed.productOperations:[];await writeState(normalize(parsed));for(const existing of productOperations){await deleteDoc(doc(firebaseDb!,'productOperations',existing.productId));}for(const op of operations){if(op?.productId&&op.adminUrl){await setDoc(doc(firebaseDb!,'productOperations',op.productId),op);}}setProductOperations(operations);return true;}catch{return false;}};
 const resetAllToDefaults=async()=>{await writeState(normalize(null));for(const op of productOperations){await deleteDoc(doc(firebaseDb!,'productOperations',op.productId));}setProductOperations([]);};
 const publicCompanyInfo={...data.companyInfo,stats:[{value:String(data.projects.filter(x=>x.status!=='archived').length),label:'Projectos publicados',icon:'FolderGit2'},{value:String(data.bilarProducts.filter(x=>x.active!==false).length),label:'Produtos Bilar',icon:'Package'},{value:String(data.teamMembers.filter(x=>x.active!==false).length),label:'Pessoas na equipa',icon:'Users'},{value:String(data.services.filter(x=>x.active!==false).length),label:'Serviços activos',icon:'BriefcaseBusiness'}]};
 const safe=(fn:any)=>(...args:any[])=>fn(...args).catch((e:any)=>{console.error(e);});
 const value=useMemo<SiteContextType>(()=>({
   currentAdminRole,mustChangePassword,
   ...data,companyInfo:publicCompanyInfo,labProjects,productOperations,adminUsers,isAdminAuthenticated,firebaseReady:firebaseConfigured,authReady,
   loginAdmin,loginAdminWithGoogle,resetAdminPassword,logoutAdmin,
   updateCompanyInfo:safe(async(u:any)=>persistKey('companyInfo',{...data.companyInfo,...u})),
   updateAdminSettings:safe(async(u:any)=>persistKey('adminSettings',{...data.adminSettings,...u})),
   addProduct,updateProduct,deleteProduct,
   addRevenueStream:safe((p:any)=>add('revenueStreams',p)),updateRevenueStream:safe((id:any,p:any)=>update('revenueStreams',id,p)),deleteRevenueStream:safe((id:any)=>remove('revenueStreams',id)),
   addBlogPost:safe((p:any)=>add('blogPosts',p)),updateBlogPost:safe((id:any,p:any)=>update('blogPosts',id,p)),deleteBlogPost:safe((id:any)=>remove('blogPosts',id)),
   addTeamMember:safe((p:any)=>add('teamMembers',p)),updateTeamMember:safe((id:any,p:any)=>update('teamMembers',id,p)),deleteTeamMember:safe((id:any)=>remove('teamMembers',id)),
   addService:safe((p:any)=>add('services',p)),updateService:safe((id:any,p:any)=>update('services',id,p)),deleteService:safe((id:any)=>remove('services',id)),
   addProject:safe((p:any)=>add('projects',p)),updateProject:safe((id:any,p:any)=>update('projects',id,p)),deleteProject:safe((id:any)=>remove('projects',id)),
   addSpecialist:safe((p:any)=>add('specialists',p)),updateSpecialist:safe((id:any,p:any)=>update('specialists',id,p)),deleteSpecialist:safe((id:any)=>remove('specialists',id)),
   addContactMessage,updateContactStatus,deleteContactMessage,
   addMedia:safe((p:any)=>add('mediaAssets',{...p,createdAt:new Date().toISOString()})),changeFirstPassword,deleteMedia:safe((id:any)=>remove('mediaAssets',id)),updateAdminUser,deleteAdminUser,createAdminAccess,resendAdminCredentials,addLabProject,updateLabProject,deleteLabProject,addCareerOpening:safe((p:any)=>addCareerOpening(p)),updateCareerOpening:safe((id:any,p:any)=>updateCareerOpening(id,p)),deleteCareerOpening:safe((id:any)=>deleteCareerOpening(id)),addPartner:safe((p:any)=>addPartner(p)),updatePartner:safe((id:any,p:any)=>updatePartner(id,p)),deletePartner:safe((id:any)=>deletePartner(id)),
   exportBackupJson,importBackupJson,resetAllToDefaults
 }),[data,publicCompanyInfo,labProjects,productOperations,adminUsers,isAdminAuthenticated,authReady,currentAdminRole,mustChangePassword]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
export const useSiteData=()=>{const c=useContext(Ctx);if(!c)throw new Error('useSiteData must be used within SiteProvider');return c};
