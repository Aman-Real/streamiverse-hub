/**
 * Videasy player configuration.
 *
 * Videasy is used as the primary browser embed. No Videasy API key is required
 * for the documented TMDB-ID player URLs.
 */
export const VIDEASY_CONFIG = {
  playerBaseUrl: "https://player.videasy.net",
  /** Time without a successful iframe load before falling back to NexStream. */
  loadTimeoutMs: 12_000,
} as const;
