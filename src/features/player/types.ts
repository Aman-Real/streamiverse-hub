/** Where playback stands, as the player reports it. */
export interface PlaybackPosition {
  positionSeconds: number;
  durationSeconds: number;
}

export interface ProgressReportOptions {
  /** Save now rather than at the next throttled save: sent on pause and when the player closes. */
  immediate?: boolean;
}
