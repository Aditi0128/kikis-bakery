// Firebase initialization using pure environment variables (no hardcoded keys)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Check if valid credentials exist in environment
export const isFirebaseConfigured = Boolean(
  apiKey &&
  apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  apiKey !== 'AIzaSyYourApiKeyHere' &&
  projectId &&
  projectId !== 'YOUR_PROJECT_ID' &&
  projectId !== 'your-bakery-project'
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    if (typeof window !== "undefined") {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        // Analytics is optional in dev
      }
    }
    console.info('✨ Connected to live Firebase project:', projectId);
  } catch (err) {
    console.warn('Firebase initialization error, falling back to local demo storage:', err);
  }
} else {
  console.warn('⚠️ Kiki Bakery: Running in local demo mode. Firebase keys not found in import.meta.env:', {
    VITE_FIREBASE_API_KEY: apiKey ? 'Found' : 'MISSING',
    VITE_FIREBASE_PROJECT_ID: projectId ? 'Found' : 'MISSING'
  });
}

export { app, auth, db, googleProvider, analytics };