import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {SiteLanguage,t,TranslationKey} from '../i18n';
interface LanguageContextValue{language:SiteLanguage;setLanguage:(l:SiteLanguage)=>void;tr:(key:TranslationKey)=>string;}
const Ctx=createContext<LanguageContextValue|undefined>(undefined);
export const LanguageProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [language,setLanguageState]=useState<SiteLanguage>(()=>{try{return (localStorage.getItem('bilar_language') as SiteLanguage)||'pt-PT'}catch{return 'pt-PT'}});
 const setLanguage=(l:SiteLanguage)=>{setLanguageState(l);try{localStorage.setItem('bilar_language',l)}catch{}};
 useEffect(()=>{document.documentElement.lang=language==='en'?'en':language==='fr'?'fr':language;},[language]);
 const value=useMemo(()=>({language,setLanguage,tr:(key:TranslationKey)=>t(language,key)}),[language]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
export const useLanguage=()=>{const c=useContext(Ctx);if(!c)throw new Error('useLanguage must be used within LanguageProvider');return c};
