/**
 * Every localStorage key the app uses.
 * Keeping them here prevents typo-mismatches between read and write sites.
 * My List and watch progress live in Firestore; only per-device preferences are stored locally.
 */
export const STORAGE_KEYS = {
  /** Playback preferences from the Settings screen (autoplay next episode, HD streaming). */
  playbackSettings: "streamix:playback-settings",
} as const;
