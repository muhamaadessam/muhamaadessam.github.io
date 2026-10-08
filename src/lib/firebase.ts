import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDoEPeeyaS49oznMj0EAeN-WRzXuPWS36I',
  appId: '1:12205873374:web:00f8bad7c16f55119d0a4f',
  messagingSenderId: '12205873374',
  projectId: 'portfolio-e05b2',
  authDomain: 'portfolio-e05b2.firebaseapp.com',
  storageBucket: 'portfolio-e05b2.firebasestorage.app',
  measurementId: 'G-L4M8W2KEYX',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
