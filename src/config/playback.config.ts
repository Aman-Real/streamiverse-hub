/**
 * Playback settings shared by catalog cards, watch progress and the player.
 */
export const PLAYBACK_CONFIG = {
  /** Legacy fallback only; normal playback uses the embedded external player (see player.config). */
  sampleVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  format: "HD",
  saveIntervalMs: 15_000,
  completedAtPercent: 95,
  historyLimit: 100,
  /** Stream quality in lines: HD Streaming on plays 1080p, off plays 720p. */
  quality: { hd: 1080, standard: 720 },
  /** Seconds the "Up next" card counts down before the next episode starts. */
  upNextCountdownSeconds: 5,
  /** A stream counts as ended this many seconds before its reported end, in case the player never sends "ended". */
  endedToleranceSeconds: 1,
  /** Settings a new device starts with. */
  defaultSettings: { autoplayNext: true, hdStreaming: true },
} as const;
