export type VideoType = "movie" | "series";

export interface Video {
  id: string;
  title: string;
  description: string;
  /** Bundled asset import or remote poster URL. */
  thumbnail: string;
  /** Human-readable runtime, e.g. "2:14:30". */
  duration: string;
  genre: string;
  year: number;
  /** Content rating, e.g. "PG-13". */
  rating: string;
  /** Watched percentage, 0-100. */
  progress: number;
  videoUrl: string;
  type: VideoType;
}

/** A titled row of videos, as rendered by <CategoryRow />. */
export interface VideoCategory {
  name: string;
  items: Video[];
}
