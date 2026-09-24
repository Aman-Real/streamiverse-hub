/**
 * Playback settings shared by catalog cards, watch progress and the player.
 */
export const PLAYBACK_CONFIG = {
  /** Legacy fallback only; normal playback uses the CineSrc external player. */
  sampleVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  format: "HD",
  saveIntervalMs: 15_000,
  completedAtPercent: 95,
  historyLimit: 100,
} as const;
