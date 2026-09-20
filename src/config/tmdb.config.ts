/**
 * TMDB connection settings - the only place that reads TMDB env vars.
 * The token lives in .env.local at the project root, never in source.
 */
export const TMDB_CONFIG = {
  apiBaseUrl: "https://api.themoviedb.org/3",
  /** Empty string when the env var is missing, so callers can check it instead of crashing. */
  readToken: import.meta.env.VITE_TMDB_READ_TOKEN?.trim() ?? "",
} as const;
