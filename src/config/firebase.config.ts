/**
 * Firebase web app config - the only place that reads the VITE_FIREBASE_* env vars.
 * These values aren't secrets (Firestore security rules protect the data), but keeping them
 * in .env.local lets development and production point at different Firebase projects.
 */
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;

/** The fields Auth and Firestore can't start without, keyed to the env var you'd edit. */
const REQUIRED_ENV_VARS: Partial<Record<keyof typeof FIREBASE_CONFIG, string>> = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

/** Required env vars that are empty or missing. An empty list means Firebase is configured. */
export const MISSING_FIREBASE_ENV_VARS = Object.entries(REQUIRED_ENV_VARS)
  .filter(([key]) => !FIREBASE_CONFIG[key as keyof typeof FIREBASE_CONFIG]?.trim())
  .map(([, envVar]) => envVar);
