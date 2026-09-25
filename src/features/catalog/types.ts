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
  /** e.g. "Cast" or "Crew". */
  credits: string;
}

export interface Video {
  /** Unique across movies and series, e.g. "movie-603" or "tv-1399" (see utils/titleId). */
  id: string;
  title: string;
  /** Second headline line, e.g. "Resurrection". */
  subtitle?: string;
  /** Story arc shown above the title on Explore. */
  tagline?: string;
  description: string;
  /** Poster image URL. */
  thumbnail: string;
  /** Wide hero image; falls back to the thumbnail. */
  backdrop?: string;
  /** Minutes (per episode for series). 0 when unknown: list results don't include it. */
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
  /** Series only: number of seasons, known from title details even before episodes load. */
  seasonCount?: number;
  episodes?: Episode[];
  cast?: CastMember[];
  /** YouTube video key of the official trailer, when TMDB has one (title details only). */
  trailerKey?: string;
}

/** A titled row of videos, as rendered by <CategoryRow />. */
export interface VideoCategory {
  name: string;
  items: Video[];
}

/** Everything the Explore screen shows for one title. */
export interface TitleDetails {
  video: Video;
  recommendations: Video[];
}

/**
 * The fields a card needs, copied off a Video and stored with My List and watch-progress entries,
 * so saved titles render without asking TMDB again.
 */
export type TitleSnapshot = Pick<
  Video,
  "id" | "type" | "title" | "thumbnail" | "backdrop" | "genre" | "year" | "runtime" | "rating" | "score" | "match" | "seasonCount"
>;
