/** Playback preferences from the Settings screen. Stored on this device. */
export interface PlaybackSettings {
  /** Play the next episode of a series or anime automatically when one ends. */
  autoplayNext: boolean;
  /** On: stream at 1080p. Off: stream at 720p. */
  hdStreaming: boolean;
}
