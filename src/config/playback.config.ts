/**
 * Playback settings shared by catalog cards, watch progress and the player.
 *
 * The actual stream is now supplied by NexStream at runtime from the title's TMDB ID.
 * `sampleVideoUrl` is retained only as a compatibility fallback for any older code
 * that still reads this config.
 */
export const PLAYBACK_CONFIG = {
  /** Legacy fallback only; normal playback uses NexStream. */
  sampleVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  format: "HD",
  /** While playing, save progress at most this often per title. */
  saveIntervalMs: 15_000,
  /** Past this percentage a movie or episode counts as finished and leaves Continue Watching. */
  completedAtPercent: 95,
  /** Newest progress entries loaded for Continue Watching and Watch History. */
  historyLimit: 100,
} as const;
