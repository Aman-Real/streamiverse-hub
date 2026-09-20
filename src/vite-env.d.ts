/// <reference types="vite/client" />

/**
 * Typed env vars. Vite only exposes VITE_-prefixed keys to browser code;
 * every other key in .env.local stays invisible to the app.
 */
interface ImportMetaEnv {
  /** TMDB "API Read Access Token" (the long one starting with eyJ), sent as a Bearer header. */
  readonly VITE_TMDB_READ_TOKEN?: string;

  /** Firebase web app config from Project settings > Your apps. Read only in config/firebase.config.ts. */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
