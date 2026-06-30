import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase web config. Values come from .env (VITE_* vars — see .env.example).
// NOTE: these values are NOT secret. They ship in the client bundle by design and are
// visible on the deployed site. The real security boundary is the Realtime Database
// security rules + App Check, NOT hiding this config. Keeping it in .env just keeps the
// public repo project-agnostic and avoids advertising the project in source.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Read-only public dashboard: data is world-readable per the RTDB rules, so no auth is
// needed here. (Anonymous sign-in was removed; the device writes with its own account.)
export { db };
