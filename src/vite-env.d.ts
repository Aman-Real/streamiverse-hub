/// <reference types="vite/client" />

/**
 * Typed env vars. Vite only exposes VITE_-prefixed keys to browser code;
 * every other key in .env.local stays invisible to the app.
 */
interface ImportMetaEnv {
  /** TMDB "API Read Access Token" (the long one starting with eyJ), sent as a Bearer header. */
  readonly VITE_TMDB_READ_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
