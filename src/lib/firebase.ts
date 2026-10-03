import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração Web oficial do projecto Firebase da Bilar.
// A configuração Web do Firebase não é um segredo; a proteção real é feita
// por Authentication + Firestore Security Rules.
const firebaseConfig = {
  apiKey: 'AIzaSyC9ulRDRqxpeJ-mtroAemNs9EeSvF5puzg',
  authDomain: 'bilar-digitaltech-soluti-45012.firebaseapp.com',
  projectId: 'bilar-digitaltech-soluti-45012',
  storageBucket: 'bilar-digitaltech-soluti-45012.firebasestorage.app',
  messagingSenderId: '829441899383',
  appId: '1:829441899383:web:fc5c334dd6be7e66de7f72',
};

export const adminBootstrapEmail = 'bilarjojofernando@gmail.com';
export const firebaseConfigured = true;
export const firebaseApp = getApps()[0] || initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

// Creates an isolated Firebase Auth instance so the Super Admin can create
// a team account without replacing the currently signed-in Super Admin.
export const createSecondaryAuth = () => getAuth(initializeApp(firebaseConfig, `bilar-user-creation-${Date.now()}-${Math.random().toString(36).slice(2)}`));
