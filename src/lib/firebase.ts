// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "librosmart-qebdv",
  "appId": "1:341432740117:web:2e153b16411d7decde611c",
  "storageBucket": "librosmart-qebdv.firebasestorage.app",
  "apiKey": "AIzaSyDFxXCJOOpTFnJl60GWHG2bQofH9lw6twU",
  "authDomain": "librosmart-qebdv.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "341432740117"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseApp = app;
