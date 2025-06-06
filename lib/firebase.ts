// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9-4wIWdGheBldDEL6SixDNYPipLePKBw",
  authDomain: "uddan-2-0.firebaseapp.com",
  databaseURL: "https://uddan-2-0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uddan-2-0",
  storageBucket: "uddan-2-0.appspot.com",
  messagingSenderId: "264260034605",
  appId: "1:264260034605:web:1bb3fac6c233e6003018a4",
  measurementId: "G-NYC9CSNKPJ"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Database = getDatabase(app);
const auth = getAuth(app);
// const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Optional

export { app, auth, db }; 