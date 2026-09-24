/**
 * TMDB connection settings - the only place that reads TMDB env vars.
 * The token lives in .env.local at the project root, never in source.
 */
export const TMDB_CONFIG = {
  apiBaseUrl: "https://api.themoviedb.org/3",
  /** Empty string when the env var is missing, so callers can check it instead of crashing. */
  readToken: import.meta.env.VITE_TMDB_READ_TOKEN?.trim() ?? "",
  /** Language of titles, overviews and genre names. */
  language: "en-US",
  /** Country whose age ratings (PG-13, TV-MA...) are shown. */
  region: "US",
  imageBaseUrl: "https://image.tmdb.org/t/p",
  /** TMDB image widths. Bigger files cost bandwidth on every card, so each use gets the smallest that looks sharp. */
  imageSizes: {
    poster: "w342",
    backdrop: "w1280",
    still: "w300",
  },
} as const;
