import { createContext } from "react";
import type { Episode, Video } from "@/features/catalog/types";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import type { ProgressEntry } from "@/features/watch-progress/types";

export interface SaveProgressOptions extends ProgressReportOptions {
  /** Series: the episode that was playing. */
  episode?: Episode;
}

export interface WatchProgressContextValue {
  /** True until the signed-in viewer's progress has loaded. Guests are never loading. */
  loading: boolean;
  /** Started, unfinished titles, most recently watched first. */
  continueWatching: Video[];
  /** Everything watched, finished titles included, most recent first. */
  history: Video[];
  getProgress: (titleId: string) => ProgressEntry | undefined;
  /** The same video with the viewer's progress bars filled in. */
  withProgress: (video: Video) => Video;
  /** Records a player report. Throttled; `immediate` saves straight away. Does nothing for guests. */
  saveProgress: (video: Video, position: PlaybackPosition, options?: SaveProgressOptions) => void;
  removeProgress: (titleId: string) => void;
  clearWatchHistory: () => void;
}

export const WatchProgressContext = createContext<WatchProgressContextValue | null>(null);
