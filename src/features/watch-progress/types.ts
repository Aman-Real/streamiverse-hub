import type { TitleSnapshot } from "@/features/catalog/types";

/** One users/{uid}/progress/{titleId} document: where the viewer stopped a title. */
export interface ProgressEntry {
  /** Card data for the title, so Continue Watching renders without asking TMDB. */
  title: TitleSnapshot;
  /** Watched percentage of the movie or current episode, 0-100 (100 once finished). */
  progress: number;
  positionSeconds: number;
  durationSeconds: number;
  /** Series only: the episode being watched. Null for movies. */
  season: number | null;
  episode: number | null;
  episodeTitle: string | null;
  /** Server time of the last save (estimated locally until the save reaches the server). */
  updatedAt: Date | null;
}

/** What the app writes; the server stamps updatedAt. */
export type ProgressUpdate = Omit<ProgressEntry, "updatedAt">;
