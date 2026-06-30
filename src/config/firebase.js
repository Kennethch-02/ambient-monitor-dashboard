import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);
const db = getDatabase(app);

// The dashboard authenticates with a dedicated read-only account (email/password) so the
// Realtime Database rules can require `auth != null` for reads. Credentials come from
// .env (VITE_FIREBASE_AUTH_EMAIL / _PASSWORD). NOTE: like the rest of the web config these
// end up in the client bundle — keep this account read-only; real protection is the rules.
const signIn = async () => {
  const email = import.meta.env.VITE_FIREBASE_AUTH_EMAIL;
  const password = import.meta.env.VITE_FIREBASE_AUTH_PASSWORD;
  if (!email || !password) {
    console.warn('[firebase] No VITE_FIREBASE_AUTH_EMAIL / _PASSWORD set — reads may be denied by rules.');
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('[firebase] Authentication failed:', error);
  }
};

signIn();

export { db, auth };
