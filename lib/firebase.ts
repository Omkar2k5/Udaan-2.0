// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics"; // Optional: if you use analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9-4wIWdGheBldDEL6SixDNYPipLePKBw",
  authDomain: "uddan-2-0.firebaseapp.com",
  databaseURL: "https://uddan-2-0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uddan-2-0",
  storageBucket: "uddan-2-0.appspot.com", // Corrected storageBucket domain
  messagingSenderId: "264260034605",
  appId: "1:264260034605:web:1bb3fac6c233e6003018a4",
  measurementId: "G-NYC9CSNKPJ" // Optional
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
// const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Optional

export { app, auth, db }; // Export db 