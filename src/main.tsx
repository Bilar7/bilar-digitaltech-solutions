import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import AdminApp from './admin/AdminApp';
import {SiteProvider} from './context/SiteContext';
import {LanguageProvider} from './context/LanguageContext';
import './index.css';

const isAdmin=()=>{
  const path=window.location.pathname;
  const hash=window.location.hash;
  return path==='/admin'||path.startsWith('/admin/')||path==='/gestao-bilar'||path.startsWith('/gestao-bilar/')||hash==='#/admin'||hash.startsWith('#/admin/');
};

createRoot(document.getElementById('root')!).render(<React.StrictMode><SiteProvider><LanguageProvider>{isAdmin()?<AdminApp/>:<App/>}</LanguageProvider></SiteProvider></React.StrictMode>);
