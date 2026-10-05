import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import AdminApp from './admin/AdminApp';
import {SiteProvider} from './context/SiteContext';
import {LanguageProvider} from './context/LanguageContext';
import './index.css';

const isAdmin=()=>{
  const normalize=(value:string)=>value.replace(/\/+$/, '');
  const path=normalize(window.location.pathname);
  const hash=normalize(window.location.hash.replace(/^#/, ''));
  const base=normalize(import.meta.env.BASE_URL || '/');
  const candidates=[
    '/admin',
    '/gestao-bilar',
    `${base}/admin`,
    `${base}/gestao-bilar`,
  ];

  return candidates.some((candidate) => {
    const exactMatch = path === candidate || hash === candidate;
    const nestedMatch = path.startsWith(`${candidate}/`) || hash.startsWith(`${candidate}/`);
    return exactMatch || nestedMatch;
  });
};

createRoot(document.getElementById('root')!).render(<React.StrictMode><SiteProvider><LanguageProvider>{isAdmin()?<AdminApp/>:<App/>}</LanguageProvider></SiteProvider></React.StrictMode>);
