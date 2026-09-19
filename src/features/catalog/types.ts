export type VideoType = "movie" | "series";

export interface Episode {
  id: string;
  season: number;
  number: number;
  title: string;
  description: string;
  /** Minutes. */
  runtime: number;
  /** Pre-formatted, e.g. "Oct 14, 2025". */
  airDate: string;
  /** Headline format badge, e.g. "Dolby Atmos". */
  format: string;
  /** Watched percentage, 0-100. */
  progress: number;
  thumbnail: string;
}

export interface CastMember {
  name: string;
  /** Character played, or crew role. */
  role: string;
  /** e.g. "4 Titles" or "Creator". */
  credits: string;
}

export interface Video {
  id: string;
  title: string;
  /** Second headline line, e.g. "Resurrection". */
  subtitle?: string;
  /** Story arc shown above the title on Explore. */
  tagline?: string;
  description: string;
  /** Bundled asset import or remote poster URL. */
  thumbnail: string;
  /** Wide hero image; falls back to the thumbnail. */
  backdrop?: string;
  /** Minutes (per episode for series). */
  runtime: number;
  genre: string;
  year: number;
  /** Content rating, e.g. "PG-13". */
  rating: string;
  /** Critic score out of 10. */
  score: number;
  /** Recommendation match, 0-100. */
  match: number;
  /** e.g. ["4K HDR", "Dolby Atmos"]. */
  formats: string[];
  /** Watched percentage, 0-100. */
  progress: number;
  videoUrl: string;
  type: VideoType;
  episodes?: Episode[];
  cast?: CastMember[];
}

/** A titled row of videos, as rendered by <CategoryRow />. */
export interface VideoCategory {
  name: string;
  items: Video[];
}
